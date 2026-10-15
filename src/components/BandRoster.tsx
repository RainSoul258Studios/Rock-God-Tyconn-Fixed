import React, { useState } from 'react';
import { BandMember } from '../types/game';
import { rockAudio } from '../audio/rockAudio';
import { 
  Users, 
  Sparkles, 
  Flame, 
  BatteryCharging, 
  Award, 
  Zap, 
  Heart, 
  ShieldCheck, 
  ArrowUpCircle,
  Coffee
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BandRosterProps {
  cash: number;
  members: BandMember[];
  onUpdateMember: (updatedMember: BandMember, cost: number) => void;
}

export const BandRoster: React.FC<BandRosterProps> = ({
  cash,
  members,
  onUpdateMember
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  // Training activity definitions
  const TRAINING_PROGRAMS = [
    {
      id: 'train_technique',
      name: 'Práctica Intensiva de Riffs & Metrónomo',
      cost: 250,
      energyCost: 18,
      statBoost: { technique: 3 },
      desc: 'Escalas a alta velocidad, precisión de ataque y articulación de notas.'
    },
    {
      id: 'train_creativity',
      name: 'Jam Session & Experimentación Sónica',
      cost: 220,
      energyCost: 15,
      statBoost: { creativity: 3 },
      desc: 'Improvisación con pedales de modulación y estructuras atípicas.'
    },
    {
      id: 'train_presence',
      name: 'Entrenamiento de Presencia Escénica & Carisma',
      cost: 320,
      energyCost: 20,
      statBoost: { stagePresence: 4 },
      desc: 'Saltos acrobáticos, interacción con el público y dominio del escenario.'
    },
    {
      id: 'train_songwriting',
      name: 'Masterclass de Composición Lírica',
      cost: 380,
      energyCost: 16,
      statBoost: { songwriting: 4 },
      desc: 'Ganchos memorables, métrica poética y armonía vocal.'
    },
    {
      id: 'train_stamina',
      name: 'Acondicionamiento Físico para Giras',
      cost: 160,
      energyCost: 25,
      statBoost: { stamina: 4 },
      desc: 'Resistencia aeróbica y fuerza muscular para aguantar 3 horas de concierto.'
    },
    {
      id: 'train_rest',
      name: 'Día de Spa & Desconexión de Rockstars',
      cost: 190,
      energyCost: -45, // Restores energy!
      statBoost: {},
      moraleBoost: 30,
      desc: 'Masajes, sauna y desconexión total para recargar al 100% las pilas.'
    }
  ];

  // Gear Upgrade levels
  const GEAR_LEVELS = [
    { level: 1, name: 'Equipo de Garaje Básico', cost: 0, boost: 0 },
    { level: 2, name: 'Instrumento Profesional de Gira', cost: 1200, boost: 6 },
    { level: 3, name: 'Custom Shop Signature Model', cost: 4500, boost: 14 },
    { level: 4, name: 'Vintage Legendario de Coleccionista', cost: 15000, boost: 24 },
    { level: 5, name: 'Prototipo de Titanio Cósmico (Rock God)', cost: 40000, boost: 38 }
  ];

  const handleTrain = (program: typeof TRAINING_PROGRAMS[number]) => {
    if (cash < program.cost) return;
    if (program.energyCost > 0 && selectedMember.energy < program.energyCost) return;

    const newSkills = { ...selectedMember.skills };
    if (program.statBoost.technique) {
      newSkills.technique = Math.min(100, newSkills.technique + program.statBoost.technique);
    }
    if (program.statBoost.creativity) {
      newSkills.creativity = Math.min(100, newSkills.creativity + program.statBoost.creativity);
    }
    if (program.statBoost.stagePresence) {
      newSkills.stagePresence = Math.min(100, newSkills.stagePresence + program.statBoost.stagePresence);
    }
    if (program.statBoost.songwriting) {
      newSkills.songwriting = Math.min(100, newSkills.songwriting + program.statBoost.songwriting);
    }
    if (program.statBoost.stamina) {
      newSkills.stamina = Math.min(100, newSkills.stamina + program.statBoost.stamina);
    }

    const newEnergy = Math.max(0, Math.min(100, selectedMember.energy - program.energyCost));
    const newMorale = Math.min(100, selectedMember.morale + (program.moraleBoost || 4));

    const updated: BandMember = {
      ...selectedMember,
      skills: newSkills,
      energy: newEnergy,
      morale: newMorale
    };

    onUpdateMember(updated, program.cost);
    rockAudio.playPowerChord(98, 0.4);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleUpgradeGear = () => {
    const nextLevel = selectedMember.gearLevel + 1;
    const gearDef = GEAR_LEVELS.find(g => g.level === nextLevel);
    if (!gearDef || cash < gearDef.cost) return;

    const updated: BandMember = {
      ...selectedMember,
      gearLevel: nextLevel,
      morale: 100,
      skills: {
        ...selectedMember.skills,
        technique: Math.min(100, selectedMember.skills.technique + 4),
        stagePresence: Math.min(100, selectedMember.skills.stagePresence + 4)
      }
    };

    onUpdateMember(updated, gearDef.cost);
    rockAudio.playSoloRiff();
    confetti({ particleCount: 60, spread: 70 });
  };

  const nextGear = GEAR_LEVELS.find(g => g.level === selectedMember.gearLevel + 1);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">MIEMBROS DE LA BANDA & PROGRESIÓN DE HABILIDADES</h1>
            <p className="text-xs text-slate-400">Entrena técnica, presencia escénica y mejora el equipo instrumental de cada rockstar</p>
          </div>
        </div>
      </div>

      {/* Member Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {members.map((m) => {
          const isSelected = m.id === selectedMember.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMemberId(m.id);
                rockAudio.playPowerChord(82, 0.25);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 relative ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-400 shadow-lg shadow-purple-950/40 ring-1 ring-purple-400/50'
                  : 'bg-[#0f111a] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-rock text-lg text-amber-400 border border-white/10 shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="font-rock text-xs text-white truncate">{m.name}</div>
                <div className="text-[11px] text-purple-400 font-semibold">{m.role}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono-num">
                  <span>⚡ {m.energy}%</span>
                  <span>❤️ {m.morale}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Member Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Member Card & Gear */}
        <div className="flex flex-col gap-5">
          {/* Main Card */}
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-purple-400 tracking-wider">Ficha de Rockstar</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                {selectedMember.trait}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-red-500/20 border border-amber-400/30 flex items-center justify-center font-rock text-2xl text-amber-300">
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-rock text-lg text-white">{selectedMember.name}</h3>
                <p className="text-xs text-slate-400">{selectedMember.role} · Salario: <span className="text-emerald-400 font-mono-num font-bold">${selectedMember.salaryPerWeek}/sem</span></p>
              </div>
            </div>

            {/* Vital Bars */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" /> Energía
                  </span>
                  <span className="text-yellow-400 font-bold">{selectedMember.energy}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 transition-all" style={{ width: `${selectedMember.energy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" /> Moral del Músico
                  </span>
                  <span className="text-red-400 font-bold">{selectedMember.morale}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 transition-all" style={{ width: `${selectedMember.morale}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Instrument Gear Upgrade */}
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Equipo Instrumental</span>
              <span className="text-xs font-mono-num text-slate-400">Nivel {selectedMember.gearLevel}/5</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-rock text-xs text-white">
                  {GEAR_LEVELS.find(g => g.level === selectedMember.gearLevel)?.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono-num">
                  +{GEAR_LEVELS.find(g => g.level === selectedMember.gearLevel)?.boost} Puntos de Bonificación en Concierto
                </div>
              </div>
            </div>

            {nextGear ? (
              <button
                onClick={handleUpgradeGear}
                disabled={cash < nextGear.cost}
                className={`w-full py-3 rounded-xl font-rock text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                  cash < nextGear.cost
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 hover:brightness-110 shadow-lg cursor-pointer'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                Mejorar a {nextGear.name} (${nextGear.cost.toLocaleString()})
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center font-rock text-xs text-amber-300">
                ¡EQUIPO EN NIVEL MÁXIMO LEGENDARIO!
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Core Skills & Training Programs */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Core Skills Radar Breakdown */}
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-4">Habilidades Musicales (1 a 100)</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Técnica & Precisión', val: selectedMember.skills.technique, color: 'bg-amber-400' },
                { label: 'Creatividad & Riffs', val: selectedMember.skills.creativity, color: 'bg-purple-400' },
                { label: 'Presencia Escénica', val: selectedMember.skills.stagePresence, color: 'bg-red-400' },
                { label: 'Composición & Letras', val: selectedMember.skills.songwriting, color: 'bg-cyan-400' },
                { label: 'Resistencia (Stamina)', val: selectedMember.skills.stamina, color: 'bg-emerald-400' }
              ].map((skill) => (
                <div key={skill.label} className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono-num">
                    <span className="text-slate-300">{skill.label}</span>
                    <strong className="text-white text-sm">{skill.val}/100</strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div className={`h-full ${skill.color} rounded-full transition-all duration-300`} style={{ width: `${skill.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Activities Catalog */}
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Entrenamientos & Recuperación</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TRAINING_PROGRAMS.map((prog) => {
                const canAfford = cash >= prog.cost;
                const hasEnergy = prog.energyCost <= 0 || selectedMember.energy >= prog.energyCost;
                const isRest = prog.energyCost < 0;

                return (
                  <button
                    key={prog.id}
                    onClick={() => handleTrain(prog)}
                    disabled={!canAfford || !hasEnergy}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      !canAfford || !hasEnergy
                        ? 'bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed'
                        : isRest
                        ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400 cursor-pointer'
                        : 'bg-slate-900/80 border-white/10 hover:border-amber-400/50 cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-rock text-xs text-white">{prog.name}</span>
                        <span className={`text-xs font-mono-num font-bold ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
                          ${prog.cost}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{prog.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-num">
                      <span className={prog.energyCost > 0 ? 'text-red-400' : 'text-emerald-400'}>
                        {prog.energyCost > 0 ? `-${prog.energyCost} Energía` : `+45 Energía`}
                      </span>
                      <span className="text-amber-300 font-bold">
                        {isRest ? '+30 Moral' : '+3 a 4 Habilidad'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
