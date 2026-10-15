import React, { useState } from 'react';
import { BookOpen, FileText, X, Shield, Coins, CheckCircle, Flame, Music, Globe, Sliders, Users, Building2, BarChart3, Film, Home } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeDocTab, setActiveDocTab] = useState<'manual' | 'eula'>('manual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-text">
      <div className="relative w-full max-w-4xl bg-[#0b0d14] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-rock text-lg text-white">DOCUMENTACIÓN OFICIAL · ROCK GOD TYCOON</h2>
              <p className="text-xs text-slate-400">Manual de Usuario & Acuerdo de Licencia de Usuario Final (EULA / Web3)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 font-rock text-xs">
              <button
                onClick={() => setActiveDocTab('manual')}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  activeDocTab === 'manual' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Manual de Usuario
              </button>
              <button
                onClick={() => setActiveDocTab('eula')}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  activeDocTab === 'eula' ? 'bg-amber-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Acuerdo de Licencia (EULA)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          {activeDocTab === 'manual' ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h3 className="font-rock text-amber-400 text-base mb-1">BIENVENIDO AL MUNDO DEL ROCK & ROLL</h3>
                <p className="text-xs text-slate-300">
                  <strong>Rock God Tycoon</strong> te pone al mando de una banda de rock desde los precarios ensayos en el garaje de mamá hasta los estadios multitudinarios y el Olimpo musical. Aquí aprenderás a componer singles históricos, rodar videoclips virales, perfeccionar tu técnica en vivo y monetizar tus ganancias con tecnología Web3.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40">
                  <h4 className="font-rock text-white text-sm flex items-center gap-2 mb-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    1. Composición en Estudio & Mezcla
                  </h4>
                  <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400">
                    <li><strong>Género & Temática:</strong> Combina géneros (Heavy Metal, Hard Rock, Grunge, Punk, etc.) con temáticas afines (Rebelión, Angustia Existencial, Odisea Cósmica) para obtener bonificaciones de sinergia creativa.</li>
                    <li><strong>Estructura:</strong> Activa intros explosivas, solos de guitarra épicos y puentes melódicos para elevar la complejidad y valoración crítica.</li>
                    <li><strong>Faders de Instrumentos:</strong> Modula la mezcla según la fuerza de tus músicos (Voz, Guitarra Líder, Bajo, Batería y Sintetizador).</li>
                    <li><strong>Estudios de Grabación:</strong> Grabar en mejores estudios suma entre +0 y +65 puntos de calidad sonora al producto final.</li>
                  </ul>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40">
                  <h4 className="font-rock text-white text-sm flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-purple-400" />
                    2. Diseño de Portadas de Discos (LP Art)
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Al compilar un EP o Álbum de larga duración, accede al <strong>Diseñador de Portadas</strong> para elegir texturas (Vinilo vintage, Calavera gótica, Rayo, Fuego infernal), paleta de colores y el sello distintivo (Parental Advisory, Gold Edition o Explicit Rock).
                  </p>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40">
                  <h4 className="font-rock text-white text-sm flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    3. Giras Mundiales & Escenario 2D en Vivo
                  </h4>
                  <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400">
                    <li><strong>Selección de Recintos:</strong> Comienza en locales pequeños de Los Ángeles o Nueva York y escala hasta estadios en Londres, Tokio, Buenos Aires o el festival Wacken.</li>
                    <li><strong>Pirotecnia & Solos:</strong> Durante el concierto en 2D, activa ráfagas de fuego y solos de guitarra para aumentar el Hype del público hasta un 150%.</li>
                    <li><strong>Encore (¡Otra!):</strong> Solicita bises al final del show para maximizar la venta de camisetas y pósteres en la tienda de merchandising.</li>
                  </ul>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40">
                  <h4 className="font-rock text-white text-sm flex items-center gap-2 mb-2">
                    <Film className="w-4 h-4 text-pink-400" />
                    4. Producción de Videoclips (RockTube & MTV)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Rueda videoclips para tus sencillos favoritos. Contrata desde estudiantes universitarios lo-fi hasta directores galardonados de Hollywood. Cada vídeo genera visitas pasivas semanales que aceleran la llegada de nuevos fanáticos y potencian las reproducciones en streaming.
                  </p>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40">
                  <h4 className="font-rock text-white text-sm flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-emerald-400" />
                    5. Sede de la Banda, Ensayos & Audiciones
                  </h4>
                  <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400">
                    <li><strong>Mudanzas:</strong> Trasládate a sedes superiores (Sótano Sunset, Almacén Loft, Mansión Beverly Hills) para ganar química permanente y mayor velocidad de ensayo.</li>
                    <li><strong>Maestría de Canciones (0% a 100%):</strong> Ensayar temas en la sala de ensayo evita notas en falso en directo y eleva el multiplicador de taquilla.</li>
                    <li><strong>Audiciones:</strong> Ficha a mercenarios virtuosos con atributos de Técnica, Creatividad y Presencia superiores para llevar tu sonido a otro nivel.</li>
                  </ul>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40">
                  <h4 className="font-rock text-white text-sm flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-cyan-400" />
                    6. Bóveda Web3 y Retiro en USDC / USDT
                  </h4>
                  <p className="text-xs text-slate-400">
                    El dinero ganado en el juego puede retirarse como <strong>USDC o USDT</strong> auténticos. Es compatible con cualquier navegador mediante la <em>Bóveda Web3 Integrada</em> o conectando extensiones EVM (MetaMask, Rabby). Selecciona redes con bajas comisiones como <strong>Polygon</strong> o <strong>Base</strong>, firma la transacción y descarga tu comprobante oficial en JSON.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
                <h3 className="font-rock text-white text-sm mb-1 uppercase tracking-wider">
                  ACUERDO DE LICENCIA DE USUARIO FINAL (EULA) Y TÉRMINOS DEL SERVICIO WEB3
                </h3>
                <p className="text-[11px] text-slate-400">
                  Última actualización: Temporada 2026/2027 · Versión 2.5.0
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-rock text-amber-400 text-xs uppercase">1. Concesión de Licencia</h5>
                <p>
                  Por medio del presente Acuerdo, se otorga al usuario una licencia personal, no exclusiva, intransferible y revocable para ejecutar, jugar y disfrutar de la aplicación de simulación <strong>Rock God Tycoon</strong> a través de cualquier navegador web compatible. Todos los derechos no otorgados expresamente están reservados por los desarrolladores y creadores del software.
                </p>

                <h5 className="font-rock text-amber-400 text-xs uppercase">2. Propiedad Intelectual y Contenido</h5>
                <p>
                  El código fuente, arquitectura, diseño gráfico, motores de síntesis de audio procedimental Web Audio API y elementos mecánicos son propiedad protegida por las leyes internacionales de propiedad intelectual y derechos de autor. Las referencias y parodias del mundo del rock tienen fines artísticos, satíricos y de entretenimiento.
                </p>

                <h5 className="font-rock text-amber-400 text-xs uppercase">3. Disposiciones del Módulo Web3, Smart Contracts y Stablecoins (USDC / USDT)</h5>
                <p>
                  El juego incorpora conectividad con protocolos descentralizados EVM (Ethereum Virtual Machine) en redes compatibles (Polygon PoS, Base, Arbitrum One, Sepolia y Ethereum Mainnet):
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                  <li><strong>Naturaleza No Custodial:</strong> La aplicación opera bajo un modelo no custodial. Ni el juego ni sus desarrolladores custodian claves privadas, frases de recuperación ni fondos de billeteras externas del usuario.</li>
                  <li><strong>Paridad 1:1 en Retiros de Simulación:</strong> Las regalías del juego convertidas a USDC o USDT representan liquidaciones digitales conforme a las reglas del contrato inteligente asociado y la disponibilidad del pool de liquidez.</li>
                  <li><strong>Costes de Red (Gas Fees):</strong> Toda interacción on-chain está sujeta a las tarifas de gas de la red seleccionada, las cuales son calculadas y debitadas por la blockchain respectiva.</li>
                </ul>

                <h5 className="font-rock text-amber-400 text-xs uppercase">4. Deslinde de Responsabilidad Financiera</h5>
                <p>
                  <strong>Rock God Tycoon</strong> es un videojuego de gestión y entretenimiento. Ningún contenido dentro del juego constituye asesoría financiera, recomendación de inversión ni oferta de valores. El usuario es el único responsable de la seguridad de sus direcciones públicas y de verificar los hashes de transacción generados.
                </p>

                <h5 className="font-rock text-amber-400 text-xs uppercase">5. Modificaciones y Jurisdicción</h5>
                <p>
                  El equipo de desarrollo se reserva el derecho de actualizar los parámetros de balance del juego, mecánicas de contratos discográficos y soporte de redes blockchain para garantizar una experiencia óptima y justa para todos los jugadores.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono-num">
            Rock God Tycoon · Stream 2D Replica v2.5.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-black font-rock text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            Entendido & Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
};
