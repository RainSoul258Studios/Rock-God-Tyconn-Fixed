import React, { useState, useRef, useEffect } from 'react';
import { 
  Song, 
  MusicGenre, 
  LyricTheme, 
  BandMember, 
  SongStructure, 
  SongBalance, 
  SongReview, 
  Album,
  AlbumCoverConfig
} from '../types/game';
import { AlbumCoverEditor } from './AlbumCoverEditor';
import { MUSIC_GENRES, LYRIC_THEMES, STUDIO_TIERS, CRITIC_OUTLETS } from '../data/rockData';
import { rockAudio } from '../audio/rockAudio';
import { 
  Disc, 
  Sliders, 
  Play, 
  Sparkles, 
  Flame, 
  Music, 
  Plus, 
  CheckCircle2, 
  Star,
  Layers,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SongStudioProps {
  bandName: string;
  cash: number;
  members: BandMember[];
  currentWeek: number;
  currentYear: number;
  discography: Song[];
  albums: Album[];
  onSongRecorded: (newSong: Song, studioCost: number) => void;
  onAlbumReleased: (newAlbum: Album) => void;
}

const SONG_NAME_PREFIXES = [
  'Thunder', 'Midnight', 'Neon', 'Electric', 'Iron', 'Savage', 'Blood', 'Velvet', 
  'Dark', 'Psycho', 'Raging', 'Smoking', 'Ghost', 'Atomic', 'Rebel', 'Wild'
];

const SONG_NAME_SUFFIXES = [
  'Rider', 'Flame', 'Highway', 'Whiskey', 'Machine', 'Storm', 'Queen', 'Angel', 
  'Demon', 'Symphony', 'Bullet', 'Eclipse', 'Fever', 'Shadow', 'Destiny', 'Vibration'
];

export const SongStudio: React.FC<SongStudioProps> = ({
  bandName,
  cash,
  members,
  currentWeek,
  currentYear,
  discography,
  albums,
  onSongRecorded,
  onAlbumReleased
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'album' | 'discography'>('single');

  // Song Creation Form State
  const [title, setTitle] = useState<string>('Electric Highway');
  const [genre, setGenre] = useState<MusicGenre>('Hard Rock');
  const [theme, setTheme] = useState<LyricTheme>('Rebellion');
  const [selectedStudioTier, setSelectedStudioTier] = useState<number>(1);
  const [selectedRiffKey, setSelectedRiffKey] = useState<string>('E Minor');

  // Song Structure
  const [structure, setStructure] = useState<SongStructure>({
    intro: true,
    verses: 2,
    chorus: 2,
    guitarSolo: true,
    bridge: true,
    breakdown: false,
    outro: true
  });

  // Instrument Balance Mixing Faders
  const [balance, setBalance] = useState<SongBalance>({
    vocals: 75,
    leadGuitar: 85,
    bass: 65,
    drums: 80,
    synthFx: 30
  });

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [completedSong, setCompletedSong] = useState<Song | null>(null);

  // Album Builder State
  const [albumTitle, setAlbumTitle] = useState<string>('Volume I: Resurrection');
  const [albumType, setAlbumType] = useState<'Single' | 'EP' | 'Full Album'>('EP');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [albumCoverColor, setAlbumCoverColor] = useState<string>('#f59e0b');
  const [coverConfig, setCoverConfig] = useState<AlbumCoverConfig>({
    background: 'vinyl',
    textColor: '#f59e0b',
    badge: 'parental',
    filter: 'vintage'
  });

  // Randomize Song Name
  const handleRandomName = () => {
    const pre = SONG_NAME_PREFIXES[Math.floor(Math.random() * SONG_NAME_PREFIXES.length)];
    const suf = SONG_NAME_SUFFIXES[Math.floor(Math.random() * SONG_NAME_SUFFIXES.length)];
    setTitle(`${pre} ${suf}`);
    rockAudio.playPowerChord(98, 0.4);
  };

  // Preview Riff Sound
  const handlePreviewRiff = () => {
    rockAudio.playPowerChord(82.41, 0.7);
    setTimeout(() => rockAudio.playPowerChord(98.0, 0.6), 280);
    setTimeout(() => rockAudio.playPowerChord(110.0, 0.9), 560);
  };

  // Studio Cost
  const currentStudio = STUDIO_TIERS.find(s => s.tier === selectedStudioTier) || STUDIO_TIERS[0];
  const canAffordStudio = cash >= currentStudio.cost;

  // Calculate Quality & Reviews
  const calculateSongOutcome = (): Song => {
    // 1. Members Skill Contribution
    const singer = members.find(m => m.role === 'Vocals') || members[0];
    const guitarist = members.find(m => m.role === 'Lead Guitar') || members[1];
    const bassist = members.find(m => m.role === 'Bass') || members[2];
    const drummer = members.find(m => m.role === 'Drums') || members[3];

    const vocalScore = (singer.skills.songwriting * 0.4 + singer.skills.creativity * 0.4 + singer.skills.technique * 0.2) * (balance.vocals / 100);
    const guitarScore = (guitarist.skills.technique * 0.5 + guitarist.skills.creativity * 0.5) * (balance.leadGuitar / 100);
    const rhythmScore = ((bassist.skills.technique + drummer.skills.technique) / 2) * ((balance.bass + balance.drums) / 200);

    // 2. Genre and Theme Synergy
    const genreMeta = MUSIC_GENRES.find(g => g.genre === genre);
    const hasSynergy = genreMeta?.bestThemes.includes(theme);
    const synergyBonus = hasSynergy ? 12 : 3;

    // 3. Structure Complexity
    let structureBonus = 0;
    if (structure.intro) structureBonus += 2;
    if (structure.guitarSolo) structureBonus += 6;
    if (structure.bridge) structureBonus += 4;
    if (structure.breakdown) structureBonus += 3;
    if (structure.outro) structureBonus += 2;

    // 4. Studio Bonus
    const studioBonus = currentStudio.minQualityBonus + Math.floor(Math.random() * (currentStudio.maxQualityBonus - currentStudio.minQualityBonus + 1));

    // Final Quality calculation (capped between 10 and 100)
    const rawQuality = Math.round((vocalScore * 0.35 + guitarScore * 0.35 + rhythmScore * 0.3) * 0.65 + synergyBonus + structureBonus + studioBonus);
    const quality = Math.max(15, Math.min(100, rawQuality));

    // Reviews Generation
    const reviews: SongReview[] = CRITIC_OUTLETS.map(outlet => {
      const outletRating = Math.max(1, Math.min(10, Math.round((quality / 10) * outlet.weight + (Math.random() * 1.6 - 0.8))));
      let quote = '';
      if (outletRating >= 9) {
        quote = `¡Una obra maestra atronadora! El solo de guitarra y la fuerza vocal colocan a ${genre} en lo más alto.`;
      } else if (outletRating >= 7) {
        quote = `Riffs memorables y un gancho pegadizo. Gran producción que encenderá los estadios.`;
      } else if (outletRating >= 5) {
        quote = `Sólido pero predecible. Tiene actitud rockera pero le falta algo de riesgo en la mezcla.`;
      } else {
        quote = `Falta de pulido en la estructura y producción ruidosa. Buen intento que necesita más ensayos.`;
      }
      return {
        outlet: outlet.name,
        rating: outletRating,
        quote
      };
    });

    return {
      id: `song_${Date.now()}`,
      title,
      genre,
      theme,
      structure,
      balance,
      quality,
      recordedWeek: currentWeek,
      recordedYear: currentYear,
      studioTier: selectedStudioTier,
      streamsTotal: 0,
      streamsThisWeek: 0,
      digitalSales: 0,
      chartRank: null,
      reviews,
      riffKey: selectedRiffKey
    };
  };

  const recordingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current !== null) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Start Recording Session
  const handleStartRecording = () => {
    if (!canAffordStudio || isRecording) return;
    setIsRecording(true);
    setRecordProgress(0);
    setCompletedSong(null);

    // Audio effects during recording
    rockAudio.playKick();
    rockAudio.playPowerChord(82.41, 0.8);

    let currentProgress = 0;
    if (recordingTimerRef.current !== null) {
      clearInterval(recordingTimerRef.current);
    }

    recordingTimerRef.current = window.setInterval(() => {
      currentProgress += 10;

      if (currentProgress === 40) {
        rockAudio.playSnare();
      } else if (currentProgress === 70) {
        rockAudio.playPowerChord(110, 0.7);
      }

      if (currentProgress >= 100) {
        if (recordingTimerRef.current !== null) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecordProgress(100);
        setIsRecording(false);
        const finishedSong = calculateSongOutcome();
        setCompletedSong(finishedSong);
        onSongRecorded(finishedSong, currentStudio.cost);
        rockAudio.playSoloRiff();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        setRecordProgress(currentProgress);
      }
    }, 280);
  };

  // Build Album
  const handleCreateAlbum = () => {
    const selectedSongs = discography.filter(s => selectedSongIds.includes(s.id));
    if (selectedSongs.length === 0) return;

    const avgScore = Math.round(selectedSongs.reduce((acc, s) => acc + s.quality, 0) / selectedSongs.length);
    const newAlbum: Album = {
      id: `album_${Date.now()}`,
      title: albumTitle,
      type: albumType,
      songs: selectedSongs,
      releaseWeek: currentWeek,
      releaseYear: currentYear,
      coverArtSeed: albumCoverColor,
      coverConfig,
      physicalCopiesSold: 0,
      totalRevenue: 0,
      criticScore: avgScore
    };

    onAlbumReleased(newAlbum);
    rockAudio.playCrowdCheer(0.9);
    confetti({ particleCount: 100, spread: 90 });
    setActiveTab('discography');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Studio Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Sliders className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">ESTUDIO DE COMPOSICIÓN & DISCOGRAFÍA</h1>
            <p className="text-xs text-slate-400">Diseña estructuras, mezcla instrumentos y crea singles y álbumes legendarios</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-lg text-xs font-rock tracking-wider uppercase transition-all ${
              activeTab === 'single'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grabar Single
          </button>
          <button
            onClick={() => setActiveTab('album')}
            className={`px-4 py-2 rounded-lg text-xs font-rock tracking-wider uppercase transition-all ${
              activeTab === 'album'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Álbum / EP
          </button>
          <button
            onClick={() => setActiveTab('discography')}
            className={`px-4 py-2 rounded-lg text-xs font-rock tracking-wider uppercase transition-all ${
              activeTab === 'discography'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Discografía ({discography.length})
          </button>
        </div>
      </div>

      {/* TAB 1: RECORD SINGLE */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Song Identity & Genre */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Song Title & Preview */}
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Identidad del Tema</span>
                <button
                  onClick={handleRandomName}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Nombre Aleatorio
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[11px] text-slate-400 uppercase font-semibold mb-1 block">Título de la Canción</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-white font-rock text-lg focus:border-amber-400 outline-none"
                    placeholder="Escribe el nombre del hit..."
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-semibold mb-1 block">Tonalidad / Riff</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRiffKey}
                      onChange={(e) => setSelectedRiffKey(e.target.value)}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono-num outline-none focus:border-amber-400"
                    >
                      <option value="E Minor">E Minor (Clásico)</option>
                      <option value="A Minor">A Minor (Poder)</option>
                      <option value="D Minor">D Minor (Oscuro)</option>
                      <option value="G Major">G Major (Himno)</option>
                      <option value="Drop D">Drop D (Heavy Metal)</option>
                    </select>
                    <button
                      onClick={handlePreviewRiff}
                      title="Escuchar Riff"
                      className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                    >
                      <Play className="w-4 h-4 fill-amber-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Genre Selector */}
              <div className="mt-5">
                <label className="text-[11px] text-slate-400 uppercase font-semibold mb-2 block">Género Musical</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MUSIC_GENRES.map((g) => {
                    const isSelected = genre === g.genre;
                    return (
                      <button
                        key={g.genre}
                        onClick={() => {
                          setGenre(g.genre);
                          rockAudio.playPowerChord(82, 0.3);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-950/40'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <div className="font-rock text-xs mb-1" style={{ color: isSelected ? '#f59e0b' : g.color }}>
                          {g.genre}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-num">{g.bpmRange}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lyric Theme Selector */}
              <div className="mt-5">
                <label className="text-[11px] text-slate-400 uppercase font-semibold mb-2 block">Temática de las Letras</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LYRIC_THEMES.map((t) => {
                    const isSelected = theme === t.theme;
                    return (
                      <button
                        key={t.theme}
                        onClick={() => setTheme(t.theme)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-red-500/20 border-red-400 text-white shadow-md'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <div className="truncate text-xs font-semibold">{t.theme}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Song Structure & Faders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Structure Builder */}
              <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-4">Estructura del Tema</span>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                    <span>Intro Riff Potente</span>
                    <input
                      type="checkbox"
                      checked={structure.intro}
                      onChange={(e) => setStructure({ ...structure, intro: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                    <span>Cantidad de Estrofas</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map(v => (
                        <button
                          key={v}
                          onClick={() => setStructure({ ...structure, verses: v })}
                          className={`w-7 h-7 rounded text-xs font-mono-num font-bold ${
                            structure.verses === v ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                    <span>Repeticiones del Coro</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map(c => (
                        <button
                          key={c}
                          onClick={() => setStructure({ ...structure, chorus: c })}
                          className={`w-7 h-7 rounded text-xs font-mono-num font-bold ${
                            structure.chorus === c ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                    <span className="flex items-center gap-2 text-amber-300 font-semibold">
                      <Flame className="w-4 h-4 text-red-500" />
                      Solo de Guitarra Épico
                    </span>
                    <input
                      type="checkbox"
                      checked={structure.guitarSolo}
                      onChange={(e) => setStructure({ ...structure, guitarSolo: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                    <span>Puente Melódico (Bridge)</span>
                    <input
                      type="checkbox"
                      checked={structure.bridge}
                      onChange={(e) => setStructure({ ...structure, bridge: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
                    <span>Outro con Explosión Final</span>
                    <input
                      type="checkbox"
                      checked={structure.outro}
                      onChange={(e) => setStructure({ ...structure, outro: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Mixing Console Faders */}
              <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-4">Consola de Mezcla (Faders)</span>
                <div className="flex flex-col gap-4">
                  {[
                    { key: 'vocals' as const, label: 'Voz Principal', val: balance.vocals },
                    { key: 'leadGuitar' as const, label: 'Guitarra Líder', val: balance.leadGuitar },
                    { key: 'bass' as const, label: 'Línea de Bajo', val: balance.bass },
                    { key: 'drums' as const, label: 'Batería & Percusión', val: balance.drums },
                    { key: 'synthFx' as const, label: 'Sintetizador & FX', val: balance.synthFx }
                  ].map((fader) => (
                    <div key={fader.key}>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>{fader.label}</span>
                        <span className="font-mono-num font-bold text-amber-400">{fader.val}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={fader.val}
                        onChange={(e) => setBalance({ ...balance, [fader.key]: Number(e.target.value) })}
                        className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Selection & Action */}
          <div className="flex flex-col gap-6">
            {/* Studio Tier Selection */}
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Elegir Estudio de Grabación</span>
              
              <div className="flex flex-col gap-2">
                {STUDIO_TIERS.map((st) => {
                  const isSelected = selectedStudioTier === st.tier;
                  const canPay = cash >= st.cost;
                  return (
                    <button
                      key={st.tier}
                      onClick={() => setSelectedStudioTier(st.tier)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-lg'
                          : 'bg-slate-900/70 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-rock text-xs text-white">{st.name}</span>
                        <span className={`text-xs font-mono-num font-bold ${canPay ? 'text-emerald-400' : 'text-red-400'}`}>
                          ${st.cost.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{st.desc}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-amber-400 font-mono-num">
                        <span>Calidad base: +{st.minQualityBonus}-{st.maxQualityBonus} pts</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recording Action Button */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-400 mb-3 font-mono-num">
                  <span>Costo de Grabación:</span>
                  <span className="text-white font-bold">${currentStudio.cost.toLocaleString()}</span>
                </div>

                {isRecording && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-amber-400 mb-1 font-mono-num">
                      <span className="animate-pulse">Grabando pistas en estudio...</span>
                      <span>{recordProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-200"
                        style={{ width: `${recordProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStartRecording}
                  disabled={!canAffordStudio || isRecording}
                  className={`w-full py-3.5 rounded-xl font-rock text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                    !canAffordStudio || isRecording
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold border-amber-300 hover:brightness-110 shadow-lg shadow-amber-950/50 active:scale-98 cursor-pointer'
                  }`}
                >
                  <Disc className={`w-4 h-4 ${isRecording ? 'animate-spin' : ''}`} />
                  {isRecording ? 'Grabando Tema...' : '¡Grabar Canción Ahora!'}
                </button>
              </div>
            </div>

            {/* Results Review if completed */}
            {completedSong && (
              <div className="bg-[#0f111a] border border-amber-500/40 rounded-2xl p-5 shadow-2xl animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-rock text-xs tracking-wider uppercase">¡Tema Grabado con Éxito!</span>
                </div>

                <h3 className="font-rock text-xl text-white mb-1">{completedSong.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs font-semibold">
                    {completedSong.genre}
                  </span>
                  <span className="text-xs text-slate-400 font-mono-num">
                    Calidad: <strong className="text-white text-sm">{completedSong.quality}/100</strong>
                  </span>
                </div>

                <div className="text-xs uppercase font-bold text-slate-400 mb-2">Reseñas de la Crítica:</div>
                <div className="flex flex-col gap-2.5">
                  {completedSong.reviews.map((rev, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-amber-300">{rev.outlet}</span>
                        <div className="flex items-center gap-1 text-xs font-mono-num font-bold text-white">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          {rev.rating}/10
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 italic">"{rev.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BUILD ALBUM */}
      {activeTab === 'album' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <h2 className="font-rock text-xl text-white mb-1">COMPILACIÓN & LANZAMIENTO DE ÁLBUM</h2>
              <p className="text-xs text-slate-400">Selecciona los temas de tu catálogo para empaquetarlos en un lanzamiento oficial</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-semibold mb-1 block">Título del Álbum</label>
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white font-rock text-md focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase font-semibold mb-1 block">Tipo de Lanzamiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAlbumType('EP')}
                    className={`py-2.5 rounded-xl text-xs font-rock uppercase border transition-all ${
                      albumType === 'EP' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 text-slate-400 border-white/5'
                    }`}
                  >
                    EP (3-5 temas)
                  </button>
                  <button
                    onClick={() => setAlbumType('Full Album')}
                    className={`py-2.5 rounded-xl text-xs font-rock uppercase border transition-all ${
                      albumType === 'Full Album' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 text-slate-400 border-white/5'
                    }`}
                  >
                    Full Album (6+ temas)
                  </button>
                </div>
              </div>
            </div>

            {/* Select Tracklist */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] text-slate-400 uppercase font-semibold">Seleccionar Canciones ({selectedSongIds.length} seleccionadas)</label>
                <span className="text-xs text-amber-400 font-mono-num font-semibold">
                  Mínimo recomendado: {albumType === 'EP' ? '3 temas' : '6 temas'}
                </span>
              </div>

              {discography.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs">
                  Aún no has grabado canciones. Ve a la pestaña "Grabar Single" para componer tus primeros temas.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                  {discography.map((s) => {
                    const isSelected = selectedSongIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSongIds(selectedSongIds.filter(id => id !== s.id));
                          } else {
                            setSelectedSongIds([...selectedSongIds, s.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-slate-900/70 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Disc className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div>
                            <div className="font-rock text-xs">{s.title}</div>
                            <div className="text-[10px] text-slate-400">{s.genre} · Calidad: {s.quality}/100</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-600'}`}>
                          {isSelected ? '✓ Incluido' : '+ Agregar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Album Cover Art Studio */}
            <div>
              <label className="text-[11px] text-slate-400 uppercase font-semibold mb-2 block">Diseño de Portada Oficial del Disco</label>
              <AlbumCoverEditor
                albumTitle={albumTitle}
                bandName={bandName}
                config={coverConfig}
                onChangeConfig={setCoverConfig}
              />
            </div>

            <button
              onClick={handleCreateAlbum}
              disabled={selectedSongIds.length === 0}
              className={`w-full py-3.5 rounded-xl font-rock text-xs uppercase tracking-wider border transition-all ${
                selectedSongIds.length === 0
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold border-amber-300 hover:brightness-110 shadow-lg cursor-pointer'
              }`}
            >
              ¡Publicar {albumType} Oficial con Esta Portada!
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DISCOGRAPHY LIST */}
      {activeTab === 'discography' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-rock text-xl text-white">CATÁLOGO MUSICAL ({discography.length} TEMAS)</h2>
              <p className="text-xs text-slate-400">Total de reproducciones y desempeño de ventas digitales</p>
            </div>
          </div>

          {discography.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs">
              Tu catálogo está vacío. Comienza grabando tu primer sencillo para empezar a ganar fans y reproducciones.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discography.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
                        {s.genre}
                      </span>
                      <span className="text-xs font-mono-num font-bold text-white">
                        Calidad: <strong className="text-amber-400">{s.quality}</strong>/100
                      </span>
                    </div>
                    <h4 className="font-rock text-base text-white mb-1">{s.title}</h4>
                    <p className="text-[11px] text-slate-400 mb-3">Grabado Semana {s.recordedWeek}, Año {s.recordedYear}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono-num">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Reproducciones</div>
                      <div className="text-emerald-400 font-bold">{s.streamsTotal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Ventas Digitales</div>
                      <div className="text-cyan-400 font-bold">{s.digitalSales.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
