import React, { useState, useEffect, useRef } from 'react';
import { 
  GameState, 
  MusicGenre, 
  BandMember, 
  Song, 
  Album, 
  MusicVideo,
  RecordLabel, 
  ActiveContract, 
  Web3Transaction 
} from './types/game';
import { INITIAL_MEMBERS, RANDOM_ROCK_EVENTS } from './data/rockData';
import { rockAudio } from './audio/rockAudio';
import { TitleScreen } from './components/TitleScreen';
import { HeaderNav, ActiveView } from './components/HeaderNav';
import { TourManager } from './components/TourManager';
import { SongStudio } from './components/SongStudio';
import { MusicVideoStudio } from './components/MusicVideoStudio';
import { HQManager } from './components/HQManager';
import { BandRoster } from './components/BandRoster';
import { LabelsMarket } from './components/LabelsMarket';
import { ChartsAnalytics } from './components/ChartsAnalytics';
import { Web3CashoutModal } from './components/Web3CashoutModal';
import { EventModal } from './components/EventModal';
import { ManualModal } from './components/ManualModal';

const DEFAULT_STATE: GameState = {
  bandName: 'Thunder Riot',
  genre: 'Hard Rock',
  members: INITIAL_MEMBERS,
  formedWeek: 1,
  bandChemistry: 80,
  hqTier: 1,
  cash: 1400,
  fans: 180,
  fameLevel: 1,
  hype: 50,
  currentWeek: 1,
  currentYear: 1,
  gameSpeed: 1,
  discography: [],
  albums: [],
  musicVideos: [],
  songMastery: {},
  contract: null,
  currentTour: null,
  unlockedVenues: ['venue_garage_dive'],
  weeklyHistory: [],
  web3Connected: false,
  walletAddress: '',
  walletNetwork: 'Polygon',
  withdrawnUSDC: 0,
  withdrawnUSDT: 0,
  withdrawalHistory: [],
  pendingEvent: null,
  lastEventWeek: 1
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('rgt_saved_game');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch {
      // fallback
    }
    return DEFAULT_STATE;
  });

  const [inGame, setInGame] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('tour');
  const [isWeb3ModalOpen, setIsWeb3ModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Save to localStorage on state changes
  useEffect(() => {
    if (inGame) {
      try {
        localStorage.setItem('rgt_saved_game', JSON.stringify(gameState));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
    }
  }, [gameState, inGame]);

  // Main Simulation Clock Loop (Weekly Progression)
  useEffect(() => {
    if (!inGame || gameState.gameSpeed === 0) return;

    // Time intervals: 1x = 3500ms, 2x = 1800ms, 5x = 750ms
    const intervalMs = gameState.gameSpeed === 5 ? 750 : gameState.gameSpeed === 2 ? 1800 : 3500;

    const timer = setInterval(() => {
      setGameState(prev => {
        const nextWeek = prev.currentWeek + 1;
        const nextYear = nextWeek > 52 ? prev.currentYear + 1 : prev.currentYear;
        const normalizedWeek = nextWeek > 52 ? 1 : nextWeek;

        // 1. Calculate Streaming Royalties from discography and video rotation
        let weeklyStreamingIncome = 0;
        let videoViewsWeeklyTotal = 0;

        const updatedVideos = prev.musicVideos.map(v => {
          const viewsAdded = Math.floor(v.weeklyViews * (prev.hype / 50) + Math.random() * 200);
          videoViewsWeeklyTotal += viewsAdded;
          return {
            ...v,
            viewsTotal: v.viewsTotal + viewsAdded
          };
        });

        const updatedDiscography = prev.discography.map(song => {
          // Streams formula: quality * (fans + 200) * (hype/50) + bonus from video views
          const songHasVideo = prev.musicVideos.some(v => v.songId === song.id);
          const videoBoost = songHasVideo ? 1.6 : 1.0;
          const newPlays = Math.floor(
            (song.quality * (prev.fans + 300) * 0.15) * (prev.hype / 60) * videoBoost + Math.random() * 50
          );
          const royaltyPerStream = prev.contract ? 0.0035 * prev.contract.royaltyRate : 0.0035;
          const songRev = Math.floor(newPlays * royaltyPerStream);
          weeklyStreamingIncome += songRev;

          return {
            ...song,
            streamsTotal: song.streamsTotal + newPlays,
            streamsThisWeek: newPlays
          };
        });

        // 2. Member Salaries & HQ Rent
        const totalSalaries = prev.members.reduce((acc, m) => acc + m.salaryPerWeek, 0);
        const hqRents = [0, 0, 150, 650, 2600];
        const hqWeeklyCost = hqRents[prev.hqTier] || 0;
        const totalExpenses = totalSalaries + hqWeeklyCost;

        const updatedMembers = prev.members.map(m => ({
          ...m,
          energy: Math.min(100, m.energy + 3), // Natural rest recovery per week
          morale: Math.max(20, Math.min(100, m.morale + (prev.hype > 50 ? 1 : -1)))
        }));

        // 3. Natural Hype & Passive Fan Growth
        const newHype = Math.max(10, Math.min(100, prev.hype > 30 ? prev.hype - 1 : prev.hype));
        const passiveFans = Math.floor(videoViewsWeeklyTotal * 0.002);

        // 4. Financial Net Balance
        const netCash = Math.max(0, prev.cash + weeklyStreamingIncome - totalExpenses);

        // 5. Check Random Dilemma / Rock Events
        let eventToTrigger = prev.pendingEvent;
        if (!eventToTrigger && nextWeek - prev.lastEventWeek >= 6 && Math.random() < 0.45) {
          const randomIndex = Math.floor(Math.random() * RANDOM_ROCK_EVENTS.length);
          eventToTrigger = RANDOM_ROCK_EVENTS[randomIndex];
        }

        // 6. Log Weekly History
        const newHistoryEntry = {
          week: prev.currentWeek,
          year: prev.currentYear,
          streamingRevenue: weeklyStreamingIncome,
          tourRevenue: 0,
          merchRevenue: 0,
          expenses: totalExpenses,
          fansCount: prev.fans + passiveFans
        };

        return {
          ...prev,
          currentWeek: normalizedWeek,
          currentYear: nextYear,
          cash: netCash,
          fans: prev.fans + passiveFans,
          hype: newHype,
          members: updatedMembers,
          discography: updatedDiscography,
          musicVideos: updatedVideos,
          pendingEvent: eventToTrigger,
          lastEventWeek: eventToTrigger ? nextWeek : prev.lastEventWeek,
          weeklyHistory: [newHistoryEntry, ...prev.weeklyHistory.slice(0, 30)]
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [inGame, gameState.gameSpeed]);

  // Start game from Title Screen
  const handleStartGame = (bandName: string, genre: MusicGenre) => {
    setGameState(prev => ({
      ...prev,
      bandName,
      genre
    }));
    setInGame(true);
  };

  // Handle Song Recorded in Studio
  const handleSongRecorded = (newSong: Song, studioCost: number) => {
    setGameState(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - studioCost),
      discography: [newSong, ...prev.discography],
      songMastery: { ...prev.songMastery, [newSong.id]: 20 }, // Starts with 20% rehearsal
      fans: prev.fans + Math.floor(newSong.quality * 2.5),
      hype: Math.min(100, prev.hype + Math.floor(newSong.quality * 0.2))
    }));
  };

  // Handle Album Released
  const handleAlbumReleased = (newAlbum: Album) => {
    setGameState(prev => {
      let contractUpdate = prev.contract;
      if (contractUpdate && contractUpdate.albumsRemaining > 0) {
        contractUpdate = {
          ...contractUpdate,
          albumsRemaining: contractUpdate.albumsRemaining - 1
        };
      }

      return {
        ...prev,
        albums: [newAlbum, ...prev.albums],
        fans: prev.fans + Math.floor(newAlbum.criticScore * 8),
        hype: Math.min(100, prev.hype + 30),
        contract: contractUpdate
      };
    });
  };

  // Handle Music Video Created
  const handleVideoCreated = (newVideo: MusicVideo, totalCost: number) => {
    setGameState(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - totalCost),
      musicVideos: [newVideo, ...prev.musicVideos],
      fans: prev.fans + Math.floor(newVideo.viewsTotal * 0.05),
      hype: Math.min(100, prev.hype + 25)
    }));
  };

  // Handle HQ Upgrade
  const handleUpgradeHQ = (newTier: number) => {
    setGameState(prev => ({
      ...prev,
      hqTier: newTier,
      bandChemistry: Math.min(100, prev.bandChemistry + 15),
      hype: Math.min(100, prev.hype + 10)
    }));
    rockAudio.playPowerChord(98, 0.5);
  };

  // Handle Song Rehearsal in HQ
  const handleRehearseSong = (songId: string) => {
    setGameState(prev => {
      const current = prev.songMastery[songId] || 0;
      const boost = prev.hqTier === 4 ? 40 : prev.hqTier === 3 ? 30 : 25;
      return {
        ...prev,
        songMastery: {
          ...prev.songMastery,
          [songId]: Math.min(100, current + boost)
        },
        members: prev.members.map(m => ({
          ...m,
          energy: Math.max(10, m.energy - 6),
          skills: {
            ...m.skills,
            technique: Math.min(100, m.skills.technique + 1)
          }
        }))
      };
    });
  };

  // Handle Hire Candidate
  const handleHireMember = (newMember: BandMember, signingFee: number, replaceId?: string) => {
    setGameState(prev => {
      const updatedMembers = replaceId
        ? prev.members.map(m => m.id === replaceId ? newMember : m)
        : [...prev.members, newMember];

      return {
        ...prev,
        cash: Math.max(0, prev.cash - signingFee),
        members: updatedMembers,
        bandChemistry: Math.min(100, prev.bandChemistry + 5)
      };
    });
  };

  // Handle Tour Stop Finished
  const handleFinishTourStop = (result: {
    ticketsSold: number;
    ticketRevenue: number;
    merchRevenue: number;
    venueCost: number;
    netProfit: number;
    hypeGained: number;
    fansGained: number;
    performanceRating: number;
  }) => {
    setGameState(prev => ({
      ...prev,
      cash: prev.cash + result.netProfit,
      fans: prev.fans + result.fansGained,
      hype: Math.min(100, prev.hype + result.hypeGained),
      members: prev.members.map(m => ({
        ...m,
        energy: Math.max(15, m.energy - 18),
        skills: {
          ...m.skills,
          stagePresence: Math.min(100, m.skills.stagePresence + 1)
        }
      }))
    }));
  };

  // Handle Member Update (Skills, Gear, Training)
  const handleUpdateMember = (updatedMember: BandMember, cost: number) => {
    setGameState(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - cost),
      members: prev.members.map(m => m.id === updatedMember.id ? updatedMember : m)
    }));
  };

  // Handle Contract Sign
  const handleSignContract = (label: RecordLabel) => {
    const newContract: ActiveContract = {
      labelId: label.id,
      labelName: label.name,
      albumsRemaining: label.albumCommitment,
      royaltyRate: label.royaltyRate,
      advanceReceived: label.advanceOffer,
      deadlineWeek: gameState.currentWeek + label.albumCommitment * 18,
      penaltyFee: Math.floor(label.advanceOffer * 1.5)
    };

    setGameState(prev => ({
      ...prev,
      cash: prev.cash + label.advanceOffer,
      contract: newContract,
      hype: Math.min(100, prev.hype + 20)
    }));
  };

  // Handle Buyout Contract
  const handleBuyoutContract = (cost: number) => {
    setGameState(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - cost),
      contract: null
    }));
  };

  // Handle Web3 Cashout Success
  const handleProcessCashout = (amount: number, currency: 'USDC' | 'USDT', tx: Web3Transaction) => {
    setGameState(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - amount),
      withdrawnUSDC: currency === 'USDC' ? prev.withdrawnUSDC + amount : prev.withdrawnUSDC,
      withdrawnUSDT: currency === 'USDT' ? prev.withdrawnUSDT + amount : prev.withdrawnUSDT,
      withdrawalHistory: [tx, ...prev.withdrawalHistory]
    }));
  };

  // Handle Web3 Deposit Success (Funding band from Coinbase or Wallet)
  const handleProcessDeposit = (amount: number, _currency: 'USDC' | 'USDT', tx: Web3Transaction) => {
    setGameState(prev => ({
      ...prev,
      cash: prev.cash + amount,
      withdrawalHistory: [tx, ...prev.withdrawalHistory]
    }));
  };

  // Handle Event Option Selected
  const handleEventChoice = (optionIndex: number) => {
    if (!gameState.pendingEvent) return;
    const chosenOption = gameState.pendingEvent.options[optionIndex];
    if (chosenOption) {
      const stateDiff = chosenOption.action(gameState);
      setGameState(prev => ({
        ...prev,
        ...stateDiff,
        pendingEvent: null
      }));
    }
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    const muted = rockAudio.toggleMute();
    setIsMuted(muted);
  };

  // If on Title Screen, render TitleScreen component
  if (!inGame) {
    return <TitleScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#07080f] text-slate-100 overflow-hidden select-none">
      {/* Top Header & Navigation */}
      <HeaderNav
        bandName={gameState.bandName}
        cash={gameState.cash}
        fans={gameState.fans}
        hype={gameState.hype}
        currentWeek={gameState.currentWeek}
        currentYear={gameState.currentYear}
        gameSpeed={gameState.gameSpeed}
        activeView={activeView}
        isMuted={isMuted}
        onSetSpeed={(speed) => setGameState(prev => ({ ...prev, gameSpeed: speed }))}
        onSelectView={(v) => setActiveView(v)}
        onOpenWeb3Modal={() => setIsWeb3ModalOpen(true)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Area with custom smooth scrolling */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeView === 'tour' && (
          <TourManager
            fans={gameState.fans}
            cash={gameState.cash}
            members={gameState.members}
            onFinishTourStop={handleFinishTourStop}
          />
        )}

        {activeView === 'studio' && (
          <SongStudio
            bandName={gameState.bandName}
            cash={gameState.cash}
            members={gameState.members}
            currentWeek={gameState.currentWeek}
            currentYear={gameState.currentYear}
            discography={gameState.discography}
            albums={gameState.albums}
            onSongRecorded={handleSongRecorded}
            onAlbumReleased={handleAlbumReleased}
          />
        )}

        {activeView === 'videos' && (
          <MusicVideoStudio
            cash={gameState.cash}
            currentWeek={gameState.currentWeek}
            currentYear={gameState.currentYear}
            discography={gameState.discography}
            musicVideos={gameState.musicVideos}
            onVideoCreated={handleVideoCreated}
          />
        )}

        {activeView === 'hq' && (
          <HQManager
            cash={gameState.cash}
            fans={gameState.fans}
            hqTier={gameState.hqTier}
            members={gameState.members}
            discography={gameState.discography}
            songMastery={gameState.songMastery}
            bandChemistry={gameState.bandChemistry}
            onUpgradeHQ={handleUpgradeHQ}
            onRehearseSong={handleRehearseSong}
            onHireMember={handleHireMember}
          />
        )}

        {activeView === 'band' && (
          <BandRoster
            cash={gameState.cash}
            members={gameState.members}
            onUpdateMember={handleUpdateMember}
          />
        )}

        {activeView === 'labels' && (
          <LabelsMarket
            fans={gameState.fans}
            cash={gameState.cash}
            currentContract={gameState.contract}
            onSignContract={handleSignContract}
            onBuyoutContract={handleBuyoutContract}
          />
        )}

        {activeView === 'charts' && (
          <ChartsAnalytics
            bandName={gameState.bandName}
            discography={gameState.discography}
            albums={gameState.albums}
            weeklyHistory={gameState.weeklyHistory}
            currentWeek={gameState.currentWeek}
            currentYear={gameState.currentYear}
            cash={gameState.cash}
            fans={gameState.fans}
            hype={gameState.hype}
          />
        )}
      </main>

      {/* Web3 Withdrawal & Deposit Modal */}
      <Web3CashoutModal
        isOpen={isWeb3ModalOpen}
        onClose={() => setIsWeb3ModalOpen(false)}
        bandName={gameState.bandName}
        cash={gameState.cash}
        onProcessCashout={handleProcessCashout}
        onProcessDeposit={handleProcessDeposit}
      />

      {/* Manual & Licencia Modal */}
      <ManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {/* Random Rock Dilemma Event Modal */}
      {gameState.pendingEvent && (
        <EventModal
          event={gameState.pendingEvent}
          onChooseOption={handleEventChoice}
        />
      )}
    </div>
  );
}
