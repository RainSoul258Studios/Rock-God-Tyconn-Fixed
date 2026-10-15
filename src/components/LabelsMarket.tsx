import React from 'react';
import { RecordLabel, ActiveContract } from '../types/game';
import { RECORD_LABELS } from '../data/rockData';
import { rockAudio } from '../audio/rockAudio';
import { 
  Building2, 
  FileCheck, 
  DollarSign, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Unlock,
  Radio,
  FileSignature
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LabelsMarketProps {
  fans: number;
  cash: number;
  currentContract: ActiveContract | null;
  onSignContract: (label: RecordLabel) => void;
  onBuyoutContract: (cost: number) => void;
}

export const LabelsMarket: React.FC<LabelsMarketProps> = ({
  fans,
  cash,
  currentContract,
  onSignContract,
  onBuyoutContract
}) => {
  const handleSign = (label: RecordLabel) => {
    if (currentContract) return;
    if (fans < label.minFansRequired) return;

    onSignContract(label);
    rockAudio.playCashSound();
    confetti({ particleCount: 70, spread: 80 });
  };

  const handleBuyout = () => {
    if (!currentContract) return;
    const buyoutCost = currentContract.penaltyFee;
    if (cash < buyoutCost) return;

    onBuyoutContract(buyoutCost);
    rockAudio.playPowerChord(82, 0.7);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <Building2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">SELLOS DISCOGRÁFICOS & CONTRATOS</h1>
            <p className="text-xs text-slate-400">Negocia adelantos millonarios, porcentajes de regalías y distribución global</p>
          </div>
        </div>
      </div>

      {/* Current Contract Status Banner */}
      {currentContract ? (
        <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Contrato Exclusivo Vigente</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 text-xs font-mono-num font-bold">
                  {currentContract.labelName}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Regalías del Artista: <strong className="text-amber-400 font-mono-num font-bold">{(currentContract.royaltyRate * 100).toFixed(0)}%</strong> · 
                Álbumes pendientes de entrega: <strong className="text-white font-mono-num font-bold">{currentContract.albumsRemaining}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBuyout}
              disabled={cash < currentContract.penaltyFee}
              className={`px-4 py-2.5 rounded-xl text-xs font-rock uppercase tracking-wider border transition-all ${
                cash < currentContract.penaltyFee
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-red-950/60 text-red-200 border-red-500/50 hover:bg-red-900/80 cursor-pointer'
              }`}
            >
              Comprar Libertad / Rescindir (${currentContract.penaltyFee.toLocaleString()})
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Unlock className="w-5 h-5 text-emerald-400" />
            <span className="text-xs text-emerald-300 font-semibold">
              ¡Banda Independiente! Eres 100% dueño de tus regalías, o puedes firmar con una gran discográfica para recibir un adelanto masivo.
            </span>
          </div>
        </div>
      )}

      {/* Record Labels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {RECORD_LABELS.map((label) => {
          const meetsFans = fans >= label.minFansRequired;
          const isCurrentSigned = currentContract?.labelId === label.id;

          return (
            <div
              key={label.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isCurrentSigned
                  ? 'bg-blue-950/30 border-blue-400 shadow-xl ring-1 ring-blue-400'
                  : meetsFans
                  ? 'bg-[#0f111a] border-white/10 hover:border-amber-400/40'
                  : 'bg-[#0a0b10] border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: label.logoColor }}
                    />
                    <h3 className="font-rock text-base text-white">{label.name}</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    Nivel {label.tier}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">{label.description}</p>

                {/* Contract Perks Breakdown */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/80 border border-white/5 mb-4 text-xs font-mono-num">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Adelanto en Efectivo</div>
                    <div className="text-emerald-400 font-bold text-sm">+${label.advanceOffer.toLocaleString()} USD</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Tus Regalías</div>
                    <div className="text-amber-400 font-bold text-sm">{(label.royaltyRate * 100).toFixed(0)}% por tema</div>
                  </div>
                  <div className="mt-1">
                    <div className="text-[10px] text-slate-500 uppercase">Compromiso</div>
                    <div className="text-white font-bold">{label.albumCommitment} Álbum(es)</div>
                  </div>
                  <div className="mt-1">
                    <div className="text-[10px] text-slate-500 uppercase">Poder de Promoción</div>
                    <div className="text-cyan-400 font-bold">{label.marketingPower}/100 Radios</div>
                  </div>
                </div>

                <div className="text-[11px] text-purple-300 flex items-center gap-1.5 mb-4">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Bono de Equipo: <strong>{label.signingBonusGear}</strong></span>
                </div>
              </div>

              <div>
                {!meetsFans ? (
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-500 font-mono-num">
                    Requiere {label.minFansRequired.toLocaleString()} Fans (Tienes {fans.toLocaleString()})
                  </div>
                ) : isCurrentSigned ? (
                  <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-center text-xs text-blue-300 font-rock uppercase tracking-wider">
                    Contrato Firmado
                  </div>
                ) : (
                  <button
                    onClick={() => handleSign(label)}
                    disabled={Boolean(currentContract)}
                    className={`w-full py-3 rounded-xl font-rock text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                      currentContract
                        ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/50 hover:brightness-110 shadow-lg cursor-pointer'
                    }`}
                  >
                    <FileSignature className="w-4 h-4" />
                    Firmar Contrato y Cobrar Adelanto
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
