export type MusicGenre = 
  | 'Hard Rock' 
  | 'Heavy Metal' 
  | 'Grunge' 
  | 'Punk Rock' 
  | 'Prog Rock' 
  | 'Glam Metal' 
  | 'Alternative' 
  | 'Psychedelic Rock';

export type LyricTheme = 
  | 'Rebellion' 
  | 'Heartbreak & Love' 
  | 'Dark Fantasy' 
  | 'Anti-Establishment' 
  | 'Cosmic Voyage' 
  | 'Speed & Thunder' 
  | 'Party & Excess' 
  | 'Existential Dread';

export type InstrumentType = 'Vocals' | 'Lead Guitar' | 'Bass' | 'Drums' | 'Keyboards';

export type PersonalityTrait = 
  | 'Virtuoso' 
  | 'Crowd Magnet' 
  | 'Perfectionist' 
  | 'Wild Party Animal' 
  | 'Studio Rat' 
  | 'Zen Master';

export interface BandMember {
  id: string;
  name: string;
  role: InstrumentType;
  avatarSeed: string;
  trait: PersonalityTrait;
  skills: {
    technique: number;     // 1 - 100
    creativity: number;    // 1 - 100
    stagePresence: number; // 1 - 100
    songwriting: number;   // 1 - 100
    stamina: number;       // 1 - 100
  };
  energy: number;          // 0 - 100
  morale: number;          // 0 - 100
  gearLevel: number;       // 1 - 5
  salaryPerWeek: number;
}

export interface SongStructure {
  intro: boolean;
  verses: number; // 1 - 3
  chorus: number; // 1 - 4
  guitarSolo: boolean;
  bridge: boolean;
  breakdown: boolean;
  outro: boolean;
}

export interface SongBalance {
  vocals: number;       // 0 - 100
  leadGuitar: number;   // 0 - 100
  bass: number;         // 0 - 100
  drums: number;        // 0 - 100
  synthFx: number;      // 0 - 100
}

export interface SongReview {
  outlet: string;
  rating: number; // 1 - 10
  quote: string;
}

export interface Song {
  id: string;
  title: string;
  genre: MusicGenre;
  theme: LyricTheme;
  structure: SongStructure;
  balance: SongBalance;
  quality: number; // 1 - 100
  recordedWeek: number;
  recordedYear: number;
  studioTier: number;
  streamsTotal: number;
  streamsThisWeek: number;
  digitalSales: number;
  chartRank: number | null; // 1 - 50 or null
  reviews: SongReview[];
  albumId?: string;
  riffKey: string;
}

export interface AlbumCoverConfig {
  background: 'vinyl' | 'skull' | 'cosmic' | 'lightning' | 'graffiti' | 'fire';
  textColor: string;
  badge: 'parental' | 'gold' | 'explicit' | 'none';
  filter: 'vintage' | 'neon' | 'monochrome' | 'raw';
}

export interface Album {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Full Album';
  songs: Song[];
  releaseWeek: number;
  releaseYear: number;
  coverArtSeed: string;
  coverConfig?: AlbumCoverConfig;
  physicalCopiesSold: number;
  totalRevenue: number;
  criticScore: number; // 1 - 100
  labelSignedId?: string;
}

export interface MusicVideo {
  id: string;
  songId: string;
  songTitle: string;
  directorTier: string;
  concept: string;
  budget: number;
  viewsTotal: number;
  weeklyViews: number;
  releaseWeek: number;
  releaseYear: number;
}

export interface Headquarter {
  id: string;
  tier: number;
  name: string;
  weeklyRent: number;
  minFans: number;
  description: string;
  icon: string;
  chemistryBonus: number;
  rehearsalBoost: number;
}

export interface AuditionCandidate {
  id: string;
  name: string;
  role: InstrumentType;
  trait: PersonalityTrait;
  skills: {
    technique: number;
    creativity: number;
    stagePresence: number;
    songwriting: number;
    stamina: number;
  };
  askingSalary: number;
  signingFee: number;
}

export interface RecordLabel {
  id: string;
  name: string;
  tier: 'Indie' | 'Mid' | 'Major' | 'MegaCorp';
  description: string;
  logoColor: string;
  advanceOffer: number;
  royaltyRate: number;
  albumCommitment: number;
  marketingPower: number;
  minFansRequired: number;
  signingBonusGear: string;
}

export interface ActiveContract {
  labelId: string;
  labelName: string;
  albumsRemaining: number;
  royaltyRate: number;
  advanceReceived: number;
  deadlineWeek: number;
  penaltyFee: number;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  continent: 'North America' | 'Europe' | 'Asia' | 'Latin America' | 'Oceania';
  capacity: number;
  rentalCost: number;
  minFansRequired: number;
  ticketPriceDefault: number;
  stageType: 'Dive' | 'Club' | 'Theater' | 'Arena' | 'Stadium' | 'Festival';
}

export interface TourStop {
  venue: Venue;
  ticketPrice: number;
  status: 'pending' | 'completed';
  result?: {
    ticketsSold: number;
    ticketRevenue: number;
    merchRevenue: number;
    venueCost: number;
    netProfit: number;
    hypeGained: number;
    fansGained: number;
    performanceRating: number;
  };
}

export interface ActiveTour {
  name: string;
  stops: TourStop[];
  currentStopIndex: number;
  isPerforming: boolean;
  busTier: number;
  crewSkill: number;
}

export interface ChartEntry {
  rank: number;
  songTitle: string;
  artistName: string;
  genre: MusicGenre;
  streamsWeekly: number;
  isPlayer: boolean;
  change: number;
}

export interface RockEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  options: {
    text: string;
    action: (state: GameState) => Partial<GameState>;
    outcomeText: string;
  }[];
}

export interface Web3Transaction {
  txHash: string;
  network: string;
  amount: number;
  currency: 'USDC' | 'USDT';
  recipientAddress: string;
  timestamp: number;
  status: 'Confirmed' | 'Processing';
  gasFee: number;
  type?: 'withdrawal' | 'deposit' | 'faucet';
  isCoinbase?: boolean;
  explorerUrl?: string;
  blockNumber?: number;
  onChainVerified?: boolean;
}

export interface GameState {
  // Band Details
  bandName: string;
  genre: MusicGenre;
  members: BandMember[];
  formedWeek: number;
  bandChemistry: number;       // 0 - 100
  hqTier: number;              // 1 to 4
  
  // Economy & Fans
  cash: number;
  fans: number;
  fameLevel: number;
  hype: number;
  
  // Time
  currentWeek: number;
  currentYear: number;
  gameSpeed: 0 | 1 | 2 | 5;
  
  // Creative Output & Rehearsals
  discography: Song[];
  albums: Album[];
  musicVideos: MusicVideo[];
  songMastery: Record<string, number>; // songId -> 0 to 100% mastery
  
  // Labels & Contracts
  contract: ActiveContract | null;
  
  // Tour & Live
  currentTour: ActiveTour | null;
  unlockedVenues: string[];
  
  // Analytics
  weeklyHistory: {
    week: number;
    year: number;
    streamingRevenue: number;
    tourRevenue: number;
    merchRevenue: number;
    expenses: number;
    fansCount: number;
  }[];
  
  // Web3 Vault & Withdrawals
  web3Connected: boolean;
  walletAddress: string;
  walletNetwork: 'Polygon' | 'Base' | 'Arbitrum' | 'Ethereum' | 'Sepolia';
  withdrawnUSDC: number;
  withdrawnUSDT: number;
  withdrawalHistory: Web3Transaction[];
  
  // Active Event
  pendingEvent: RockEvent | null;
  lastEventWeek: number;
}
