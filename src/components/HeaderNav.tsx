import React from 'react';
import { rockAudio } from '../audio/rockAudio';
import { 
  Flame, 
  Users, 
  DollarSign, 
  Calendar, 
  Play, 
  Pause, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Wallet, 
  Coins,
  Globe,
  Sliders,
  Building2,
  BarChart3,
  Film,
  Home,
  BookOpen
} from 'lucide-react';

export type ActiveView = 'tour' | 'studio' | 'videos' | 'hq' | 'band' | 'labels' | 'charts';

interface HeaderNavProps {
  bandName: string;
  cash: number;
  fans: number;
  hype: number;
  currentWeek: number;
  currentYear: number;
  gameSpeed: 0 | 1 | 2 | 5;
  activeView: ActiveView;
  isMuted: boolean;
  onSetSpeed: (speed: 0 | 1 | 2 | 5) => void;
  onSelectView: (view: ActiveView) => void;
  onOpenWeb3Modal: () => void;
  onOpenManualModal: () => void;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  bandName,
  cash,
  fans,
  hype,
  currentWeek,
  currentYear,
  gameSpeed,
  activeView,
  isMuted,
  onSetSpeed,
  onSelectView,
  onOpenWeb3Modal,
  onOpenManualModal,
  onToggleMute
}) => {
  return (
    <header className="w-full bg-[#090a10]/95 border-b border-white/10 backdrop-blur-xl sticky top-0 z-40 px-4 py-2.5 flex flex-col gap-2.5">
      {/* Top Status Perimeter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Band Name & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center font-rock text-slate-950 font-black text-lg border border-amber-300 shadow-md">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-rock text-white text-base tracking-wide">{bandName}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {fans > 80000 ? 'Dioses del Rock' : fans > 20000 ? 'Banda de Estadio' : fans > 3000 ? 'Banda de Culto' : 'Garaje'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-num">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Semana {currentWeek}, Año {currentYear}</span>
            </div>
          </div>
        </div>

        {/* Vital Economy Readouts */}
        <div className="flex items-center gap-3 bg-black/60 px-3.5 py-1.5 rounded-2xl border border-white/10 font-mono-num">
          {/* Cash & Web3 USD */}
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold text-sm">$</span>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Fondos Banda</div>
              <div className="text-sm font-bold text-white">${cash.toLocaleString()}</div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Fans */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Fans</div>
              <div className="text-sm font-bold text-cyan-300">{fans.toLocaleString()}</div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Hype */}
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Hype</div>
              <div className="text-sm font-bold text-red-400">{hype}%</div>
            </div>
          </div>
        </div>

        {/* Game Speed & Web3 Button & Mute */}
        <div className="flex items-center gap-2">
          {/* Speed Controls */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-white/10 font-mono-num text-xs">
            <button
              onClick={() => onSetSpeed(0)}
              title="Pausar Tiempo"
              className={`p-1.5 rounded-lg transition-colors ${gameSpeed === 0 ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetSpeed(1)}
              title="Velocidad Normal (1x)"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${gameSpeed === 1 ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              1x
            </button>
            <button
              onClick={() => onSetSpeed(2)}
              title="Velocidad Rápida (2x)"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${gameSpeed === 2 ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              2x
            </button>
            <button
              onClick={() => onSetSpeed(5)}
              title="Velocidad Turbo (5x)"
              className={`p-1.5 rounded-lg transition-colors ${gameSpeed === 5 ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Web3 Cashout Trigger */}
          <button
            onClick={onOpenWeb3Modal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-rock text-xs uppercase tracking-wider border border-emerald-400/50 hover:brightness-110 shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
          >
            <Coins className="w-4 h-4 text-emerald-200" />
            <span>Retirar USDC/USDT</span>
          </button>

          {/* Manual & Licencia Button */}
          <button
            onClick={onOpenManualModal}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-amber-300 hover:text-white hover:border-amber-400/50 text-xs font-rock uppercase tracking-wider transition-all"
            title="Abrir Manual de Usuario & Licencia EULA"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Manual</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Module Navigation Bar */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'tour' as ActiveView, label: 'Giras & Escenario 2D', icon: Globe },
          { id: 'studio' as ActiveView, label: 'Estudio & Portadas', icon: Sliders },
          { id: 'videos' as ActiveView, label: 'Videoclips (MTV)', icon: Film },
          { id: 'hq' as ActiveView, label: 'Sede & Ensayos', icon: Home },
          { id: 'band' as ActiveView, label: 'Banda & Habilidades', icon: Users },
          { id: 'labels' as ActiveView, label: 'Discográficas & Contratos', icon: Building2 },
          { id: 'charts' as ActiveView, label: 'Charts & Ventas en Vivo', icon: BarChart3 }
        ].map((tab) => {
          const isSelected = activeView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectView(tab.id);
                rockAudio.playPowerChord(82, 0.2);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-rock uppercase tracking-wider transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-950/40'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
