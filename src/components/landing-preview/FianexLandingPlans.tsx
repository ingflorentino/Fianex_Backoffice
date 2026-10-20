import React, { useState } from 'react';
import {
  Globe2,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  CheckCircle2,
  ExternalLink,
  Code2,
  GitBranch,
  Github
} from 'lucide-react';
import { PLAN_BENEFITS_COMPARISON } from '../../data/mockData';

interface FianexLandingPlansProps {
  isDark?: boolean;
}

export const FianexLandingPlans: React.FC<FianexLandingPlansProps> = ({ isDark = false }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const staticEmbedCode = `<!-- SECCIÓN DE PLANES FIANEX PARA PÁGINA ESTÁTICA (fianex.app) -->
<section id="planes" class="py-20 bg-slate-50 border-b border-slate-200">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <span class="text-[#2B8DA9] font-bold text-xs uppercase tracking-widest bg-[#F0F9FA] px-3 py-1 rounded-full border border-[#54C5D4]/30">
        Suscripciones para Expertos y Profesionales
      </span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
        Impulsa tus Servicios con Fianex
      </h2>
      <p class="text-slate-600 text-base mt-3 leading-relaxed">
        Ya seas plomero, electricista, mecánico, asesor, profesional de la belleza o especialista técnico, elige el plan ideal para recibir solicitudes de clientes y potenciar tus ingresos.
      </p>
    </div>

    <!-- TARJETAS DE PLANES (Sincronizadas con la App Móvil Flutter) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <!-- Plan Básico -->
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Básico</span>
          <div class="text-4xl font-black text-slate-900 mt-3">$0 <span class="text-sm font-normal text-slate-500">/ Para siempre</span></div>
          <p class="text-slate-500 text-sm mt-3">Para profesionales que están comenzando a explorar la plataforma.</p>
          <div class="border-t border-slate-100 my-6"></div>
          <ul class="space-y-3 text-sm text-slate-700">
            <li class="flex items-center gap-2">✓ <strong>10 propuestas</strong> de trabajo al mes</li>
            <li class="flex items-center gap-2">✓ Perfil básico verificado</li>
            <li class="flex items-center gap-2">✓ Soporte estándar</li>
          </ul>
        </div>
        <a href="#contacto" class="mt-8 block text-center py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm">Comenzar Gratis</a>
      </div>

      <!-- Plan Intermedio -->
      <div class="bg-white rounded-3xl p-8 border-2 border-[#54C5D4]/60 shadow-lg flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold text-[#2B8DA9] uppercase tracking-wider">Plan Intermedio</span>
          <div class="text-4xl font-black text-slate-900 mt-3">$349.99 <span class="text-sm font-normal text-slate-500">Pesos/Mensual</span></div>
          <p class="text-slate-500 text-sm mt-3">Para expertos que desean captar clientes de manera constante cada semana.</p>
          <div class="border-t border-slate-100 my-6"></div>
          <ul class="space-y-3 text-sm text-slate-700">
            <li class="flex items-center gap-2">✓ <strong>30 propuestas</strong> de trabajo al mes</li>
            <li class="flex items-center gap-2">✓ <strong>Perfil destacado</strong> en el buscador</li>
            <li class="flex items-center gap-2">✓ Insignia de verificación oficial</li>
            <li class="flex items-center gap-2">✓ Soporte especial (&lt; 12 horas)</li>
          </ul>
        </div>
        <a href="#contacto" class="mt-8 block text-center py-3 rounded-xl bg-[#54C5D4] text-white font-bold text-sm shadow-md">Elegir Plan Intermedio</a>
      </div>

      <!-- Plan Premium -->
      <div class="bg-gradient-to-b from-[#2B8DA9] to-[#1E677C] text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-white/90">Plan Premium VIP</span>
          <div class="text-4xl font-black text-white mt-3">$499.99 <span class="text-sm font-normal text-white/80">Pesos/Mensual</span></div>
          <p class="text-slate-100 text-sm mt-3">Para los profesionales y talleres líderes que desean máxima presencia en su zona.</p>
          <div class="border-t border-white/20 my-6"></div>
          <ul class="space-y-3 text-sm text-slate-100">
            <li class="flex items-center gap-2">★ <strong>Propuestas ilimitadas</strong> cada mes</li>
            <li class="flex items-center gap-2">★ <strong>Prioridad máxima</strong> en el algoritmo (#1)</li>
            <li class="flex items-center gap-2">✓ Insignia Dorada VIP & Sello Oficial</li>
            <li class="flex items-center gap-2">✓ Soporte VIP prioritario (&lt; 2h / WhatsApp)</li>
            <li class="flex items-center gap-2">✓ Historial de facturación y comprobantes fiscales</li>
          </ul>
        </div>
        <a href="#contacto" class="mt-8 block text-center py-3 rounded-xl bg-white text-[#2B8DA9] font-extrabold text-sm shadow-lg">Obtener Plan Premium</a>
      </div>
    </div>
  </div>
</section>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(staticEmbedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the static page integration */}
      <div className={`border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sección de Planes para Expertos (fianex.app)
            </h2>
            <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
              ✓ Sincronizado en GitHub
            </span>
          </div>
          <p className={`text-xs mt-1 max-w-3xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Esta sección replica exactamente los 3 planes de la app móvil (Básico $0, Intermedio $349.99 Pesos/mes, Premium $499.99 Pesos/mes) adaptada para técnicos, plomeros, electricistas, mecánicos, peluquería/estética y profesionales independientes.
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs">
            <a
              href="https://github.com/ingflorentino/Fianex_Static_Page"
              target="_blank"
              rel="noreferrer"
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ver Repo Página Estática</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="https://github.com/ingflorentino/Fianex_Backoffice"
              target="_blank"
              rel="noreferrer"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ver Repo Backoffice (Cloudflare)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              Vista Previa
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              Código HTML
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs"
          >
            {copiedCode ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? '¡Copiado!' : 'Copiar Código'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'code' ? (
        <div className={`border rounded-2xl p-5 space-y-3 font-mono text-xs ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-200 dark:border-slate-800">
            <span>planes-section.html (Ya integrado en Fianex_Static_Page)</span>
            <button
              onClick={handleCopyCode}
              className="text-teal-600 dark:text-teal-400 hover:underline text-xs font-sans font-bold"
            >
              Copiar
            </button>
          </div>
          <pre className="overflow-x-auto p-4 rounded-xl max-h-[500px] bg-slate-900 text-slate-200">
            {staticEmbedCode}
          </pre>
        </div>
      ) : (
        /* Visual Preview of the Landing Page section */
        <div className={`border rounded-3xl p-6 sm:p-10 shadow-xs space-y-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800'
            : 'bg-gradient-to-b from-white via-slate-50 to-white border-slate-200'
        }`}>
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2B8DA9] bg-[#F0F9FA] px-3.5 py-1.5 rounded-full border border-[#54C5D4]/30">
              Suscripciones para Expertos y Técnicos
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Planes Diseñados para Potenciar tus Clientes
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Fianex conecta a clientes con expertos en plomería, electricidad, mecánica, estética, asesoría y más. Elige el plan que mejor se adapte a tu ritmo de trabajo.
            </p>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Plan Básico */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Básico</span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    Comenzar
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-black font-mono mt-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  $0
                  <span className="text-xs font-normal text-slate-500 ml-1">/ Para siempre</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Perfil básico, 10 propuestas al mes y soporte estándar para dar tus primeros pasos.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>10 propuestas</strong> de trabajo al mes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Perfil con validación de Cédula</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Soporte estándar vía ticket</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://fianex.app/"
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <span>Registrarse Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Plan Intermedio */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border-2 transition-all shadow-md ${
              isDark
                ? 'bg-slate-950/80 border-cyan-500/40'
                : 'bg-white border-[#54C5D4] shadow-[#54C5D4]/10'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2B8DA9] uppercase tracking-wider">Intermedio</span>
                  <span className="text-[10px] font-bold bg-[#F0F9FA] text-[#2B8DA9] px-2.5 py-0.5 rounded-full border border-[#54C5D4]/30">
                    Crecimiento
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-black font-mono mt-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  $349.99
                  <span className="text-xs font-normal text-slate-500 ml-1">Pesos/Mensual</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Perfil destacado, 30 propuestas al mes y soporte especial para captar clientes constantes.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2B8DA9] shrink-0" />
                    <span><strong>30 propuestas</strong> al mes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2B8DA9] shrink-0" />
                    <span><strong>Perfil destacado</strong> en búsquedas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2B8DA9] shrink-0" />
                    <span>Insignia de verificación oficial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2B8DA9] shrink-0" />
                    <span>Soporte especial (&lt; 12h)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://fianex.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#54C5D4] hover:bg-[#2B8DA9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Suscribirse al Intermedio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="bg-gradient-to-b from-[#2B8DA9] to-[#1E677C] text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3 right-6 bg-[#F58B44] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                Recomendado
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Premium VIP
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono mt-4">
                  $499.99
                  <span className="text-xs font-normal text-white/80 ml-1">Pesos/Mensual</span>
                </div>
                <p className="text-xs text-white/90 mt-2">
                  Propuestas ilimitadas, prioridad máxima y soporte VIP para expertos consolidados.
                </p>

                <div className="mt-6 pt-6 border-t border-white/20 space-y-2.5 text-xs text-white">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-amber-300">★</span>
                    <span><strong>Propuestas ilimitadas</strong> cada mes</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-amber-300">★</span>
                    <span><strong>Prioridad máxima</strong> en el buscador (#1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Insignia Dorada VIP & Sello Oficial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Soporte VIP prioritario (&lt; 2h / WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Historial de facturación y recibos fiscales</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://fianex.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#2B8DA9] font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <span>Activar Plan Premium</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Comparative Table of Main Benefits (Cleaned up as requested) */}
          <div className="max-w-4xl mx-auto pt-4">
            <div className="text-center mb-6">
              <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tabla Comparativa de Beneficios
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Resumen comparativo de ventajas para técnicos y profesionales
              </p>
            </div>

            <div className={`overflow-x-auto rounded-2xl border ${
              isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white shadow-xs'
            }`}>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                    <th className="py-3 px-5 font-bold">Beneficio para el Experto</th>
                    <th className="py-3 px-4 font-bold text-center w-36">Básico ($0)</th>
                    <th className="py-3 px-4 font-bold text-center w-40 text-[#2B8DA9]">Intermedio ($349.99)</th>
                    <th className="py-3 px-4 font-bold text-center w-44 text-[#2B8DA9] bg-[#F0F9FA]/40">
                      Premium ($499.99)
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                  {PLAN_BENEFITS_COMPARISON.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className={`py-3.5 px-5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                        {row.feature}
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-500">
                        {typeof row.basico === 'boolean' ? (
                          row.basico ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">—</span>
                          )
                        ) : (
                          <span>{row.basico}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center text-[#2B8DA9] font-semibold">
                        {typeof row.intermedio === 'boolean' ? (
                          row.intermedio ? (
                            <Check className="w-4 h-4 text-[#2B8DA9] mx-auto" />
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">—</span>
                          )
                        ) : (
                          <span>{row.intermedio}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-[#2B8DA9] bg-[#F0F9FA]/30 dark:bg-teal-950/20">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-teal-400 mx-auto" />
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">—</span>
                          )
                        ) : (
                          <span>{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
