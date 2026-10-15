import React, { useState } from 'react';
import { 
  Headquarter, 
  BandMember, 
  Song, 
  AuditionCandidate, 
  InstrumentType 
} from '../types/game';
import { rockAudio } from '../audio/rockAudio';
import { 
  Home, 
  Music, 
  UserPlus, 
  ArrowUpCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  DollarSign, 
  BatteryCharging,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HQManagerProps {
  cash: number;
  fans: number;
  hqTier: number;
  members: BandMember[];
  discography: Song[];
  songMastery: Record<string, number>;
  bandChemistry: number;
  onUpgradeHQ: (newTier: number) => void;
  onRehearseSong: (songId: string) => void;
  onHireMember: (newMember: BandMember, signingFee: number, replaceId?: string) => void;
}

const HEADQUARTERS: Headquarter[] = [
  {
    tier: 1,
    id: 'hq_garage',
    name: 'El Garaje de Mamá',
    weeklyRent: 0,
    minFans: 0,
    description: 'Cajas de cartón, herramientas oxidadas y quejas continuas de los vecinos cuando tocan después de las 9 PM.',
    icon: '🏚️',
    chemistryBonus: 0,
    rehearsalBoost: 1.0
  },
  {
    tier: 2,
    id: 'hq_basement',
    name: 'Sótano Insonorizado Sunset',
    weeklyRent: 150,
    minFans: 600,
    description: 'Paredes con espuma acústica, sofá de cuero desgastado, mininevera y libertad para tocar a todo volumen.',
    icon: '🏢',
    chemistryBonus: 15,
    rehearsalBoost: 1.4
  },
  {
    tier: 3,
    id: 'hq_warehouse',
    name: 'Almacén Industrial & Loft',
    weeklyRent: 650,
    minFans: 5000,
    description: 'Espacio masivo con escenario propio para pruebas de luces, sala de descanso, almacén de merch y bar privado.',
    icon: '🏭',
    chemistryBonus: 30,
    rehearsalBoost: 1.8
  },
  {
    tier: 4,
    id: 'hq_mansion',
    name: 'Mansión en Beverly Hills con Estudio Privado',
    weeklyRent: 2600,
    minFans: 30000,
    description: 'Piscina infinita, estudio analógico de 32 canales, sala de trofeos de platino y helipuerto para giras.',
    icon: '🏰',
    chemistryBonus: 50,
    rehearsalBoost: 2.5
  }
];

const INITIAL_AUDITIONS: AuditionCandidate[] = [
  {
    id: 'cand_1',
    name: 'Kurt "Cobain" Miller',
    role: 'Vocals',
    trait: 'Crowd Magnet',
    skills: { technique: 75, creativity: 82, stagePresence: 88, songwriting: 85, stamina: 70 },
    askingSalary: 120,
    signingFee: 1500
  },
  {
    id: 'cand_2',
    name: 'Dimebag "Shred" Kelly',
    role: 'Lead Guitar',
    trait: 'Virtuoso',
    skills: { technique: 89, creativity: 84, stagePresence: 76, songwriting: 72, stamina: 78 },
    askingSalary: 140,
    signingFee: 2200
  },
  {
    id: 'cand_3',
    name: 'Flea "Thunder" Marquez',
    role: 'Bass',
    trait: 'Wild Party Animal',
    skills: { technique: 82, creativity: 75, stagePresence: 90, songwriting: 60, stamina: 92 },
    askingSalary: 95,
    signingFee: 1100
  },
  {
    id: 'cand_4',
    name: 'Dave "Grohl" Stone',
    role: 'Drums',
    trait: 'Perfectionist',
    skills: { technique: 88, creativity: 80, stagePresence: 84, songwriting: 75, stamina: 95 },
    askingSalary: 130,
    signingFee: 1800
  }
];

export const HQManager: React.FC<HQManagerProps> = ({
  cash,
  fans,
  hqTier,
  members,
  discography,
  songMastery,
  bandChemistry,
  onUpgradeHQ,
  onRehearseSong,
  onHireMember
}) => {
  const [activeTab, setActiveTab] = useState<'hq' | 'rehearsal' | 'auditions'>('rehearsal');
  const [candidates] = useState<AuditionCandidate[]>(INITIAL_AUDITIONS);
  const [selectedReplaceId, setSelectedReplaceId] = useState<string>(members[0]?.id || '');

  const currentHQ = HEADQUARTERS.find(h => h.tier === hqTier) || HEADQUARTERS[0];

  const handleRehearse = (song: Song) => {
    onRehearseSong(song.id);
    rockAudio.playKick();
    rockAudio.playPowerChord(82, 0.4);
  };

  const handleHireCandidate = (cand: AuditionCandidate) => {
    if (cash < cand.signingFee) return;

    const newMember: BandMember = {
      id: `member_${Date.now()}`,
      name: cand.name,
      role: cand.role,
      avatarSeed: cand.name.toLowerCase().replace(/\s+/g, '_'),
      trait: cand.trait,
      skills: { ...cand.skills },
      energy: 100,
      morale: 100,
      gearLevel: 2,
      salaryPerWeek: cand.askingSalary
    };

    onHireMember(newMember, cand.signingFee, selectedReplaceId);
    rockAudio.playSoloRiff();
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Home className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">SEDE DE LA BANDA, ENSAYOS & AUDICIONES</h1>
            <p className="text-xs text-slate-400">Mejora el local de la banda, domina tus canciones al 100% y ficha músicos mercenarios</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('rehearsal')}
            className={`px-4 py-2 rounded-lg text-xs font-rock uppercase tracking-wider transition-all ${
              activeTab === 'rehearsal' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sala de Ensayos ({discography.length})
          </button>
          <button
            onClick={() => setActiveTab('hq')}
            className={`px-4 py-2 rounded-lg text-xs font-rock uppercase tracking-wider transition-all ${
              activeTab === 'hq' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sedes & Mudanza
          </button>
          <button
            onClick={() => setActiveTab('auditions')}
            className={`px-4 py-2 rounded-lg text-xs font-rock uppercase tracking-wider transition-all ${
              activeTab === 'auditions' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audiciones
          </button>
        </div>
      </div>

      {/* TAB 1: REHEARSAL ROOM */}
      {activeTab === 'rehearsal' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h2 className="font-rock text-lg text-white">SALA DE ENSAYOS & MAESTRÍA DE REPERTORIO</h2>
              <p className="text-xs text-slate-400">Ensayar sube la Maestría de 0% a 100%. Una canción al 100% evita pifias en vivo y multiplica el Hype del público.</p>
            </div>
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono-num">
              <span className="text-slate-400">Bono de Sede ({currentHQ.name}):</span>
              <span className="text-amber-400 font-bold">x{currentHQ.rehearsalBoost} velocidad</span>
            </div>
          </div>

          {discography.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs">
              Aún no has compuesto canciones. Ve a "Estudio & Composición" para grabar tus primeros temas antes de ensayarlos.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discography.map(song => {
                const mastery = songMastery[song.id] || 0;
                const isMastered = mastery >= 100;

                return (
                  <div key={song.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col justify-between gap-3 font-mono-num">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-rock text-sm text-white font-sans">{song.title}</span>
                        <span className={`text-xs font-bold ${isMastered ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {mastery}% Dominado
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{song.genre} · Calidad: {song.quality}/100</p>
                      
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isMastered ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-500 font-sans">
                        {isMastered ? '✓ Listo para estadios sin errores' : 'Requiere ensayos para perfeccionar'}
                      </span>
                      <button
                        onClick={() => handleRehearse(song)}
                        disabled={isMastered}
                        className={`px-3 py-1.5 rounded-lg text-xs font-rock uppercase tracking-wider border transition-all ${
                          isMastered
                            ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                            : 'bg-amber-500 text-black border-amber-300 hover:brightness-110 active:scale-95 cursor-pointer'
                        }`}
                      >
                        {isMastered ? '¡Perfeccionado!' : 'Ensayar Tema (+25%)'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HEADQUARTERS */}
      {activeTab === 'hq' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HEADQUARTERS.map(hq => {
            const isCurrent = hq.tier === hqTier;
            const meetsFans = fans >= hq.minFans;
            const canAfford = cash >= hq.weeklyRent * 4;

            return (
              <div
                key={hq.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-400 shadow-xl ring-1 ring-amber-400'
                    : meetsFans
                    ? 'bg-[#0f111a] border-white/10 hover:border-white/20'
                    : 'bg-[#0a0b10] border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{hq.icon}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      Nivel {hq.tier}
                    </span>
                  </div>

                  <h3 className="font-rock text-base text-white mb-1">{hq.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{hq.description}</p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/80 border border-white/5 mb-4 text-xs font-mono-num">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Alquiler Semanal</div>
                      <div className="text-amber-400 font-bold">${hq.weeklyRent} USD/sem</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Bono de Química</div>
                      <div className="text-emerald-400 font-bold">+{hq.chemistryBonus}% Química</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Fans Requeridos</div>
                      <div className={meetsFans ? 'text-white font-bold' : 'text-red-400 font-bold'}>
                        {hq.minFans.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Bono Ensayos</div>
                      <div className="text-cyan-400 font-bold">x{hq.rehearsalBoost} Velocidad</div>
                    </div>
                  </div>
                </div>

                <div>
                  {isCurrent ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center text-xs text-amber-300 font-rock uppercase tracking-wider">
                      Sede Actual de la Banda
                    </div>
                  ) : !meetsFans ? (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-500 font-mono-num">
                      Requiere {hq.minFans.toLocaleString()} Fans para Mudarse
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpgradeHQ(hq.tier)}
                      className="w-full py-3 rounded-xl font-rock text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-black border border-amber-300 hover:brightness-110 shadow-lg cursor-pointer"
                    >
                      Mudarse a Esta Sede (${hq.weeklyRent}/sem)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: AUDITIONS / MERCENARIES */}
      {activeTab === 'auditions' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h2 className="font-rock text-lg text-white">MERCADO DE AUDICIONES & FICHAJES</h2>
              <p className="text-xs text-slate-400">Contrata músicos virtuosos con estadísticas superiores para sustituir o potenciar a los miembros de tu banda.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Reemplazar a:</span>
              <select
                value={selectedReplaceId}
                onChange={(e) => setSelectedReplaceId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono-num outline-none focus:border-amber-400"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map(cand => {
              const canAffordFee = cash >= cand.signingFee;

              return (
                <div key={cand.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-rock text-sm text-white">{cand.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                        {cand.trait}
                      </span>
                    </div>
                    <div className="text-xs text-amber-400 font-semibold mb-3">{cand.role}</div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono-num mb-3">
                      <div>Técnica: <strong className="text-white">{cand.skills.technique}</strong></div>
                      <div>Creatividad: <strong className="text-white">{cand.skills.creativity}</strong></div>
                      <div>Presencia: <strong className="text-white">{cand.skills.stagePresence}</strong></div>
                      <div>Letras: <strong className="text-white">{cand.skills.songwriting}</strong></div>
                      <div>Resistencia: <strong className="text-white">{cand.skills.stamina}</strong></div>
                      <div>Salario: <strong className="text-emerald-400">${cand.askingSalary}/sem</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono-num text-slate-400">
                      Firma de Fichaje: <strong className="text-amber-400">${cand.signingFee}</strong>
                    </span>
                    <button
                      onClick={() => handleHireCandidate(cand)}
                      disabled={!canAffordFee}
                      className={`px-4 py-2 rounded-xl text-xs font-rock uppercase tracking-wider border transition-all ${
                        !canAffordFee
                          ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 hover:brightness-110 shadow-lg cursor-pointer'
                      }`}
                    >
                      Fichar Músico
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
