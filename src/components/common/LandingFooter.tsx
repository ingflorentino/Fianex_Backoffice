import React from 'react';
import { Mail, Globe, Shield, Headphones, ExternalLink, Sparkles } from 'lucide-react';

interface LandingFooterProps {
  isDark?: boolean;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ isDark = true }) => {
  return (
    <footer className="w-full bg-[#080d1a] text-slate-300 border-t border-slate-800 transition-colors">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-slate-700 flex items-center justify-center shrink-0">
                <img src="/favicon.png" alt="Fianex Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  Fianex
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded uppercase">
                    Portal
                  </span>
                </span>
                <p className="text-[11px] text-slate-400">Plataforma de Expertos & Operaciones</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma integral para gestión operativa, verificación KYC de técnicos y expertos, control transaccional y atención de soporte en tiempo real.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-teal-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistemas & API en Línea (SLA 99.9%)</span>
            </div>
          </div>

          {/* Column 2: Plataforma & Soluciones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Plataforma & Soluciones
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <span className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  Verificación de Identidad & Cédula
                </span>
              </li>
              <li>
                <span className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  Directorio de Técnicos Certificados
                </span>
              </li>
              <li>
                <span className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  Suscripciones para Profesionales
                </span>
              </li>
              <li>
                <span className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  Custodia de Pagos (Escrow Seguro)
                </span>
              </li>
              <li>
                <span className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  Atención a Solicitudes con SLA
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Seguridad & Infraestructura */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Seguridad & Backend
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Supabase PostgreSQL + RLS Activo</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Cloudflare Global CDN & Edge Workers</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Cifrado de Extremo a Extremo SSL/TLS</span>
              </li>
              <li className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Auditoría Forense & Logs en Vivo</span>
              </li>
            </ul>
          </div>

          {/* Column 4: CANALES DE CONTACTO (Matching user specification exactly) */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
              CANALES DE CONTACTO
            </h4>

            <div className="space-y-3.5">
              {/* Contacto General */}
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  CONTACTO GENERAL
                </span>
                <a
                  href="mailto:contacto@rivertonlineservices.com"
                  className="flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-cyan-300 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">contacto@rivertonlineservices.com</span>
                </a>
              </div>

              {/* Soporte Técnico */}
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  SOPORTE TÉCNICO
                </span>
                <a
                  href="mailto:soporte@rivertonlineservices.com"
                  className="flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-cyan-300 transition-colors group"
                >
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">soporte@rivertonlineservices.com</span>
                </a>
              </div>

              {/* Ventas y Cotizaciones */}
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  VENTAS Y COTIZACIONES
                </span>
                <a
                  href="mailto:ventas@rivertonlineservices.com"
                  className="flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-cyan-300 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">ventas@rivertonlineservices.com</span>
                </a>
              </div>

              {/* Información y Prensa */}
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  INFORMACIÓN Y PRENSA
                </span>
                <a
                  href="mailto:info@rivertonlineservices.com"
                  className="flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-cyan-300 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">info@rivertonlineservices.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-bar / Micro footer (Matching image_60fa0662.png) */}
      <div className="border-t border-slate-800/80 bg-[#050811] py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span>Fianex Operations Platform © {new Date().getFullYear()}</span>
            <span className="opacity-40">·</span>
            <span>Rivert Online Services</span>
          </div>

          {/* Exact bar from image_60fa0662.png */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="text-slate-400">Canal de Asistencia</span>
            <span className="text-slate-600">·</span>
            <a
              href="mailto:contacto@rivertonlineservices.com"
              className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
            >
              contacto@rivertonlineservices.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
