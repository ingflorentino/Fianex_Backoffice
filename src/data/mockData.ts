import {
  AdminUser,
  AppUser,
  VerificationRequest,
  Transaction,
  SupportTicket,
  AuditLog,
  CloudflareWorker,
  SupabaseConfig,
  PlanFeatureComparison
} from '../types';

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-001',
    name: 'Carlos Rivera',
    email: 'rivertmc@gmail.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Dirección de Operaciones & Tecnología'
  },
  {
    id: 'adm-002',
    name: 'Valeria Santos',
    email: 'vsantos@fianex.app',
    role: 'ops_admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    department: 'Operaciones & Verificación'
  },
  {
    id: 'adm-003',
    name: 'Héctor De La Cruz',
    email: 'hdelacruz@fianex.app',
    role: 'system_auditor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'Auditoría & Cumplimiento Normativo'
  },
  {
    id: 'adm-004',
    name: 'Camila Peña',
    email: 'cpena@fianex.app',
    role: 'support_agent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    department: 'Centro de Soporte al Usuario'
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-exp-001',
    name: 'Ing. Marcos Domínguez',
    email: 'marcos.dominguez@electricpro.do',
    phone: '+1 (809) 555-0142',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    type: 'expert',
    status: 'active',
    registeredAt: '2026-08-14',
    city: 'Santo Domingo',
    expertCategory: 'Profesional',
    expertProfession: 'Ingeniero Eléctrico & Automatización',
    expertPlan: 'premium',
    verificationStatus: 'fully_verified',
    rating: 4.9,
    completedJobs: 64,
    monthlyProposalsUsed: 42,
    monthlyProposalsLimit: 'unlimited',
    idNumber: '402-2349182-1',
    idType: 'Cédula',
    bio: 'Especialista en instalaciones eléctricas de alta y baja tensión, certificación CODIA al día y sistemas solares fotovoltaicos.'
  },
  {
    id: 'usr-exp-002',
    name: 'José Almonte Santana',
    email: 'j.almonte@refritec.com',
    phone: '+1 (809) 555-0199',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    type: 'expert',
    status: 'active',
    registeredAt: '2026-10-18',
    city: 'Santiago de los Caballeros',
    expertCategory: 'Tecnico',
    expertProfession: 'Técnico en Refrigeración y Climatización',
    expertPlan: 'intermedio',
    verificationStatus: 'cert_pending',
    rating: 4.8,
    completedJobs: 28,
    monthlyProposalsUsed: 18,
    monthlyProposalsLimit: 30,
    idNumber: '031-0192834-8',
    idType: 'Cédula',
    bio: 'Certificado INFOTEP en sistemas inverter, VRF y mantenimiento preventivo industrial y residencial.'
  },
  {
    id: 'usr-exp-003',
    name: 'Eduardo Ramírez V.',
    email: 'eduardo.ramirez@plomeriaexpress.do',
    phone: '+1 (829) 555-0312',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    type: 'expert',
    status: 'active',
    registeredAt: '2026-10-19',
    city: 'Distrito Nacional',
    expertCategory: 'Tecnico',
    expertProfession: 'Técnico Plomero & Redes Hidrosanitarias',
    expertPlan: 'basico',
    verificationStatus: 'id_pending',
    rating: 4.6,
    completedJobs: 11,
    monthlyProposalsUsed: 8,
    monthlyProposalsLimit: 10,
    idNumber: '202610-00041',
    idType: 'Cédula',
    bio: 'Reparaciones de urgencia, detección de fugas con ultrasonido e instalación de bombas hidroneumáticas.'
  },
  {
    id: 'usr-exp-004',
    name: 'Dra. Carmen Morales',
    email: 'cmorales@legaltech.do',
    phone: '+1 (809) 555-0722',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    type: 'expert',
    status: 'active',
    registeredAt: '2026-09-02',
    city: 'Santo Domingo Este',
    expertCategory: 'Profesional',
    expertProfession: 'Abogada en Contratos & Notaría',
    expertPlan: 'premium',
    verificationStatus: 'fully_verified',
    rating: 5.0,
    completedJobs: 49,
    monthlyProposalsUsed: 27,
    monthlyProposalsLimit: 'unlimited',
    idNumber: '001-9872134-5',
    idType: 'Cédula',
    bio: 'Colegiada CARD. Asesoría jurídica preventiva para empresas, bienes raíces y contratos civiles.'
  },
  {
    id: 'usr-exp-005',
    name: 'Ramiro Polanco',
    email: 'rpolanco@solucioneshvac.do',
    phone: '+1 (809) 555-0451',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    type: 'expert',
    status: 'pending',
    registeredAt: '2026-10-20',
    city: 'La Romana',
    expertCategory: 'Tecnico',
    expertProfession: 'Técnico Electricista Residencial',
    expertPlan: 'basico',
    verificationStatus: 'id_pending',
    rating: 0,
    completedJobs: 0,
    monthlyProposalsUsed: 0,
    monthlyProposalsLimit: 10,
    idNumber: '026-0048123-9',
    idType: 'Cédula',
    bio: 'Técnico electricista egresado de politécnico industrial, listo para prestar servicios.'
  },
  {
    id: 'usr-exp-006',
    name: 'Arq. Mateo Solís',
    email: 'msolis@espacios.design',
    phone: '+1 (829) 555-0819',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    type: 'expert',
    status: 'active',
    registeredAt: '2026-07-15',
    city: 'Santiago',
    expertCategory: 'Especialista',
    expertProfession: 'Diseño de Interiores & Remodelaciones',
    expertPlan: 'intermedio',
    verificationStatus: 'fully_verified',
    rating: 4.95,
    completedJobs: 34,
    monthlyProposalsUsed: 19,
    monthlyProposalsLimit: 30,
    idNumber: '037-1284729-4',
    idType: 'Cédula',
    bio: 'Visualización arquitectónica 3D, remodelaciones comerciales y supervisión de acabados.'
  },
  // Clients
  {
    id: 'usr-cli-001',
    name: 'Constructora & Proyectos Caribe SRL',
    email: 'compras@proyectoscaribe.com.do',
    phone: '+1 (809) 567-8900',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    type: 'client',
    status: 'active',
    registeredAt: '2026-06-10',
    city: 'Santo Domingo',
    verificationStatus: 'fully_verified',
    rating: 4.9,
    completedJobs: 82
  },
  {
    id: 'usr-cli-002',
    name: 'Residencial Los Álamos (Adm. Condominio)',
    email: 'administracion@losalamoscondo.com',
    phone: '+1 (809) 541-2311',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80',
    type: 'client',
    status: 'active',
    registeredAt: '2026-08-22',
    city: 'Santiago',
    verificationStatus: 'fully_verified',
    rating: 4.8,
    completedJobs: 37
  },
  {
    id: 'usr-cli-003',
    name: 'Carolina Méndez',
    email: 'carolina.mendez92@gmail.com',
    phone: '+1 (829) 441-9081',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    type: 'client',
    status: 'active',
    registeredAt: '2026-10-12',
    city: 'Punta Cana',
    verificationStatus: 'id_approved',
    rating: 5.0,
    completedJobs: 4
  },
  {
    id: 'usr-cli-004',
    name: 'Restaurante Bocana Marina',
    email: 'gerencia@bocanamarina.com',
    phone: '+1 (809) 523-4411',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80',
    type: 'client',
    status: 'active',
    registeredAt: '2026-09-18',
    city: 'Boca Chica',
    verificationStatus: 'fully_verified',
    rating: 4.7,
    completedJobs: 19
  }
];

export const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: '#202610-00041', // Matching the user's mobile screen attachment #202610-00041
    userId: 'usr-exp-003',
    userName: 'Eduardo Ramírez V.',
    userEmail: 'eduardo.ramirez@plomeriaexpress.do',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    type: 'identity',
    docType: 'Cédula',
    idNumber: '001-1829472-3',
    submittedAt: '2026-10-20 09:14 AM',
    status: 'pending',
    documentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    documentBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    documentMeta: {
      issuer: 'Junta Central Electoral (JCE)',
      issueDate: '2021-04-12',
      expiryDate: '2031-04-12',
      ocrMatchScore: 98.4,
      fileSize: '2.4 MB PDF/JPG'
    }
  },
  {
    id: '#202610-00042',
    userId: 'usr-exp-002',
    userName: 'José Almonte Santana',
    userEmail: 'j.almonte@refritec.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    type: 'professional_category',
    docType: 'Título Técnico',
    category: 'Tecnico',
    profession: 'Técnico en Refrigeración y Climatización',
    submittedAt: '2026-10-20 10:25 AM',
    status: 'pending',
    documentUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    documentMeta: {
      issuer: 'Instituto Nacional de Formación Técnico Profesional (INFOTEP)',
      issueDate: '2023-11-20',
      expiryDate: 'Permanente',
      ocrMatchScore: 96.8,
      fileSize: '3.1 MB PDF'
    }
  },
  {
    id: '#202610-00039',
    userId: 'usr-exp-005',
    userName: 'Ramiro Polanco',
    userEmail: 'rpolanco@solucioneshvac.do',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    type: 'identity',
    docType: 'Cédula',
    idNumber: '026-0048123-9',
    submittedAt: '2026-10-19 04:30 PM',
    status: 'pending',
    documentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    documentMeta: {
      issuer: 'Junta Central Electoral (JCE)',
      issueDate: '2022-08-10',
      expiryDate: '2032-08-10',
      ocrMatchScore: 91.2,
      fileSize: '1.8 MB JPG'
    }
  },
  {
    id: '#202610-00035',
    userId: 'usr-exp-001',
    userName: 'Ing. Marcos Domínguez',
    userEmail: 'marcos.dominguez@electricpro.do',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    type: 'professional_category',
    docType: 'Diploma Universitario',
    category: 'Profesional',
    profession: 'Ingeniero Eléctrico & Automatización',
    submittedAt: '2026-10-15 11:20 AM',
    status: 'approved',
    reviewedAt: '2026-10-15 02:45 PM',
    reviewedBy: 'Valeria Santos (Operaciones)',
    reviewerNotes: 'Validado con registro CODIA número COD-44192. Documento con sellos legítimos.',
    documentUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    documentMeta: {
      issuer: 'Universidad Autónoma de Santo Domingo (UASD)',
      issueDate: '2019-10-28',
      expiryDate: 'Permanente',
      ocrMatchScore: 99.5,
      fileSize: '4.5 MB PDF'
    }
  },
  {
    id: '#202610-00032',
    userId: 'usr-exp-004',
    userName: 'Dra. Carmen Morales',
    userEmail: 'cmorales@legaltech.do',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    type: 'professional_category',
    docType: 'Certificación Profesional',
    category: 'Profesional',
    profession: 'Abogada en Contratos & Notaría',
    submittedAt: '2026-10-12 03:10 PM',
    status: 'approved',
    reviewedAt: '2026-10-12 04:30 PM',
    reviewedBy: 'Valeria Santos (Operaciones)',
    reviewerNotes: 'Exequátur presidencial verificado en base de datos de Procuraduría.',
    documentUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    documentMeta: {
      issuer: 'Colegio de Abogados de la República Dominicana (CARD)',
      issueDate: '2018-05-14',
      expiryDate: 'Permanente',
      ocrMatchScore: 97.9,
      fileSize: '3.8 MB PDF'
    }
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-2026-901',
    reference: 'FNX-SUB-98124',
    userId: 'usr-exp-001',
    userName: 'Ing. Marcos Domínguez',
    userType: 'expert',
    type: 'subscription',
    plan: 'premium',
    amount: 499.99,
    currency: 'MXN', // Pesos/Mensual as in mobile app screenshot
    status: 'completed',
    paymentMethod: 'Tarjeta Crédito Visa (• 4129)',
    date: '2026-10-20 08:30 AM',
    description: 'Renovación automática mensual: Plan Premium Fianex Experto'
  },
  {
    id: 'tx-2026-902',
    reference: 'FNX-SUB-98125',
    userId: 'usr-exp-002',
    userName: 'José Almonte Santana',
    userType: 'expert',
    type: 'subscription',
    plan: 'intermedio',
    amount: 349.99,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'Tarjeta Débito Mastercard (• 8821)',
    date: '2026-10-19 11:15 AM',
    description: 'Suscripción mensual: Plan Intermedio Fianex Experto'
  },
  {
    id: 'tx-2026-903',
    reference: 'FNX-ESC-44192',
    userId: 'usr-cli-001',
    userName: 'Constructora & Proyectos Caribe SRL',
    userType: 'client',
    type: 'escrow_hold',
    amount: 14500.00,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'Transferencia Bancaria SPEI',
    date: '2026-10-19 03:40 PM',
    description: 'Fondo en garantía (Escrow) para Proyecto Eléctrico Nave Industrial'
  },
  {
    id: 'tx-2026-904',
    reference: 'FNX-SUB-98126',
    userId: 'usr-exp-004',
    userName: 'Dra. Carmen Morales',
    userType: 'expert',
    type: 'subscription',
    plan: 'premium',
    amount: 499.99,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'Tarjeta Crédito Amex (• 1004)',
    date: '2026-10-18 09:00 AM',
    description: 'Renovación mensual Plan Premium'
  },
  {
    id: 'tx-2026-905',
    reference: 'FNX-PAY-11029',
    userId: 'usr-exp-001',
    userName: 'Ing. Marcos Domínguez',
    userType: 'expert',
    type: 'expert_payout',
    amount: 22800.00,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'Depósito a Cuenta Banco BHD',
    date: '2026-10-17 05:20 PM',
    description: 'Liquidación de honorarios completados semana 42'
  },
  {
    id: 'tx-2026-906',
    reference: 'FNX-SUB-98127',
    userId: 'usr-exp-006',
    userName: 'Arq. Mateo Solís',
    userType: 'expert',
    type: 'subscription',
    plan: 'intermedio',
    amount: 349.99,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'Tarjeta Mastercard (• 7731)',
    date: '2026-10-16 02:14 PM',
    description: 'Suscripción mensual: Plan Intermedio'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TK-8942',
    subject: 'Consulta sobre estado de validación de Cédula de Identidad',
    requesterName: 'Eduardo Ramírez V.',
    requesterEmail: 'eduardo.ramirez@plomeriaexpress.do',
    requesterAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    requesterRole: 'expert',
    category: 'Verificación',
    priority: 'alta',
    status: 'en_progreso',
    slaDue: 'En 1 hora 45 min',
    assignedTo: 'Camila Peña',
    createdAt: '2026-10-20 09:30 AM',
    updatedAt: '2026-10-20 10:15 AM',
    messages: [
      {
        id: 'msg-1',
        sender: 'Eduardo Ramírez V.',
        isStaff: false,
        text: 'Hola equipo de soporte Fianex. Subí mi cédula esta mañana (#202610-00041) y quisiera saber cuánto tiempo tarda la aprobación para poder enviar propuestas a condominios.',
        timestamp: '09:30 AM'
      },
      {
        id: 'msg-2',
        sender: 'Camila Peña (Soporte)',
        isStaff: true,
        text: 'Hola Eduardo, gusto en saludarte. Tu documento se encuentra en la bandeja prioritaria de validación de nuestro equipo de operaciones. Generalmente toma menos de 4 horas hábiles.',
        timestamp: '10:15 AM'
      }
    ]
  },
  {
    id: 'TK-8940',
    subject: 'Problema al intentar pagar con tarjeta de crédito desde la app Flutter',
    requesterName: 'José Almonte Santana',
    requesterEmail: 'j.almonte@refritec.com',
    requesterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    requesterRole: 'expert',
    category: 'Pagos y Facturación',
    priority: 'media',
    status: 'resuelto',
    slaDue: 'Completado',
    assignedTo: 'Valeria Santos',
    createdAt: '2026-10-19 02:10 PM',
    updatedAt: '2026-10-19 03:45 PM',
    messages: [
      {
        id: 'msg-1',
        sender: 'José Almonte Santana',
        isStaff: false,
        text: 'Me salía error 402 en la app al seleccionar el Plan Intermedio de $349.99 Pesos/Mensual.',
        timestamp: '02:10 PM'
      },
      {
        id: 'msg-2',
        sender: 'Valeria Santos (Operaciones)',
        isStaff: true,
        text: 'Se detectó que el banco emisor requería autenticación 3DSecure. Se ha actualizado la pasarela en el worker de pagos y confirmamos que tu cargo ya fue procesado con éxito.',
        timestamp: '03:45 PM'
      }
    ]
  },
  {
    id: 'TK-8938',
    subject: 'Solicitud de factura con comprobante fiscal (NCF) corporativo',
    requesterName: 'Constructora & Proyectos Caribe SRL',
    requesterEmail: 'compras@proyectoscaribe.com.do',
    requesterAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    requesterRole: 'client',
    category: 'Pagos y Facturación',
    priority: 'media',
    status: 'abierto',
    slaDue: 'En 3 horas',
    assignedTo: 'Camila Peña',
    createdAt: '2026-10-20 08:20 AM',
    updatedAt: '2026-10-20 08:20 AM',
    messages: [
      {
        id: 'msg-1',
        sender: 'Constructora & Proyectos Caribe SRL',
        isStaff: false,
        text: 'Buenos días. Necesitamos que nos emitan factura B01 con valor fiscal para el pago retenido en custodia del proyecto eléctrico.',
        timestamp: '08:20 AM'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-8012',
    timestamp: '2026-10-20 11:22:04',
    operatorName: 'Valeria Santos',
    operatorRole: 'ops_admin',
    action: 'VERIFICATION_QUEUE_FETCHED',
    target: 'Queue #202610-00041',
    details: 'Visualización y apertura de expediente de validación para Eduardo Ramírez V.',
    severity: 'info',
    ip: '190.166.42.102'
  },
  {
    id: 'log-8011',
    timestamp: '2026-10-20 10:45:18',
    operatorName: 'Carlos Rivera',
    operatorRole: 'super_admin',
    action: 'CLOUDFLARE_WORKER_ROUTE_UPDATED',
    target: 'worker-verification.fianex.app',
    details: 'Ajuste en límites de rate limit y optimización de latencia en edge network',
    severity: 'warning',
    ip: '172.68.22.44'
  },
  {
    id: 'log-8010',
    timestamp: '2026-10-20 09:15:30',
    operatorName: 'Sistema Automatizado KYC',
    operatorRole: 'system_auditor',
    action: 'NEW_VERIFICATION_SUBMITTED',
    target: 'Expediente #202610-00041',
    details: 'Recepción de documento Cédula de Identidad vía Flutter Mobile SDK v2.4.1',
    severity: 'audit',
    ip: '200.88.112.5'
  },
  {
    id: 'log-8009',
    timestamp: '2026-10-19 16:30:11',
    operatorName: 'Valeria Santos',
    operatorRole: 'ops_admin',
    action: 'CERTIFICATION_APPROVED',
    target: 'Expediente #202610-00035 (Marcos Domínguez)',
    details: 'Aprobación exitosa de credenciales técnicas CODIA y activación de insignia oficial en la app',
    severity: 'audit',
    ip: '190.166.42.102'
  },
  {
    id: 'log-8008',
    timestamp: '2026-10-19 14:10:02',
    operatorName: 'Héctor De La Cruz',
    operatorRole: 'system_auditor',
    action: 'SECURITY_AUDIT_EXPORT',
    target: 'Audit Logs Octubre 2026',
    details: 'Exportación forense de registros para cumplimiento de normativas de datos de usuarios',
    severity: 'audit',
    ip: '179.52.88.19'
  }
];

export const INITIAL_CLOUDFLARE_WORKERS: CloudflareWorker[] = [
  {
    id: 'cw-01',
    name: 'fianex-static-edge-router',
    route: 'fianex.app/*',
    environment: 'production',
    status: 'operational',
    version: 'v2.1.0',
    lastDeployed: 'Hace 2 horas',
    invocations24h: 342910,
    avgLatencyMs: 8.2,
    errorRate: 0.001,
    description: 'Sirve la página estática pública fianex.app con caché perimetral, compresión Brotli y enrutamiento a secciones dinámicas sin tocar el backoffice.'
  },
  {
    id: 'cw-02',
    name: 'fianex-backoffice-api',
    route: 'ops.fianex.app/api/*',
    environment: 'production',
    status: 'operational',
    version: 'v3.4.2',
    lastDeployed: 'Hace 45 min',
    invocations24h: 89400,
    avgLatencyMs: 14.5,
    errorRate: 0.004,
    description: 'Microservicio backend para el backoffice de operaciones. Autentica con Supabase JWT, RBAC y auditoría en tiempo real.'
  },
  {
    id: 'cw-03',
    name: 'fianex-flutter-gateway',
    route: 'api.fianex.app/v1/flutter/*',
    environment: 'production',
    status: 'operational',
    version: 'v1.9.8',
    lastDeployed: 'Ayer',
    invocations24h: 681200,
    avgLatencyMs: 18.0,
    errorRate: 0.002,
    description: 'Gateway de APIs para la app móvil Flutter (registro, perfiles, búsqueda de expertos, chat en tiempo real y notificaciones push).'
  },
  {
    id: 'cw-04',
    name: 'fianex-kyc-verification-worker',
    route: 'api.fianex.app/v1/kyc/*',
    environment: 'production',
    status: 'operational',
    version: 'v2.0.4',
    lastDeployed: 'Hace 3 días',
    invocations24h: 12450,
    avgLatencyMs: 34.0,
    errorRate: 0.012,
    description: 'Microservicio de ingesta de documentos para Centro de Verificación (Cédulas, Títulos técnicos, diplomas) con pre-validación OCR y almacenamiento cifrado.'
  },
  {
    id: 'cw-05',
    name: 'fianex-billing-subscriptions',
    route: 'api.fianex.app/v1/billing/*',
    environment: 'production',
    status: 'operational',
    version: 'v1.5.0',
    lastDeployed: 'Hace 5 días',
    invocations24h: 24900,
    avgLatencyMs: 22.1,
    errorRate: 0.003,
    description: 'Gestor de cobros recurrentes de planes de expertos ($0 Básico, $349.99 Intermedio, $499.99 Premium), webhooks bancarios y monedero de custodia.'
  }
];

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://gnduehhwlxxqvaczaujr.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZHVlaGh3bHh4cXZhY3phdWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjczNzA1NiwiZXhwIjoyMDg4MzEzMDU2fQ.f-z4H44uTQLJLX3Q2_E0VZ5vuV28WNMqKwwWsFE5iPs',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZHVlaGh3bHh4cXZhY3phdWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjczNzA1NiwiZXhwIjoyMDg4MzEzMDU2fQ.f-z4H44uTQLJLX3Q2_E0VZ5vuV28WNMqKwwWsFE5iPs',
  database: 'PostgreSQL 15.6 (Supabase Managed Cloud)',
  connected: true,
  poolerHost: 'aws-0-us-east-1.pooler.supabase.com:6543',
  activeConnections: 12,
  rlsPoliciesEnforced: true,
  tables: [
    { name: 'vw_profile_settings', rowCount: 1420, rlsEnabled: true, lastSynced: 'En vivo' },
    { name: 'vw_service_requests_details', rowCount: 684, rlsEnabled: true, lastSynced: 'En vivo' },
    { name: 'interactions', rowCount: 3120, rlsEnabled: true, lastSynced: 'En vivo' },
    { name: 'reviews', rowCount: 890, rlsEnabled: true, lastSynced: 'En vivo' },
    { name: 'document_types', rowCount: 12, rlsEnabled: true, lastSynced: 'En vivo' }
  ]
};

// Comparative plans matrix for static page & dashboard (without licitaciones, push delay or commission rows)
export const PLAN_BENEFITS_COMPARISON: PlanFeatureComparison[] = [
  {
    feature: 'Costo mensual',
    category: 'Precios',
    basico: '$0 / Para siempre',
    intermedio: '$349.99 Pesos/mes',
    premium: '$499.99 Pesos/mes',
    highlight: true
  },
  {
    feature: 'Propuestas de trabajo al mes',
    category: 'Alcance Comercial',
    basico: '10 propuestas/mes',
    intermedio: '30 propuestas/mes',
    premium: 'Propuestas Ilimitadas',
    highlight: true
  },
  {
    feature: 'Posicionamiento en búsquedas de clientes',
    category: 'Visibilidad',
    basico: 'Estándar',
    intermedio: 'Perfil Destacado',
    premium: 'Prioridad Máxima (#1 en resultados)',
    highlight: true
  },
  {
    feature: 'Insignia de Experto Certificado',
    category: 'Credenciales',
    basico: 'Cédula básica',
    intermedio: 'Insignia Verificada',
    premium: 'Insignia Dorada VIP & Sello Oficial'
  },
  {
    feature: 'Nivel de Soporte Técnico',
    category: 'Soporte',
    basico: 'Soporte Estándar (48h)',
    intermedio: 'Soporte Especial (< 12h)',
    premium: 'Soporte VIP Prioritario (< 2h / WhatsApp)'
  },
  {
    feature: 'Exportación de historial contable y facturación',
    category: 'Administración',
    basico: false,
    intermedio: true,
    premium: true
  }
];
