import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Briefcase,
  Star,
  Users,
  CreditCard,
  Headphones,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Lock,
  Globe2,
  LogIn
} from 'lucide-react';
import { LandingFooter } from '../common/LandingFooter';

interface LandingPageViewProps {
  isDark?: boolean;
  onGoToLogin?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  isDark = true,
  onGoToLogin
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'basico',
      name: 'Plan Básico',
      subtitle: 'Para técnicos que inician en la plataforma',
      price: '$0',
      period: 'Gratis para siempre',
      popular: false,
      badge: 'Acceso Inicial',
      features: [
        'Hasta 10 propuestas de trabajo al mes',
        'Perfil público en el catálogo de técnicos',
        'Validación básica de Cédula de Identidad',
        'Recepción de pagos mediante billetera segura',
        'Soporte estándar vía correo electrónico'
      ],
      ctaText: 'Comenzar Gratis',
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
    },
    {
      id: 'intermedio',
      name: 'Plan Intermedio',
      subtitle: 'El más elegido para profesionales activos',
      price: '$349.99',
      period: 'Pesos DOP / mes',
      popular: true,
      badge: 'Más Popular',
      features: [
        'Hasta 30 propuestas de trabajo al mes',
        'Insignia de "Técnico Verificado" destacada',
        'Posicionamiento prioritario en búsquedas locales',
        'Cero comisiones adicionales por cobro',
        'Canal de Asistencia prioritario'
      ],
      ctaText: 'Suscribirse al Intermedio',
      buttonStyle: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/20'
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      subtitle: 'Máximo alcance y volumen de contratación',
      price: '$499.99',
      period: 'Pesos DOP / mes',
      popular: false,
      badge: 'Acceso Ilimitado',
      features: [
        'Propuestas de trabajo ILIMITADAS cada mes',
        'Máxima visibilidad (#1 en resultados de búsqueda)',
        'Insignia Dorada de Experto Certificado',
        'Gestión de presupuestos y facturación directa',
        'Soporte técnico VIP dedicado 24/7'
      ],
      ctaText: 'Obtener Plan Premium',
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-white border border-teal-500/40 hover:border-teal-400'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-[#080d1a] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isDark ? 'bg-[#080d1a]/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
              <img src="/favicon.png" alt="Fianex" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight">Fianex</span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded uppercase">
                  App
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Expertos & Servicios Profesionales</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#soluciones" className="hover:text-teal-400 transition-colors">
              Soluciones
            </a>
            <a href="#planes" className="hover:text-teal-400 transition-colors">
              Planes para Expertos
            </a>
            <a href="#seguridad" className="hover:text-teal-400 transition-colors">
              Seguridad & KYC
            </a>
            <a href="#contacto" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
              Canales de Contacto
            </a>
          </nav>

          {/* Action button */}
          {onGoToLogin && (
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acceso Backoffice</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Marketplace Oficial de Expertos y Técnicos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Conectamos Clientes con{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Expertos Verificados
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Plomería, electricidad, climatización, mecánica y servicios especializados en República Dominicana. Respaldado por validación de identidad oficial, pagos seguros en custodia y soporte garantizado.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#planes"
              className="px-6 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
            >
              <span>Ver Planes de Suscripción</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#contacto"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
            >
              Contactar Soporte & Ventas
            </a>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="soluciones" className="py-16 border-b border-slate-800 bg-[#060a14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Verificación KYC y Cédula</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada técnico es validado mediante cotejo biométrico y de documento oficial ante el padrón electoral, garantizando seguridad para los hogares y empresas.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Custodia Escrow de Fondos</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El dinero del cliente queda retenido de forma segura en fideicomiso y solo se libera al técnico una vez el trabajo se ha completado a satisfacción.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Canal de Asistencia & SLA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centro de atención a usuarios y directivos disponible vía canales dedicados de soporte técnico, ventas y atención general.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="planes" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
            Planes de Suscripción para Técnicos
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Elige el plan ideal para tu negocio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Comienza gratis o accede a propuestas ilimitadas con máxima prioridad de contratación.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all border ${
                p.popular
                  ? 'bg-slate-900/90 border-teal-500/50 shadow-2xl shadow-teal-500/10 ring-1 ring-teal-500/30 relative'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  {!p.popular && (
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-6">{p.subtitle}</p>

                <div className="mb-6 pb-6 border-b border-slate-800">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{p.price}</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">{p.period}</span>
                </div>

                <ul className="space-y-3 mb-8 text-xs text-slate-300">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${p.buttonStyle}`}
              >
                {p.ctaText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Target anchor for footer navigation */}
      <div id="contacto" />

      {/* Landing Footer with Contact Channels (Exactly matching user screenshot specifications) */}
      <LandingFooter isDark={isDark} />
    </div>
  );
};
