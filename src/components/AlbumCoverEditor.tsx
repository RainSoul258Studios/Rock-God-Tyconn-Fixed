import React, { useState } from 'react';
import { AlbumCoverConfig } from '../types/game';
import { Sparkles, Palette, Shield, Image as ImageIcon, Flame } from 'lucide-react';

interface AlbumCoverEditorProps {
  albumTitle: string;
  bandName: string;
  config: AlbumCoverConfig;
  onChangeConfig: (newConfig: AlbumCoverConfig) => void;
}

export const AlbumCoverEditor: React.FC<AlbumCoverEditorProps> = ({
  albumTitle,
  bandName,
  config,
  onChangeConfig
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-2xl border border-white/10">
      {/* Live Album Cover Art Preview */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 select-none group">
          {/* Background Textures */}
          {config.background === 'vinyl' && (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-neutral-800 to-black flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center animate-spin [animation-duration:14s]">
                <div className="w-24 h-24 rounded-full bg-red-600/40 border border-white/20" />
              </div>
            </div>
          )}

          {config.background === 'skull' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-slate-900 to-black flex items-center justify-center">
              <span className="text-8xl opacity-75 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">💀</span>
            </div>
          )}

          {config.background === 'cosmic' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-purple-900 to-slate-950 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-cyan-500/20 blur-2xl" />
              <span className="text-7xl opacity-80 filter drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">🌌</span>
            </div>
          )}

          {config.background === 'lightning' && (
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-900 to-black flex items-center justify-center">
              <span className="text-8xl opacity-85 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">⚡</span>
            </div>
          )}

          {config.background === 'fire' && (
            <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-orange-950 to-black flex items-center justify-center">
              <span className="text-8xl opacity-85 filter drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">🔥</span>
            </div>
          )}

          {config.background === 'graffiti' && (
            <div className="absolute inset-0 bg-gradient-to-br from-pink-950 via-slate-900 to-teal-950 flex items-center justify-center">
              <span className="text-8xl opacity-75 filter drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]">🎸</span>
            </div>
          )}

          {/* Color Filter Overlays */}
          {config.filter === 'vintage' && <div className="absolute inset-0 bg-amber-900/25 mix-blend-color-burn pointer-events-none" />}
          {config.filter === 'neon' && <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay pointer-events-none" />}
          {config.filter === 'monochrome' && <div className="absolute inset-0 backdrop-grayscale mix-blend-color pointer-events-none" />}

          {/* Vinyl Ring Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

          {/* Band Name on Top */}
          <div className="absolute top-4 left-4 right-4 text-center z-10">
            <span
              className="font-rock text-xs md:text-sm tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              style={{ color: config.textColor }}
            >
              {bandName}
            </span>
          </div>

          {/* Album Title on Bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-center z-10">
            <h3
              className="font-marker text-base md:text-lg tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] line-clamp-1"
              style={{ color: config.textColor }}
            >
              {albumTitle || 'Nuevo Álbum'}
            </h3>
          </div>

          {/* Badges */}
          {config.badge === 'parental' && (
            <div className="absolute bottom-2 right-2 bg-black/90 border border-white px-2 py-0.5 rounded text-[8px] font-mono-num font-bold text-white tracking-tighter">
              PARENTAL ADVISORY
            </div>
          )}
          {config.badge === 'gold' && (
            <div className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-0.5 rounded text-[8px] font-rock tracking-wider shadow-lg">
              ★ GOLD EDITION
            </div>
          )}
          {config.badge === 'explicit' && (
            <div className="absolute bottom-2 left-2 bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-rock tracking-wider">
              EXPLICIT ROCK
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-400 mt-2 font-mono-num">Vista Previa de la Portada Oficial</span>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1.5">
            Fondo & Temática Gráfica
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'vinyl' as const, label: 'Vinilo Clásico' },
              { id: 'skull' as const, label: 'Calavera & Sombras' },
              { id: 'cosmic' as const, label: 'Nebulosa Cósmica' },
              { id: 'lightning' as const, label: 'Rayo Eléctrico' },
              { id: 'fire' as const, label: 'Infierno en Llamas' },
              { id: 'graffiti' as const, label: 'Graffiti Punk' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => onChangeConfig({ ...config, background: b.id })}
                className={`py-2 px-2 text-[11px] rounded-xl border text-center font-rock transition-all ${
                  config.background === b.id
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1.5">
            Filtro de Color
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'raw' as const, label: 'Crudo' },
              { id: 'vintage' as const, label: 'Vintage 70s' },
              { id: 'neon' as const, label: 'Cyber Neon' },
              { id: 'monochrome' as const, label: 'B & N' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => onChangeConfig({ ...config, filter: f.id })}
                className={`py-1.5 text-[10px] rounded-lg border font-semibold ${
                  config.filter === f.id
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-900 text-slate-400 border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1.5">
            Sello / Insignia de Portada
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'none' as const, label: 'Ninguno' },
              { id: 'parental' as const, label: 'Parental' },
              { id: 'gold' as const, label: 'Gold Ed.' },
              { id: 'explicit' as const, label: 'Explicit' }
            ].map(bdg => (
              <button
                key={bdg.id}
                onClick={() => onChangeConfig({ ...config, badge: bdg.id })}
                className={`py-1.5 text-[10px] rounded-lg border font-semibold ${
                  config.badge === bdg.id
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-900 text-slate-400 border-white/5'
                }`}
              >
                {bdg.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 uppercase font-bold block mb-1.5">
            Color de Tipografía
          </label>
          <div className="flex items-center gap-2">
            {['#f59e0b', '#ffffff', '#ef4444', '#06b6d4', '#ec4899', '#a855f7'].map(c => (
              <button
                key={c}
                onClick={() => onChangeConfig({ ...config, textColor: c })}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  config.textColor === c ? 'scale-125 border-white' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
