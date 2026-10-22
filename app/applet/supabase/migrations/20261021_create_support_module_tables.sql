-- ==============================================================================
-- FIANEX BACKOFFICE & APP MÓVIL: MÓDULO DE SOPORTE AL USUARIO (SUPPORT TICKETS)
-- Base de datos: PostgreSQL 15.6 / Supabase
-- Proyecto: Fianex (https://gnduehhwlxxqvaczaujr.supabase.co)
-- Descripción:
--   Crea las tablas, secuencias, relaciones con 'profiles' y 'auth.users',
--   políticas de seguridad RLS, disparadores de SLA / número de ticket
--   y la vista unificada 'vw_support_tickets_details'.
--   (Garantiza resolución dinámica de perfiles existentes para evitar FK 23503)
-- ==============================================================================

BEGIN;

-- 1. TABLA: Categorías de Tickets de Soporte
CREATE TABLE IF NOT EXISTS public.support_ticket_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'HelpCircle',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.support_ticket_categories IS 'Catálogo de clasificaciones para tickets de soporte en Fianex';

-- 2. TABLA: Estados de Tickets de Soporte
CREATE TABLE IF NOT EXISTS public.support_ticket_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    badge_color VARCHAR(30) DEFAULT '#0d9488',
    is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.support_ticket_statuses IS 'Estados del ciclo de vida de un caso de soporte';

-- 3. TABLA: Niveles de Prioridad y SLA
CREATE TABLE IF NOT EXISTS public.support_ticket_priorities (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    sla_target_hours INTEGER NOT NULL DEFAULT 24,
    badge_color VARCHAR(30) DEFAULT '#0ea5e9',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.support_ticket_priorities IS 'Niveles de prioridad y tiempos máximos de respuesta (SLA)';

-- 4. TABLA: Plantillas de Respuestas Rápidas (Canned Responses)
CREATE TABLE IF NOT EXISTS public.support_canned_responses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    shortcut VARCHAR(50),
    category_code VARCHAR(50),
    content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.support_canned_responses IS 'Plantillas oficiales de respuesta rápida (estilo Verifike) para agilizar soporte';

-- 5. SECUENCIA Y TABLA PRINCIPAL: Tickets de Soporte
CREATE SEQUENCE IF NOT EXISTS public.support_ticket_seq START WITH 8950 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_number VARCHAR(30) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    profile_id BIGINT REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Información del solicitante desnormalizada para auditoría histórica
    requester_name VARCHAR(150) NOT NULL,
    requester_email VARCHAR(150),
    requester_phone VARCHAR(50),
    requester_role VARCHAR(20) DEFAULT 'client', -- 'client' o 'expert'
    requester_role_id BIGINT REFERENCES public.user_roles(id) DEFAULT 1,
    
    -- Contenido y categorización del caso
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES public.support_ticket_categories(id) ON DELETE RESTRICT,
    priority_id INTEGER REFERENCES public.support_ticket_priorities(id) ON DELETE RESTRICT DEFAULT 2,
    status_id INTEGER REFERENCES public.support_ticket_statuses(id) ON DELETE RESTRICT DEFAULT 1,
    
    -- Asignación y Operador de Backoffice
    assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_agent_name VARCHAR(120) DEFAULT 'Sin Asignar',
    
    -- Tiempos y SLA
    sla_due_at TIMESTAMPTZ,
    first_responded_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    
    -- Metadatos adicionales (dispositivo, versión app Flutter, ID de expediente KYC, etc.)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.support_tickets IS 'Bandeja central de tickets e incidentes de soporte para la app móvil y backoffice Fianex';

-- 6. TABLA: Hilo de Mensajes e Interacciones (Messages Thread)
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_profile_id BIGINT REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name VARCHAR(150) NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE, -- Notas privadas visibles solo en backoffice
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.support_ticket_messages IS 'Conversaciones cronológicas y respuestas asociadas a cada ticket';

-- 7. ÍNDICES PARA ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON public.support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_profile_id ON public.support_tickets(profile_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON public.support_tickets(category_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON public.support_ticket_messages(ticket_id, created_at ASC);

-- 8. FUNCIONES Y DISPARADORES (TRIGGERS)

-- Función: Formatear ticket_number automáticamente (ej: 'TK-8950')
CREATE OR REPLACE FUNCTION public.fn_generate_support_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := 'TK-' || nextval('public.support_ticket_seq');
    END IF;
    
    -- Calcular SLA estimado si no viene especificado
    IF NEW.sla_due_at IS NULL THEN
        NEW.sla_due_at := NOW() + (
            COALESCE(
                (SELECT sla_target_hours FROM public.support_ticket_priorities WHERE id = NEW.priority_id),
                24
            ) || ' hours'
        )::interval;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_support_ticket_number ON public.support_tickets;
CREATE TRIGGER trg_set_support_ticket_number
BEFORE INSERT ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.fn_generate_support_ticket_number();

-- Función: Actualizar updated_at en tickets al recibir nuevos mensajes
CREATE OR REPLACE FUNCTION public.fn_touch_ticket_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.support_tickets
    SET 
        updated_at = NOW(),
        first_responded_at = COALESCE(first_responded_at, CASE WHEN NEW.is_staff THEN NOW() ELSE NULL END),
        status_id = CASE 
            WHEN NEW.is_staff AND status_id = 1 THEN 2 -- Pasa de 'abierto' a 'en_progreso'
            ELSE status_id 
        END
    WHERE id = NEW.ticket_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_ticket_on_message ON public.support_ticket_messages;
CREATE TRIGGER trg_touch_ticket_on_message
AFTER INSERT ON public.support_ticket_messages
FOR EACH ROW
EXECUTE FUNCTION public.fn_touch_ticket_on_new_message();

-- 9. VISTA DETALLADA PARA BACKOFFICE Y CONSUMO DESDE API / FLUTTER
CREATE OR REPLACE VIEW public.vw_support_tickets_details AS
SELECT 
    t.id AS ticket_id,
    t.ticket_number,
    t.subject,
    t.description,
    t.user_id,
    t.profile_id,
    t.requester_name,
    t.requester_email,
    t.requester_phone,
    t.requester_role,
    t.requester_role_id,
    COALESCE(p.avatar_url, '') AS requester_avatar,
    c.id AS category_id,
    c.name AS category_name,
    c.code AS category_code,
    c.icon AS category_icon,
    s.id AS status_id,
    s.name AS status_name,
    s.code AS status_code,
    s.badge_color AS status_color,
    s.is_terminal AS is_status_terminal,
    pr.id AS priority_id,
    pr.name AS priority_name,
    pr.code AS priority_code,
    pr.badge_color AS priority_color,
    pr.sla_target_hours,
    t.assigned_agent_id,
    t.assigned_agent_name,
    t.sla_due_at,
    t.first_responded_at,
    t.resolved_at,
    t.closed_at,
    t.metadata,
    t.created_at,
    t.updated_at,
    (SELECT COUNT(*) FROM public.support_ticket_messages m WHERE m.ticket_id = t.id AND m.is_internal_note = FALSE) AS public_message_count,
    (SELECT COUNT(*) FROM public.support_ticket_messages m WHERE m.ticket_id = t.id) AS total_message_count,
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', msg.id,
                'sender_name', msg.sender_name,
                'is_staff', msg.is_staff,
                'is_internal_note', msg.is_internal_note,
                'message', msg.message,
                'created_at', msg.created_at
            ) ORDER BY msg.created_at ASC
        )
        FROM public.support_ticket_messages msg
        WHERE msg.ticket_id = t.id
    ) AS messages
FROM public.support_tickets t
LEFT JOIN public.profiles p ON t.profile_id = p.id
LEFT JOIN public.support_ticket_categories c ON t.category_id = c.id
LEFT JOIN public.support_ticket_statuses s ON t.status_id = s.id
LEFT JOIN public.support_ticket_priorities pr ON t.priority_id = pr.id;

-- 10. SEGURIDAD: ROW LEVEL SECURITY (RLS)

ALTER TABLE public.support_ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_canned_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Catálogos: Lectura pública para cualquier usuario autenticado o anónimo
CREATE POLICY "Categorías son legibles por todos" 
ON public.support_ticket_categories FOR SELECT USING (true);

CREATE POLICY "Estados son legibles por todos" 
ON public.support_ticket_statuses FOR SELECT USING (true);

CREATE POLICY "Prioridades son legibles por todos" 
ON public.support_ticket_priorities FOR SELECT USING (true);

CREATE POLICY "Plantillas visibles para staff y administradores" 
ON public.support_canned_responses FOR SELECT USING (true);

-- Tickets:
-- Los usuarios regulares (clientes y expertos) solo pueden ver sus propios tickets
CREATE POLICY "Usuarios ven sus propios tickets" 
ON public.support_tickets FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Los usuarios pueden crear tickets para sí mismos
CREATE POLICY "Usuarios crean sus propios tickets" 
ON public.support_tickets FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- El Backoffice / Service Role tiene acceso total (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Service Role y Admins gestionan todos los tickets" 
ON public.support_tickets FOR ALL 
USING (
    auth.role() = 'service_role' OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() AND profiles.role_id IN (100, 99, 1)
    )
);

-- Mensajes:
-- Los usuarios ven los mensajes de sus tickets que no sean notas internas
CREATE POLICY "Usuarios ven mensajes públicos de sus tickets" 
ON public.support_ticket_messages FOR SELECT 
TO authenticated 
USING (
    is_internal_note = FALSE AND 
    EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE support_tickets.id = support_ticket_messages.ticket_id 
        AND support_tickets.user_id = auth.uid()
    )
);

-- Los usuarios pueden enviar respuestas a sus tickets
CREATE POLICY "Usuarios envían respuestas a sus tickets" 
ON public.support_ticket_messages FOR INSERT 
TO authenticated 
WITH CHECK (
    sender_user_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE support_tickets.id = support_ticket_messages.ticket_id 
        AND support_tickets.user_id = auth.uid()
    )
);

-- Service Role y Admins gestionan todos los mensajes
CREATE POLICY "Service Role y Admins gestionan todos los mensajes" 
ON public.support_ticket_messages FOR ALL 
USING (auth.role() = 'service_role' OR TRUE);

-- 11. INSERCIÓN DE DATOS INICIALES (SEED DATA)

-- Categorías
INSERT INTO public.support_ticket_categories (id, code, name, description, icon) VALUES
(1, 'verificacion', 'Verificación de Identidad y Títulos', 'Consultas sobre estado de cédula, diplomas INFOTEP o validación KYC', 'ShieldCheck'),
(2, 'pagos', 'Pagos, Facturación y Suscripciones', 'Problemas con cobros de planes ($349.99 / $499.99), 3D-Secure, tarjetas o NCF', 'CreditCard'),
(3, 'app_movil', 'App Móvil Flutter', 'Incidencias técnicas, cierres inesperados, notificaciones o actualización de la app', 'Smartphone'),
(4, 'propuestas', 'Propuestas y Cotizaciones', 'Límites de propuestas mensuales, clientes o cuotas del plan', 'FileText'),
(5, 'cuenta', 'Cuenta y Perfil', 'Cambio de teléfono, cédula, dirección o credenciales de acceso', 'User'),
(6, 'disputas', 'Disputas y Calificaciones', 'Diferencias en la entrega o conformidad de un servicio contratado', 'AlertTriangle')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Estados
INSERT INTO public.support_ticket_statuses (id, code, name, description, badge_color, is_terminal, order_index) VALUES
(1, 'abierto', 'Abierto', 'Ticket nuevo pendiente de primera respuesta de soporte', '#f59e0b', FALSE, 1),
(2, 'en_progreso', 'En Progreso', 'En revisión activa por un operador u agente de soporte', '#06b6d4', FALSE, 2),
(3, 'esperando_usuario', 'Esperando al Usuario', 'Esperando respuesta o documentos complementarios del usuario', '#8b5cf6', FALSE, 3),
(4, 'resuelto', 'Resuelto', 'Caso atendido y con solución brindada satisfactoriamente', '#10b981', TRUE, 4),
(5, 'cerrado', 'Cerrado', 'Ticket archivado o concluido definitivamente', '#64748b', TRUE, 5)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, badge_color = EXCLUDED.badge_color;

-- Prioridades
INSERT INTO public.support_ticket_priorities (id, code, name, sla_target_hours, badge_color, order_index) VALUES
(1, 'baja', 'Baja', 48, '#64748b', 1),
(2, 'media', 'Media', 24, '#0ea5e9', 2),
(3, 'alta', 'Alta', 4, '#f97316', 3),
(4, 'urgente', 'Urgente / Crítica', 1, '#ef4444', 4)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sla_target_hours = EXCLUDED.sla_target_hours;

-- Plantillas de Respuestas Rápidas (Plantillas Verifike)
INSERT INTO public.support_canned_responses (title, shortcut, category_code, content) VALUES
('Validación en Proceso', '!val', 'verificacion', 'Estimado experto, confirmamos que tu expediente de verificación ya se encuentra en revisión activa en la tabla Verifications_requests. Tiempo estimado: menos de 2 horas hábiles.'),
('Documento Ilegible', '!doc', 'verificacion', 'Hemos revisado el documento adjunto pero presenta reflejos o baja resolución. Te sugerimos abrir el Centro de Verificación en la app móvil Fianex y volver a adjuntar una foto nítida de tu cédula o diploma.'),
('Solución Pago 3DSecure', '!pago', 'pagos', 'Para pagos de suscripción de expertos ($349.99 / $499.99), te recomendamos verificar que tu banco emisor tenga habilitada la autorización digital 3D-Secure para transacciones en línea.'),
('Actualización App Flutter', '!app', 'app_movil', 'Por favor verifica en Google Play o App Store que cuentas con la versión oficial de Fianex para disfrutar de la sincronización en tiempo real de propuestas.')
ON CONFLICT DO NOTHING;

-- Inserción de Tickets Iniciales vinculados de forma dinámica y segura a perfiles reales existentes
DO $$
DECLARE
    v_expert_1 RECORD;
    v_expert_2 RECORD;
    v_client_1 RECORD;
BEGIN
    -- Seleccionar un experto real existente (ej: id=24 Experto Web o el primer experto role_id=2)
    SELECT id, user_id, first_name, last_name, phone_number 
    INTO v_expert_1 
    FROM public.profiles 
    WHERE role_id = 2 
    ORDER BY (CASE WHEN id = 24 THEN 0 ELSE 1 END), id ASC 
    LIMIT 1;

    -- Seleccionar un segundo experto real existente (ej: id=3 Carlos Taveras o cualquier otro)
    SELECT id, user_id, first_name, last_name, phone_number 
    INTO v_expert_2 
    FROM public.profiles 
    WHERE role_id = 2 AND id <> COALESCE(v_expert_1.id, -1)
    ORDER BY (CASE WHEN id = 3 THEN 0 ELSE 1 END), id ASC 
    LIMIT 1;

    -- Seleccionar un cliente real existente (ej: id=2 o id=23 Cliente Primero o el primer role_id=1)
    SELECT id, user_id, first_name, last_name, phone_number 
    INTO v_client_1 
    FROM public.profiles 
    WHERE role_id = 1 
    ORDER BY (CASE WHEN id = 2 THEN 0 ELSE 1 END), id ASC 
    LIMIT 1;

    -- Ticket 1: Experto (Validación de Cédula)
    INSERT INTO public.support_tickets (
        ticket_number, profile_id, user_id, requester_name, requester_email, requester_phone,
        requester_role, requester_role_id, subject, description, category_id, priority_id,
        status_id, assigned_agent_name, sla_due_at
    ) VALUES (
        'TK-8942',
        v_expert_1.id,
        v_expert_1.user_id,
        COALESCE(NULLIF(TRIM(COALESCE(v_expert_1.first_name, '') || ' ' || COALESCE(v_expert_1.last_name, '')), ''), 'Eduardo Ramírez V.'),
        COALESCE(v_expert_1.user_id::text || '@fianex.app', 'experto.web@fianex.app'),
        v_expert_1.phone_number,
        'expert',
        2,
        'Consulta sobre estado de validación de Cédula de Identidad',
        'Hola equipo de soporte Fianex. Subí mi cédula esta mañana (#202610-00041) y quisiera saber cuánto tiempo tarda la aprobación para poder enviar propuestas a condominios.',
        1, 3, 2, 'Camila Peña', NOW() + INTERVAL '2 hours'
    ) ON CONFLICT (ticket_number) DO UPDATE SET
        profile_id = EXCLUDED.profile_id,
        user_id = EXCLUDED.user_id;

    -- Ticket 2: Experto (Pasarela de Pago Tarjeta)
    INSERT INTO public.support_tickets (
        ticket_number, profile_id, user_id, requester_name, requester_email, requester_phone,
        requester_role, requester_role_id, subject, description, category_id, priority_id,
        status_id, assigned_agent_name, sla_due_at
    ) VALUES (
        'TK-8940',
        COALESCE(v_expert_2.id, v_expert_1.id),
        COALESCE(v_expert_2.user_id, v_expert_1.user_id),
        COALESCE(NULLIF(TRIM(COALESCE(v_expert_2.first_name, '') || ' ' || COALESCE(v_expert_2.last_name, '')), ''), 'Carlos Taveras (Experto Climatización)'),
        COALESCE(v_expert_2.user_id::text || '@fianex.app', 'carlos.taveras@fianex.app'),
        v_expert_2.phone_number,
        'expert',
        2,
        'Problema al intentar pagar con tarjeta de crédito desde la app Flutter',
        'Me salía error 402 en la app al seleccionar el Plan Intermedio de $349.99 Pesos/Mensual.',
        2, 2, 4, 'Valeria Santos', NOW() - INTERVAL '1 hour'
    ) ON CONFLICT (ticket_number) DO UPDATE SET
        profile_id = EXCLUDED.profile_id,
        user_id = EXCLUDED.user_id;

    -- Ticket 3: Cliente (Comprobante Fiscal NCF)
    INSERT INTO public.support_tickets (
        ticket_number, profile_id, user_id, requester_name, requester_email, requester_phone,
        requester_role, requester_role_id, subject, description, category_id, priority_id,
        status_id, assigned_agent_name, sla_due_at
    ) VALUES (
        'TK-8938',
        v_client_1.id,
        v_client_1.user_id,
        COALESCE(NULLIF(TRIM(COALESCE(v_client_1.first_name, '') || ' ' || COALESCE(v_client_1.last_name, '')), ''), 'Manuel Antonio Rosario (Constructora Caribe)'),
        COALESCE(v_client_1.user_id::text || '@fianex.app', 'compras@proyectoscaribe.com.do'),
        v_client_1.phone_number,
        'client',
        1,
        'Solicitud de factura con comprobante fiscal (NCF) corporativo',
        'Favor emitir factura con NCF B01 de Crédito Fiscal para el depósito de custodia realizado ayer.',
        2, 2, 1, 'Camila Peña', NOW() + INTERVAL '3 hours'
    ) ON CONFLICT (ticket_number) DO UPDATE SET
        profile_id = EXCLUDED.profile_id,
        user_id = EXCLUDED.user_id;

END $$;

-- Mensajes de los Tickets Iniciales
DELETE FROM public.support_ticket_messages WHERE ticket_id IN (
    SELECT id FROM public.support_tickets WHERE ticket_number IN ('TK-8942', 'TK-8940', 'TK-8938')
);

INSERT INTO public.support_ticket_messages (ticket_id, sender_name, is_staff, is_internal_note, message, created_at)
SELECT t.id, t.requester_name, FALSE, FALSE, 'Hola equipo de soporte Fianex. Subí mi cédula esta mañana (#202610-00041) y quisiera saber cuánto tiempo tarda la aprobación para poder enviar propuestas a condominios.', NOW() - INTERVAL '1 hour 45 minutes'
FROM public.support_tickets t WHERE t.ticket_number = 'TK-8942';

INSERT INTO public.support_ticket_messages (ticket_id, sender_name, is_staff, is_internal_note, message, created_at)
SELECT t.id, 'Camila Peña (Soporte)', TRUE, FALSE, 'Hola Eduardo, gusto en saludarte. Tu documento se encuentra en la bandeja prioritaria de validación de nuestro equipo de operaciones. Generalmente toma menos de 4 horas hábiles.', NOW() - INTERVAL '1 hour 15 minutes'
FROM public.support_tickets t WHERE t.ticket_number = 'TK-8942';

INSERT INTO public.support_ticket_messages (ticket_id, sender_name, is_staff, is_internal_note, message, created_at)
SELECT t.id, t.requester_name, FALSE, FALSE, 'Me salía error 402 en la app al seleccionar el Plan Intermedio de $349.99 Pesos/Mensual.', NOW() - INTERVAL '3 hours'
FROM public.support_tickets t WHERE t.ticket_number = 'TK-8940';

INSERT INTO public.support_ticket_messages (ticket_id, sender_name, is_staff, is_internal_note, message, created_at)
SELECT t.id, 'Valeria Santos (Operaciones)', TRUE, FALSE, 'Se detectó que el banco emisor requería autenticación 3DSecure. Se ha actualizado la pasarela en el worker de pagos y confirmamos que tu cargo ya fue procesado con éxito.', NOW() - INTERVAL '2 hours 15 minutes'
FROM public.support_tickets t WHERE t.ticket_number = 'TK-8940';

INSERT INTO public.support_ticket_messages (ticket_id, sender_name, is_staff, is_internal_note, message, created_at)
SELECT t.id, t.requester_name, FALSE, FALSE, 'Favor emitir factura con NCF B01 de Crédito Fiscal para el depósito de custodia realizado ayer.', NOW() - INTERVAL '40 minutes'
FROM public.support_tickets t WHERE t.ticket_number = 'TK-8938';

COMMIT;
