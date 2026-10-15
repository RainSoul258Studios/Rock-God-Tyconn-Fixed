import React from 'react';
import { RockEvent } from '../types/game';
import { rockAudio } from '../audio/rockAudio';
import { Sparkles, AlertOctagon } from 'lucide-react';

interface EventModalProps {
  event: RockEvent;
  onChooseOption: (optionIndex: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChooseOption }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1018] border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="text-3xl p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            {event.icon}
          </span>
          <div>
            <div className="text-[10px] text-amber-400 uppercase font-rock tracking-wider">¡Dilema de la Vida Rockstar!</div>
            <h2 className="font-rock text-lg text-white">{event.title}</h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {event.description}
        </p>

        <div className="flex flex-col gap-3 mt-2">
          {event.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                rockAudio.playPowerChord(98, 0.4);
                onChooseOption(i);
              }}
              className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-amber-400 text-left transition-all hover:bg-slate-800/80 group cursor-pointer"
            >
              <div className="font-rock text-xs text-amber-300 group-hover:text-amber-200 mb-1">
                Opción {i + 1}: {opt.text}
              </div>
              <div className="text-[11px] text-slate-400">
                {opt.outcomeText}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
