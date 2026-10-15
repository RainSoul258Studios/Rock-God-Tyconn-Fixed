import React, { useState } from 'react';
import { Venue, BandMember, ActiveTour, TourStop } from '../types/game';
import { WORLD_VENUES } from '../data/rockData';
import { StageLive2D } from './StageLive2D';
import { 
  Globe, 
  MapPin, 
  Truck, 
  Ticket, 
  ShoppingBag, 
  Play, 
  Users, 
  DollarSign, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { rockAudio } from '../audio/rockAudio';

interface TourManagerProps {
  fans: number;
  cash: number;
  members: BandMember[];
  onFinishTourStop: (result: {
    ticketsSold: number;
    ticketRevenue: number;
    merchRevenue: number;
    venueCost: number;
    netProfit: number;
    hypeGained: number;
    fansGained: number;
    performanceRating: number;
  }) => void;
}

export const TourManager: React.FC<TourManagerProps> = ({
  fans,
  cash,
  members,
  onFinishTourStop
}) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue>(WORLD_VENUES[0]);
  const [ticketPrice, setTicketPrice] = useState<number>(WORLD_VENUES[0].ticketPriceDefault);
  const [isLiveConcertActive, setIsLiveConcertActive] = useState<boolean>(false);
  const [transportTier, setTransportTier] = useState<number>(1);
  const [tourName, setTourName] = useState<string>('World Destruction Tour');

  const canAffordVenue = cash >= selectedVenue.rentalCost;
  const hasEnoughFans = fans >= selectedVenue.minFansRequired;

  const handleSelectVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setTicketPrice(venue.ticketPriceDefault);
    rockAudio.playPowerChord(98, 0.3);
  };

  const handleStartConcert = () => {
    if (!canAffordVenue || !hasEnoughFans) return;
    setIsLiveConcertActive(true);
  };

  const handleConcertFinished = (result: {
    ticketsSold: number;
    ticketRevenue: number;
    merchRevenue: number;
    venueCost: number;
    netProfit: number;
    hypeGained: number;
    fansGained: number;
    performanceRating: number;
  }) => {
    setIsLiveConcertActive(false);
    onFinishTourStop(result);
  };

  if (isLiveConcertActive) {
    return (
      <div className="w-full">
        <StageLive2D
          venue={selectedVenue}
          members={members}
          ticketPrice={ticketPrice}
          onFinishConcert={handleConcertFinished}
          onCancel={() => setIsLiveConcertActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <Globe className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">GIRAS MUNDIALES & CONCIERTOS EN VIVO</h1>
            <p className="text-xs text-slate-400">Selecciona escenarios icónicos por el mundo, ajusta entradas y toca frente a miles de fans</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/10 text-xs">
          <Users className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Fans Totales de la Banda:</span>
          <span className="text-white font-mono-num font-bold text-sm">{fans.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Venue Selector Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Escenarios del Mundo Disponibles</span>
            <span className="text-xs text-slate-400">Desde antros de mala muerte hasta festivales legendarios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1">
            {WORLD_VENUES.map((v) => {
              const isSelected = selectedVenue.id === v.id;
              const meetsFans = fans >= v.minFansRequired;
              const canPay = cash >= v.rentalCost;

              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectVenue(v)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-xl shadow-amber-950/40 ring-1 ring-amber-400/50'
                      : meetsFans
                      ? 'bg-[#0f111a] border-white/10 hover:border-white/20'
                      : 'bg-[#0a0b10] border-white/5 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{v.flag}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        v.stageType === 'Festival' ? 'bg-red-500/20 text-red-300' :
                        v.stageType === 'Stadium' ? 'bg-purple-500/20 text-purple-300' :
                        v.stageType === 'Arena' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {v.stageType}
                      </span>
                    </div>

                    <h3 className="font-rock text-sm text-white mb-0.5">{v.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{v.city}, {v.country}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono-num">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Capacidad</div>
                      <div className="text-white font-bold">{v.capacity.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Alquiler</div>
                      <div className={canPay ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>
                        ${v.rentalCost.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Fans Requeridos</div>
                      <div className={meetsFans ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                        {v.minFansRequired.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Tour Configuration & Launch Console */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Configuración del Concierto</span>

            {/* Selected Venue Summary */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
              <span className="text-3xl">{selectedVenue.flag}</span>
              <div>
                <h4 className="font-rock text-white text-sm">{selectedVenue.name}</h4>
                <p className="text-xs text-slate-400">{selectedVenue.city} · {selectedVenue.capacity.toLocaleString()} plazas</p>
              </div>
            </div>

            {/* Ticket Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400 uppercase font-semibold">Precio de Entrada</span>
                <span className="text-emerald-400 font-mono-num font-bold text-base">${ticketPrice} USD</span>
              </div>
              <input
                type="range"
                min={5}
                max={Math.max(150, selectedVenue.ticketPriceDefault * 2)}
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono-num">
                <span>Económica ($5)</span>
                <span>Sugerido (${selectedVenue.ticketPriceDefault})</span>
                <span>VIP Premium</span>
              </div>
            </div>

            {/* Projected Gross Revenue */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2 font-mono-num text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Alquiler del Recinto:</span>
                <span className="text-red-400 font-bold">-${selectedVenue.rentalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ingreso Máx. Taquilla:</span>
                <span className="text-emerald-400 font-bold">+${(selectedVenue.capacity * ticketPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimado Merchandising:</span>
                <span className="text-cyan-400 font-bold">+${Math.floor(selectedVenue.capacity * 0.3 * 18).toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between text-white font-bold">
                <span>Ganancia Neta Estimada:</span>
                <span className="text-amber-400 text-sm">
                  ${Math.max(0, (selectedVenue.capacity * ticketPrice) + Math.floor(selectedVenue.capacity * 0.3 * 18) - selectedVenue.rentalCost).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Warnings if cannot afford or lacks fans */}
            {!hasEnoughFans && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>Tu banda no tiene suficientes fanáticos ({fans.toLocaleString()}/{selectedVenue.minFansRequired.toLocaleString()}) para llenar este recinto. Toca en locales más pequeños primero.</span>
              </div>
            )}

            {!canAffordVenue && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>Fondos insuficientes para pagar el depósito de alquiler de este recinto (${cash.toLocaleString()}/${selectedVenue.rentalCost.toLocaleString()}).</span>
              </div>
            )}

            {/* Launch Concert CTA */}
            <button
              onClick={handleStartConcert}
              disabled={!canAffordVenue || !hasEnoughFans}
              className={`w-full py-4 rounded-xl font-rock text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${
                !canAffordVenue || !hasEnoughFans
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black border-amber-300 hover:brightness-110 shadow-xl shadow-amber-950/50 active:scale-98 cursor-pointer'
              }`}
            >
              <Play className="w-4 h-4 fill-black" />
              ¡SUBIR AL ESCENARIO 2D!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
