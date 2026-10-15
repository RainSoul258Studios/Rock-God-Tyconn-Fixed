import React, { useState, useEffect } from 'react';
import { rockAudio } from '../audio/rockAudio';
import { MusicGenre } from '../types/game';
import { MUSIC_GENRES } from '../data/rockData';
import { Play, Volume2, VolumeX, Sparkles, Shield, Flame, Zap } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: (bandName: string, genre: MusicGenre) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [bandName, setBandName] = useState<string>('Thunder Riot');
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre>('Hard Rock');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);

  // Keyboard shortcut: Space or Enter to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        // Only if not actively typing inside input
        const tag = (e.target as HTMLElement).tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          handleStart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bandName, selectedGenre]);

  const handleStart = () => {
    rockAudio.playPowerChord(82.41, 1.2);
    setTimeout(() => rockAudio.playSoloRiff(), 300);
    onStartGame(bandName.trim() || 'Thunder Riot', selectedGenre);
  };

  const handleToggleSound = () => {
    const muted = rockAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      rockAudio.playPowerChord(98, 0.4);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07080f] flex flex-col justify-between items-center select-none text-white">
      {/* Background Animated Stage Lighting Beams & Smoke */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-20 left-1/4 w-96 h-[120vh] bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent blur-3xl animate-stage-left" />
        <div className="absolute -top-20 right-1/4 w-96 h-[120vh] bg-gradient-to-b from-red-600/20 via-purple-600/10 to-transparent blur-3xl animate-stage-right" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.15),transparent_65%)]" />
        
        {/* Subtle scanline texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
      </div>

      {/* Top Bar: Sound Toggle & Web3 Badge */}
      <div className="relative z-20 w-full max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-rock text-xs tracking-wider text-amber-300">STREAM 2D TYCOON EDITION</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-[11px] font-mono-num font-bold text-emerald-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Web3 USDC / USDT Ready</span>
          </div>

          <button
            onClick={handleToggleSound}
            className="p-2.5 rounded-full bg-black/60 border border-white/10 hover:border-amber-400 text-slate-300 hover:text-white transition-all backdrop-blur-md"
            title="Silenciar / Activar Sonido"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Centerpiece: Bespoke SVG Title Lockup with 30-40% Negative Space */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl my-auto">
        {/* Inline Bespoke SVG Title Lockup */}
        <div className="relative mb-2">
          <svg className="w-full max-w-2xl h-36 md:h-44 drop-shadow-[0_0_35px_rgba(245,158,11,0.55)]" viewBox="0 0 800 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Glow */}
            <defs>
              <linearGradient id="rockGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <linearGradient id="silverChrome" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#cbd5e1" />
                <stop offset="55%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Lightning bolt icons */}
            <path d="M70 30 L50 90 L85 90 L60 150 L115 80 L85 80 Z" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />
            <path d="M730 30 L710 90 L745 90 L720 150 L775 80 L745 80 Z" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />

            {/* Main Text: ROCK GOD */}
            <text x="400" y="85" textAnchor="middle" fill="url(#rockGold)" fontSize="76" fontFamily="'Russo One', sans-serif" letterSpacing="6" stroke="#000000" strokeWidth="6" paintOrder="stroke fill">
              ROCK GOD
            </text>

            {/* Sub Text: TYCOON */}
            <text x="400" y="145" textAnchor="middle" fill="url(#silverChrome)" fontSize="52" fontFamily="'Russo One', sans-serif" letterSpacing="12" stroke="#000000" strokeWidth="4" paintOrder="stroke fill">
              TYCOON
            </text>
          </svg>
        </div>

        <p className="font-marker text-amber-300 text-lg md:text-xl tracking-wider mb-8 drop-shadow-md">
          De los ensayos en el garaje a los estadios mundiales · Compón, gira y cobra en Web3
        </p>

        {/* Quick Config or Start CTA */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
            <div>
              <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Nombre de tu Banda de Rock</label>
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white font-rock text-center text-lg focus:border-amber-400 outline-none"
                placeholder="Nombre de la banda..."
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Género Principal</label>
              <div className="grid grid-cols-4 gap-1.5">
                {MUSIC_GENRES.slice(0, 4).map(g => (
                  <button
                    key={g.genre}
                    onClick={() => setSelectedGenre(g.genre)}
                    className={`py-1.5 rounded-lg text-xs font-rock uppercase border transition-all ${
                      selectedGenre === g.genre
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {g.genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Start CTA */}
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-rock text-base uppercase tracking-widest border border-amber-300 hover:brightness-110 shadow-2xl shadow-amber-950/80 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
            <span>EMPEZAR PARTIDA · ENTER / ESPACIO</span>
          </button>
        </div>
      </div>

      {/* Bottom Flat Control Hint Line */}
      <div className="relative z-20 w-full py-4 text-center border-t border-white/5 bg-black/50 backdrop-blur-md">
        <p className="text-xs text-slate-400 font-mono-num tracking-wide">
          ESPACIO / ENTER Iniciar · CLICK Navegar Escenarios · 1x/2x/5x Control de Tiempo · RETIRO USDC / USDT Disponible
        </p>
      </div>
    </div>
  );
};
