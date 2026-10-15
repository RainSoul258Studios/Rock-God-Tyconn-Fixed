import React, { useEffect, useRef, useState } from 'react';
import { BandMember, Venue } from '../types/game';
import { rockAudio } from '../audio/rockAudio';
import { Zap, Flame, Volume2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StageLive2DProps {
  venue: Venue;
  members: BandMember[];
  ticketPrice: number;
  onFinishConcert: (result: {
    ticketsSold: number;
    ticketRevenue: number;
    merchRevenue: number;
    venueCost: number;
    netProfit: number;
    hypeGained: number;
    fansGained: number;
    performanceRating: number;
  }) => void;
  onCancel?: () => void;
}

export const StageLive2D: React.FC<StageLive2DProps> = ({
  venue,
  members,
  ticketPrice,
  onFinishConcert,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Concert simulation state
  const [songProgress, setSongProgress] = useState<number>(0);
  const [crowdHype, setCrowdHype] = useState<number>(65);
  const [isPyroActive, setIsPyroActive] = useState<boolean>(false);
  const [pyroCooldown, setPyroCooldown] = useState<number>(0);
  const [soloActive, setSoloActive] = useState<boolean>(false);
  const [soloMultiplier, setSoloMultiplier] = useState<number>(1);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [isEncoreRequested, setIsEncoreRequested] = useState<boolean>(false);

  // Live real-time stats
  const [liveTickets, setLiveTickets] = useState<number>(0);
  const [liveMerch, setLiveMerch] = useState<number>(0);

  // Calculate projected concert capacity and attendance
  const maxPossible = Math.min(venue.capacity, Math.floor(venue.capacity * 0.95 + Math.random() * (venue.capacity * 0.05)));

  // Animation frame loop for 2D stage
  useEffect(() => {
    let animId: number;
    let tick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Play initial crowd roar & opening chord
    rockAudio.playCrowdCheer(0.8);
    rockAudio.playPowerChord(82.41, 1.2);

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear stage
      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, w, h);

      // 1. Stage Background - Amp Stacks & Truss
      ctx.fillStyle = '#11131a';
      ctx.fillRect(40, h - 220, 100, 150); // Left Amp Stack
      ctx.fillRect(w - 140, h - 220, 100, 150); // Right Amp Stack
      
      // Amp Grilles & Speaker cones
      ctx.fillStyle = '#1c1f2e';
      ctx.fillRect(46, h - 210, 88, 60);
      ctx.fillRect(46, h - 140, 88, 60);
      ctx.fillRect(w - 134, h - 210, 88, 60);
      ctx.fillRect(w - 134, h - 140, 88, 60);

      // Amp LED indicator
      ctx.fillStyle = tick % 30 > 15 ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(52, h - 215, 3, 0, Math.PI * 2);
      ctx.arc(w - 128, h - 215, 3, 0, Math.PI * 2);
      ctx.fill();

      // Drum Riser platform
      const riserY = h - 160;
      ctx.fillStyle = '#1e2233';
      ctx.fillRect(w / 2 - 80, riserY, 160, 90);
      ctx.fillStyle = '#2d334d';
      ctx.fillRect(w / 2 - 80, riserY, 160, 8);

      // 2. Dynamic Moving Spotlights
      const colors = ['rgba(245, 158, 11, ', 'rgba(6, 182, 212, ', 'rgba(239, 68, 68, ', 'rgba(168, 85, 247, '];
      for (let i = 0; i < 4; i++) {
        const angle = Math.sin(tick * 0.03 + i * 1.5) * 0.45;
        const originX = (w / 5) * (i + 1);
        ctx.save();
        ctx.translate(originX, 0);
        ctx.rotate(angle);

        const spotGradient = ctx.createLinearGradient(0, 0, 0, h);
        spotGradient.addColorStop(0, colors[i % colors.length] + '0.7)');
        spotGradient.addColorStop(1, colors[i % colors.length] + '0.0)');

        ctx.fillStyle = spotGradient;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(75, h);
        ctx.lineTo(-75, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 3. Pyrotechnics Jets when active
      if (isPyroActive) {
        const pyroLocations = [110, w / 2 - 110, w / 2 + 110, w - 110];
        pyroLocations.forEach(px => {
          const flameH = 140 + Math.random() * 60;
          const flameGrad = ctx.createLinearGradient(px, h - 80, px, h - 80 - flameH);
          flameGrad.addColorStop(0, '#ffffff');
          flameGrad.addColorStop(0.3, '#f59e0b');
          flameGrad.addColorStop(0.8, '#ef4444');
          flameGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(px - 14, h - 80);
          ctx.lineTo(px + 14, h - 80);
          ctx.lineTo(px + (Math.random() * 10 - 5), h - 80 - flameH);
          ctx.closePath();
          ctx.fill();

          // Spark particles
          for (let s = 0; s < 6; s++) {
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(
              px + (Math.random() * 40 - 20),
              h - 80 - Math.random() * flameH,
              3,
              3
            );
          }
        });
      }

      // 4. Band Sprites on Stage
      const bounce = Math.sin(tick * 0.18) * 4;
      const headbang = Math.sin(tick * 0.25) * 8;

      // Drummer & Drum Kit (Center Riser)
      ctx.fillStyle = '#64748b'; // Cymbals
      ctx.beginPath();
      ctx.ellipse(w / 2 - 40, riserY - 20, 22, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(w / 2 + 40, riserY - 20, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bass drum
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(w / 2, riserY + 30, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Drummer Body
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(w / 2 - 12, riserY - 45 + bounce * 0.5, 24, 30);
      // Drummer Head
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(w / 2, riserY - 55 + bounce * 0.5, 9, 0, Math.PI * 2);
      ctx.fill();

      // Bassist (Left Mid)
      const bassX = w / 2 - 120;
      const bassY = h - 90;
      ctx.fillStyle = '#334155';
      ctx.fillRect(bassX - 10, bassY - 55 + bounce, 20, 42); // Torso
      ctx.fillStyle = '#fdba74';
      ctx.beginPath();
      ctx.arc(bassX, bassY - 65 + bounce, 9, 0, Math.PI * 2); // Head
      ctx.fill();
      // Bass Guitar
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(bassX - 8, bassY - 35 + bounce, 36, 10);
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(bassX + 28, bassY - 30 + bounce);
      ctx.lineTo(bassX + 60, bassY - 55 + bounce);
      ctx.stroke();

      // Lead Guitarist (Right Mid)
      const guitarX = w / 2 + 120;
      const guitarY = h - 90;
      ctx.fillStyle = '#1e1e24';
      ctx.fillRect(guitarX - 10, guitarY - 55 + (soloActive ? bounce * 1.8 : bounce), 20, 42);
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(guitarX, guitarY - 65 + headbang, 9, 0, Math.PI * 2);
      ctx.fill();
      // Bandana
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(guitarX - 9, guitarY - 72 + headbang, 18, 4);
      // Red Electric Guitar (Flying V shape)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(guitarX - 12, guitarY - 32 + bounce);
      ctx.lineTo(guitarX + 22, guitarY - 45 + bounce);
      ctx.lineTo(guitarX + 18, guitarY - 20 + bounce);
      ctx.closePath();
      ctx.fill();
      // Guitar neck
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(guitarX + 12, guitarY - 38 + bounce);
      ctx.lineTo(guitarX + 45, guitarY - 65 + bounce);
      ctx.stroke();

      // Lead Vocalist (Center Front)
      const vocX = w / 2;
      const vocY = h - 85;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(vocX - 12, vocY - 60 + bounce, 24, 46); // Jacket
      ctx.fillStyle = '#fde047'; // Blonde/Wild Hair
      ctx.beginPath();
      ctx.arc(vocX, vocY - 72 + bounce * 0.8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fecaca';
      ctx.beginPath();
      ctx.arc(vocX, vocY - 70 + bounce * 0.8, 9, 0, Math.PI * 2);
      ctx.fill();
      // Mic Stand
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vocX + 15, vocY - 10);
      ctx.lineTo(vocX + 8, vocY - 65 + bounce * 0.8);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(vocX + 8, vocY - 65 + bounce * 0.8, 4, 0, Math.PI * 2);
      ctx.fill();

      // 5. Crowd Silhouettes in Foreground (Bouncing & Waving)
      const crowdY = h - 40;
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, crowdY, w, 40);

      const crowdCount = Math.min(45, Math.floor(w / 18));
      for (let c = 0; c < crowdCount; c++) {
        const cx = (w / crowdCount) * c + 8;
        const cBounce = Math.sin(tick * 0.2 + c * 0.8) * 8;
        // Head
        ctx.fillStyle = '#07080f';
        ctx.beginPath();
        ctx.arc(cx, crowdY - 8 + cBounce, 8, 0, Math.PI * 2);
        ctx.fill();
        // Arms / Horns 🤘 up every few fans
        if (c % 3 === 0) {
          ctx.strokeStyle = '#07080f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, crowdY + cBounce);
          ctx.lineTo(cx + (c % 2 === 0 ? 8 : -8), crowdY - 24 + cBounce);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Audio beat loop & ticks
    const beatInterval = setInterval(() => {
      rockAudio.playKick();
      setTimeout(() => rockAudio.playSnare(), 250);
      
      setSongProgress(prev => {
        const next = prev + 1.8;
        if (next >= 100) {
          clearInterval(beatInterval);
          return 100;
        }
        return next;
      });

      // Gradually fill the live ticket and merch counters
      setLiveTickets(prev => Math.min(maxPossible, Math.floor(prev + maxPossible * 0.025)));
      setLiveMerch(prev => Math.floor(prev + (venue.capacity * 0.25) * (ticketPrice * 0.08)));
      
      // Dynamic hype fluctuation
      setCrowdHype(prev => Math.min(100, Math.max(20, prev + (Math.random() * 4 - 1.8))));
    }, 500);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(beatInterval);
    };
  }, [venue, maxPossible, ticketPrice, isPyroActive, soloActive]);

  // Handle Pyro Blast
  const triggerPyro = () => {
    if (pyroCooldown > 0) return;
    setIsPyroActive(true);
    setScreenShake(true);
    rockAudio.playPyro();
    rockAudio.playCrowdCheer(1.0);
    setCrowdHype(prev => Math.min(100, prev + 12));
    setPyroCooldown(5);

    setTimeout(() => {
      setIsPyroActive(false);
      setScreenShake(false);
    }, 1200);

    const timer = setInterval(() => {
      setPyroCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Interactive Solo
  const triggerGuitarSolo = () => {
    if (soloActive) return;
    setSoloActive(true);
    setSoloMultiplier(1.5);
    rockAudio.playSoloRiff();
    setCrowdHype(prev => Math.min(100, prev + 15));

    setTimeout(() => {
      setSoloActive(false);
      setSoloMultiplier(1.0);
    }, 2800);
  };

  // Finish Concert and tally earnings
  const finishShow = () => {
    const finalTickets = Math.max(liveTickets, Math.floor(maxPossible * 0.85));
    const ticketRev = finalTickets * ticketPrice;
    const merchRev = Math.floor(finalTickets * 18 * soloMultiplier);
    const netProf = ticketRev + merchRev - venue.rentalCost;
    const finalHype = Math.round(crowdHype);
    const fansGained = Math.floor(finalTickets * (crowdHype / 100) * 0.45);
    const perfRating = Math.min(100, Math.round((crowdHype + (soloMultiplier > 1 ? 20 : 0) + (isEncoreRequested ? 10 : 0)) * 0.9));

    // Celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onFinishConcert({
      ticketsSold: finalTickets,
      ticketRevenue: ticketRev,
      merchRevenue: merchRev,
      venueCost: venue.rentalCost,
      netProfit: netProf,
      hypeGained: Math.floor(finalHype * 0.3),
      fansGained,
      performanceRating: perfRating
    });
  };

  return (
    <div className={`relative w-full h-full min-h-[580px] flex flex-col bg-[#07080d] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl transition-transform ${screenShake ? 'scale-[1.01] translate-y-[-2px]' : ''}`}>
      {/* Concert Perimeter Status Cluster */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#0a0c14]/95 via-[#0a0c14]/80 to-transparent p-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{venue.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-rock text-lg text-amber-400 tracking-wide uppercase">{venue.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-num font-semibold">
                {venue.city}, {venue.country}
              </span>
            </div>
            <p className="text-xs text-slate-400">Capacidad: <span className="text-white font-mono-num font-bold">{venue.capacity.toLocaleString()}</span> personas</p>
          </div>
        </div>

        {/* Live Attendance & Box Office */}
        <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Entradas Vendidas</div>
            <div className="text-sm font-mono-num font-bold text-emerald-400">
              {liveTickets.toLocaleString()} / {venue.capacity.toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Taquilla Actual</div>
            <div className="text-sm font-mono-num font-bold text-amber-300">
              ${(liveTickets * ticketPrice).toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Merchandising</div>
            <div className="text-sm font-mono-num font-bold text-cyan-400">
              ${liveMerch.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Hype Level Meter */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-red-500/20">
          <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          <div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>Hype del Público</span>
              <span className="text-red-400 font-mono-num">{Math.round(crowdHype)}%</span>
            </div>
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, crowdHype)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2D Canvas Playfield */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          className="w-full h-full object-cover"
        />

        {/* Visual feedback badges when actions triggered */}
        {soloActive && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-600/90 text-white font-rock px-6 py-2 rounded-xl border border-amber-400 text-lg uppercase shadow-xl animate-bounce tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            ¡SOLO DE GUITARRA ÉPICO! (+50% HYPE)
          </div>
        )}

        {isPyroActive && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-amber-500/90 text-black font-rock px-6 py-1.5 rounded-lg border border-white text-md uppercase shadow-2xl tracking-widest flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-700 fill-red-700" />
            ¡FUEGOS PIROTÉCNICOS ACTIVADOS!
          </div>
        )}
      </div>

      {/* Bottom Live Control Console */}
      <div className="z-20 bg-[#0c0d16] border-t border-amber-500/20 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Progress bar */}
        <div className="w-full md:w-1/3">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono-num">
            <span>Progreso del Concierto</span>
            <span className="text-amber-400 font-bold">{Math.round(songProgress)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${songProgress}%` }}
            />
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerPyro}
            disabled={pyroCooldown > 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-rock text-xs uppercase tracking-wider border transition-all ${
              pyroCooldown > 0
                ? 'bg-slate-800/60 text-slate-500 border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-amber-400/50 hover:brightness-110 shadow-lg shadow-red-950/50 active:scale-95'
            }`}
          >
            <Flame className="w-4 h-4 fill-amber-300" />
            {pyroCooldown > 0 ? `Pirotecnia (${pyroCooldown}s)` : '¡Ráfaga Pirotécnica!'}
          </button>

          <button
            onClick={triggerGuitarSolo}
            disabled={soloActive}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-rock text-xs uppercase tracking-wider border transition-all ${
              soloActive
                ? 'bg-red-800 text-amber-200 border-amber-400 animate-pulse'
                : 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-extrabold border-amber-300 hover:brightness-110 shadow-lg shadow-amber-950/50 active:scale-95'
            }`}
          >
            <Zap className="w-4 h-4 fill-black" />
            {soloActive ? 'Riffeando...' : 'Solo de Guitarra'}
          </button>

          <button
            onClick={() => {
              rockAudio.playCrowdCheer(0.9);
              setIsEncoreRequested(true);
              setCrowdHype(prev => Math.min(100, prev + 10));
            }}
            disabled={isEncoreRequested}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-purple-900/40 text-purple-200 border border-purple-500/40 hover:bg-purple-900/60 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            {isEncoreRequested ? '¡Otra! Pedida' : 'Pedir ¡Otra! (Encore)'}
          </button>
        </div>

        {/* Finish Show / Abort button */}
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            onClick={finishShow}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-rock text-xs uppercase tracking-wider border border-emerald-400/50 hover:brightness-110 shadow-lg shadow-emerald-950/50 active:scale-95 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Finalizar Concierto
          </button>
        </div>
      </div>
    </div>
  );
};
