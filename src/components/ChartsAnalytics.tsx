import React, { useState } from 'react';
import { Song, Album, GameState } from '../types/game';
import { RIVAL_CHART_SONGS } from '../data/rockData';
import { 
  TrendingUp, 
  BarChart3, 
  Headphones, 
  DollarSign, 
  Flame, 
  Disc, 
  Radio, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Sparkles,
  PieChart,
  Trophy
} from 'lucide-react';

interface ChartsAnalyticsProps {
  bandName: string;
  discography: Song[];
  albums: Album[];
  weeklyHistory: GameState['weeklyHistory'];
  currentWeek: number;
  currentYear: number;
  cash: number;
  fans: number;
  hype: number;
}

export const ChartsAnalytics: React.FC<ChartsAnalyticsProps> = ({
  bandName,
  discography,
  albums,
  weeklyHistory,
  currentWeek,
  currentYear,
  cash,
  fans,
  hype
}) => {
  const [activeTab, setActiveTab] = useState<'charts' | 'streaming' | 'revenue'>('charts');

  // Build the Top 20 Global Rock Charts combining Player songs and Rival songs
  const playerChartSongs = discography.map(s => ({
    title: s.title,
    artist: bandName,
    genre: s.genre,
    streamsWeekly: s.streamsThisWeek > 0 ? s.streamsThisWeek : Math.max(12000, Math.floor(s.quality * (fans + 100) * 0.4)),
    isPlayer: true,
    quality: s.quality
  }));

  const allEntries = [
    ...playerChartSongs,
    ...RIVAL_CHART_SONGS.map(r => ({
      title: r.title,
      artist: r.artist,
      genre: r.genre,
      streamsWeekly: r.baseStreams,
      isPlayer: false,
      quality: 85
    }))
  ];

  // Sort by weekly streams descending
  allEntries.sort((a, b) => b.streamsWeekly - a.streamsWeekly);
  const top20 = allEntries.slice(0, 20);

  // Totals
  const totalStreams = discography.reduce((acc, s) => acc + s.streamsTotal, 0);
  const totalDigitalSales = discography.reduce((acc, s) => acc + s.digitalSales, 0);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-rock text-xl text-white tracking-wide">ANÁLISIS DE VENTAS EN TIEMPO REAL & CHARTS</h1>
            <p className="text-xs text-slate-400">Estadísticas en directo de streaming, ventas físicas, taquilla y ranking en el Top 50</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-2 rounded-lg text-xs font-rock uppercase tracking-wider transition-all ${
              activeTab === 'charts' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Billboard Top 20
          </button>
          <button
            onClick={() => setActiveTab('streaming')}
            className={`px-4 py-2 rounded-lg text-xs font-rock uppercase tracking-wider transition-all ${
              activeTab === 'streaming' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rockify Streams
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-lg text-xs font-rock uppercase tracking-wider transition-all ${
              activeTab === 'revenue' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Historial Financiero
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0f111a] border border-white/10 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
            <Headphones className="w-3.5 h-3.5 text-cyan-400" /> Streams Totales
          </div>
          <div className="text-xl font-mono-num font-bold text-cyan-400">
            {totalStreams.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono-num">
            En todas las plataformas
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f111a] border border-white/10 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
            <Disc className="w-3.5 h-3.5 text-amber-400" /> Ventas Digitales
          </div>
          <div className="text-xl font-mono-num font-bold text-amber-400">
            {totalDigitalSales.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono-num">
            Descargas directas y singles
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f111a] border border-white/10 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Hype Global
          </div>
          <div className="text-xl font-mono-num font-bold text-red-400">
            {hype}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono-num">
            Demanda en festivales y radios
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f111a] border border-white/10 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Nivel de Leyenda
          </div>
          <div className="text-base font-rock text-yellow-400 truncate">
            {fans > 100000 ? 'Dioses del Rock' : fans > 25000 ? 'Leyendas de Estadio' : fans > 5000 ? 'Banda Nacional' : 'Banda de Culto'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono-num">
            {fans.toLocaleString()} fans leales
          </div>
        </div>
      </div>

      {/* TAB 1: BILLBOARD TOP 20 CHART */}
      {activeTab === 'charts' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-rock text-lg text-white">BILLBOARD GLOBAL ROCK 20</h2>
              <p className="text-xs text-slate-400">Actualizado semanalmente según streams verificados y ventas</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono-num font-bold">
              Semana {currentWeek}, Año {currentYear}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {top20.map((item, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={`${item.title}-${item.artist}`}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    item.isPlayer
                      ? 'bg-amber-500/20 border-amber-400/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/50'
                      : 'bg-slate-900/70 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 font-rock text-lg text-center ${
                      rank === 1 ? 'text-yellow-400 text-xl' : rank <= 3 ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      #{rank}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-rock text-sm text-white">{item.title}</span>
                        {item.isPlayer && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-rock bg-amber-500 text-black">
                            ¡TU BANDA!
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.artist} · <span className="text-cyan-400 font-semibold">{item.genre}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono-num">
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        {item.streamsWeekly.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">reproducciones/sem</div>
                    </div>

                    <div className="w-6 text-center">
                      {rank === 1 ? (
                        <Trophy className="w-5 h-5 text-yellow-400 inline" />
                      ) : item.isPlayer ? (
                        <ArrowUp className="w-4 h-4 text-emerald-400 inline" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-600 inline" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STREAMING DRILLDOWN */}
      {activeTab === 'streaming' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="font-rock text-lg text-white mb-1">MÉTRICAS DETALLADAS DE STREAMING (ROCKIFY)</h2>
          <p className="text-xs text-slate-400 mb-6">Desempeño acumulado de cada pista grabada por {bandName}</p>

          {discography.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs">
              No tienes canciones grabadas todavía. Visita el Estudio de Composición para comenzar a generar streaming.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {discography.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono-num">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-rock text-sm text-white font-sans">{s.title}</h4>
                      <p className="text-xs text-slate-400">{s.genre} · Calidad: <strong className="text-amber-400">{s.quality} pts</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Semana Actual</div>
                      <div className="text-emerald-400 font-bold">{s.streamsThisWeek.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Total Histórico</div>
                      <div className="text-white font-bold">{s.streamsTotal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Regalías Acumuladas</div>
                      <div className="text-amber-400 font-bold">${Math.floor(s.streamsTotal * 0.004).toLocaleString()} USD</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REVENUE HISTORY */}
      {activeTab === 'revenue' && (
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="font-rock text-lg text-white mb-1">HISTORIAL FINANCIERO SEMANAL</h2>
          <p className="text-xs text-slate-400 mb-6">Desglose de ingresos por conciertos, streaming y salarios de la banda</p>

          {weeklyHistory.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs">
              Avanza unas semanas en el calendario para ver el balance financiero histórico.
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {weeklyHistory.slice().reverse().map((entry, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between text-xs font-mono-num">
                  <div className="text-slate-300 font-bold">
                    Semana {entry.week}, Año {entry.year}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400">Streaming: +${entry.streamingRevenue}</span>
                    <span className="text-cyan-400">Giras: +${entry.tourRevenue}</span>
                    <span className="text-amber-400">Merch: +${entry.merchRevenue}</span>
                    <span className="text-red-400">Gastos: -${entry.expenses}</span>
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
