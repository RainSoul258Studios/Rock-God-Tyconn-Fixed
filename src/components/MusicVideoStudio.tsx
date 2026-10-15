import React, { useState, useRef, useEffect } from 'react';
import { Song, MusicVideo } from '../types/game';
import { rockAudio } from '../audio/rockAudio';
import { 
  Film, 
  Video, 
  Play, 
  Sparkles, 
  Eye, 
  Flame, 
  Clapperboard, 
  MessageSquare, 
  TrendingUp,
  Tv
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MusicVideoStudioProps {
  cash: number;
  currentWeek: number;
  currentYear: number;
  discography: Song[];
  musicVideos: MusicVideo[];
  onVideoCreated: (newVideo: MusicVideo, totalCost: number) => void;
}

const DIRECTORS = [
  {
    id: 'student',
    name: 'Estudiante de Cine con Cámara VHS',
    cost: 450,
    multiplier: 1.2,
    desc: 'Bajo presupuesto, iluminación de garaje y estilo lo-fi auténtico.'
  },
  {
    id: 'indie',
    name: 'Director Indie de Videos de Culto',
    cost: 2800,
    multiplier: 2.8,
    desc: 'Lentes anamórficos, planos secuencia y rotación en canales alternativos.'
  },
  {
    id: 'mtv_pro',
    name: 'Visionario de los Premios MTV',
    cost: 11000,
    multiplier: 6.5,
    desc: 'Pirotecnia a gran escala, drones, coreografías y emisión en horario estelar.'
  },
  {
    id: 'hollywood',
    name: 'Director Legendario de Hollywood',
    cost: 38000,
    multiplier: 16.0,
    desc: 'Efectos CGI de primer nivel, helicópteros y estreno global en cines y YouTube.'
  }
];

const VIDEO_CONCEPTS = [
  { id: 'desert_fire', name: 'Concierto en el Desierto con Fuego', icon: '🔥', boost: 'Hype' },
  { id: 'gothic_mansion', name: 'Mansión Gótica & Sombras', icon: '🦇', boost: 'Fans de Culto' },
  { id: 'cyber_heist', name: 'Atraco Callejero Cyberpunk', icon: '⚡', boost: 'Viralidad' },
  { id: 'psychedelic_trip', name: 'Viaje Cósmico Psicodélico', icon: '🌌', boost: 'Premios' }
];

export const MusicVideoStudio: React.FC<MusicVideoStudioProps> = ({
  cash,
  currentWeek,
  currentYear,
  discography,
  musicVideos,
  onVideoCreated
}) => {
  const [selectedSongId, setSelectedSongId] = useState<string>(discography[0]?.id || '');
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>('indie');
  const [selectedConcept, setSelectedConcept] = useState<string>('desert_fire');
  const [fxBudget, setFxBudget] = useState<number>(1000);
  const [isFilming, setIsFilming] = useState<boolean>(false);
  const [filmingProgress, setFilmingProgress] = useState<number>(0);
  const [justReleasedVideo, setJustReleasedVideo] = useState<MusicVideo | null>(null);

  const selectedSong = discography.find(s => s.id === selectedSongId) || discography[0];
  const selectedDirector = DIRECTORS.find(d => d.id === selectedDirectorId) || DIRECTORS[0];
  const totalCost = selectedDirector.cost + fxBudget;
  const canAfford = cash >= totalCost;

  const filmingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (filmingTimerRef.current !== null) {
        clearInterval(filmingTimerRef.current);
      }
    };
  }, []);

  const handleStartFilming = () => {
    if (!canAfford || !selectedSong || isFilming) return;
    setIsFilming(true);
    setFilmingProgress(0);
    setJustReleasedVideo(null);

    rockAudio.playPowerChord(82, 0.6);
    rockAudio.playKick();

    if (filmingTimerRef.current !== null) {
      clearInterval(filmingTimerRef.current);
    }

    let progress = 0;
    filmingTimerRef.current = window.setInterval(() => {
      progress += 12;
      if (progress === 48 || progress === 60) {
        rockAudio.playPyro();
      }

      if (progress >= 100) {
        if (filmingTimerRef.current !== null) {
          clearInterval(filmingTimerRef.current);
          filmingTimerRef.current = null;
        }
        setFilmingProgress(100);
        setIsFilming(false);

        // Calculate initial viral views based on song quality and director
        const baseViews = Math.floor(
          (selectedSong.quality * 280) * selectedDirector.multiplier + (fxBudget * 12)
        );

        const newVideo: MusicVideo = {
          id: `video_${Date.now()}`,
          songId: selectedSong.id,
          songTitle: selectedSong.title,
          directorTier: selectedDirector.name,
          concept: VIDEO_CONCEPTS.find(c => c.id === selectedConcept)?.name || 'Rock en Vivo',
          budget: totalCost,
          viewsTotal: baseViews,
          weeklyViews: Math.floor(baseViews * 0.35),
          releaseWeek: currentWeek,
          releaseYear: currentYear
        };

        setJustReleasedVideo(newVideo);
        onVideoCreated(newVideo, totalCost);
        rockAudio.playCrowdCheer(1.0);
        confetti({ particleCount: 90, spread: 80 });
      } else {
        setFilmingProgress(progress);
      }
    }, 280);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30">
            <Film className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">PRODUCCIÓN DE VIDEOCLIPS (ROCKTUBE & MTV)</h1>
            <p className="text-xs text-slate-400">Dirige videoclips espectaculares, arrasa en visualizaciones y catapulta la fama de tus canciones</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono-num">
          <Tv className="w-4 h-4 text-pink-400" />
          <span className="text-slate-400">Videos Grabados:</span>
          <span className="text-white font-bold">{musicVideos.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Song Picker */}
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-3">1. Seleccionar Canción para el Videoclip</span>
            {discography.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs">
                Primero debes componer y grabar canciones en el Estudio para poder rodar videoclips.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {discography.map(s => {
                  const isSelected = selectedSong?.id === s.id;
                  const hasVideo = musicVideos.some(v => v.songId === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSongId(s.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-pink-500/20 border-pink-400 text-white shadow-md'
                          : 'bg-slate-900/70 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-rock text-xs text-white">{s.title}</div>
                        <div className="text-[10px] text-slate-400">{s.genre} · Calidad: {s.quality}/100</div>
                      </div>
                      {hasVideo && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-900/50 text-pink-300 font-bold">
                          Clip Rodado
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Director & Concept */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Director */}
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-3">2. Elegir Director</span>
              <div className="flex flex-col gap-2">
                {DIRECTORS.map(d => {
                  const isSelected = selectedDirectorId === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDirectorId(d.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-pink-500/20 border-pink-400 text-white shadow-md'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-rock text-xs text-white">{d.name}</span>
                        <span className="text-xs font-mono-num font-bold text-emerald-400">
                          ${d.cost.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{d.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Concept & FX Budget */}
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-3">3. Concepto Visual</span>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {VIDEO_CONCEPTS.map(c => {
                    const isSelected = selectedConcept === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedConcept(c.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xl">{c.icon}</span>
                        <div className="truncate text-xs font-semibold">{c.name}</div>
                      </button>
                    );
                  })}
                </div>

                {/* FX Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono-num">
                    <span className="text-slate-400 uppercase font-semibold">Presupuesto Pirotecnia & FX</span>
                    <span className="text-amber-400 font-bold">${fxBudget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={15000}
                    step={200}
                    value={fxBudget}
                    onChange={(e) => setFxBudget(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Total cost & Action */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono-num">
                  <span>Presupuesto Total de Producción:</span>
                  <span className="text-white font-bold">${totalCost.toLocaleString()} USD</span>
                </div>

                {isFilming && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-pink-400 mb-1 font-mono-num animate-pulse">
                      <span>¡Rodando tomas en el set...!</span>
                      <span>{filmingProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 transition-all" style={{ width: `${filmingProgress}%` }} />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStartFilming}
                  disabled={!canAfford || !selectedSong || isFilming}
                  className={`w-full py-3.5 rounded-xl font-rock text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                    !canAfford || !selectedSong || isFilming
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white font-black border-pink-400 hover:brightness-110 shadow-lg cursor-pointer active:scale-98'
                  }`}
                >
                  <Clapperboard className="w-4 h-4" />
                  {isFilming ? 'Filmando Escenas...' : '¡Filmar & Publicar en RockTube!'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Video Catalog / RockTube Player */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <span className="text-xs uppercase font-bold text-pink-400 tracking-wider">Tus Videos en RockTube</span>

            {musicVideos.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
                Aún no has filmado videoclips. Rueda uno para ganar millones de reproducciones virales y acelerar la venta de entradas.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {musicVideos.map(v => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col gap-1.5 font-mono-num">
                    <div className="flex items-center justify-between">
                      <h4 className="font-rock text-xs text-white truncate">{v.songTitle}</h4>
                      <span className="text-[10px] text-pink-400 font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {v.viewsTotal.toLocaleString()} vistas
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{v.concept} · {v.directorTier}</p>
                    <div className="text-[10px] text-emerald-400 flex justify-between pt-1 border-t border-white/5">
                      <span>Genera ~+{v.weeklyViews.toLocaleString()} vistas/sem</span>
                      <span>Semana {v.releaseWeek}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
