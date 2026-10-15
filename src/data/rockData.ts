import { 
  MusicGenre, 
  BandMember, 
  Venue, 
  RecordLabel, 
  RockEvent, 
  ChartEntry, 
  LyricTheme 
} from '../types/game';

export const MUSIC_GENRES: {
  genre: MusicGenre;
  description: string;
  bestThemes: LyricTheme[];
  bpmRange: string;
  color: string;
}[] = [
  {
    genre: 'Hard Rock',
    description: 'Riffs pesados, guitarras distorsionadas y coros electrizantes.',
    bestThemes: ['Rebellion', 'Party & Excess', 'Speed & Thunder'],
    bpmRange: '120 - 138 BPM',
    color: '#f59e0b'
  },
  {
    genre: 'Heavy Metal',
    description: 'Doble bombo implacable, solos a la velocidad de la luz y líricas épicas.',
    bestThemes: ['Dark Fantasy', 'Speed & Thunder', 'Existential Dread'],
    bpmRange: '135 - 160 BPM',
    color: '#ef4444'
  },
  {
    genre: 'Grunge',
    description: 'Guitarras sucias, angustia visceral, baterías explosivas y pasión pura.',
    bestThemes: ['Existential Dread', 'Anti-Establishment', 'Heartbreak & Love'],
    bpmRange: '95 - 122 BPM',
    color: '#10b981'
  },
  {
    genre: 'Punk Rock',
    description: 'Tres acordes a toda velocidad, furia antisistema y adrenalina máxima.',
    bestThemes: ['Anti-Establishment', 'Rebellion', 'Party & Excess'],
    bpmRange: '150 - 180 BPM',
    color: '#ec4899'
  },
  {
    genre: 'Prog Rock',
    description: 'Complejidad técnica, compases irregulares y viajes conceptuales.',
    bestThemes: ['Cosmic Voyage', 'Dark Fantasy', 'Existential Dread'],
    bpmRange: '100 - 145 BPM',
    color: '#8b5cf6'
  },
  {
    genre: 'Glam Metal',
    description: 'Mucho brillo, ganchos pop-metal irresistibles y solos melódicos inolvidables.',
    bestThemes: ['Party & Excess', 'Heartbreak & Love', 'Rebellion'],
    bpmRange: '125 - 140 BPM',
    color: '#f43f5e'
  },
  {
    genre: 'Alternative',
    description: 'Atmósferas densas, melodías agridulces e introspección artística.',
    bestThemes: ['Heartbreak & Love', 'Existential Dread', 'Cosmic Voyage'],
    bpmRange: '105 - 130 BPM',
    color: '#06b6d4'
  },
  {
    genre: 'Psychedelic Rock',
    description: 'Ecos hipnóticos, fuzz psicotrópico y expansión mental sónica.',
    bestThemes: ['Cosmic Voyage', 'Dark Fantasy', 'Rebellion'],
    bpmRange: '88 - 118 BPM',
    color: '#d946ef'
  }
];

export const LYRIC_THEMES: { theme: LyricTheme; icon: string; desc: string }[] = [
  { theme: 'Rebellion', icon: '⚡', desc: 'Desafiar la autoridad y romper las reglas.' },
  { theme: 'Heartbreak & Love', icon: '💔', desc: 'Pasión desgarradora y recuerdos amargos.' },
  { theme: 'Dark Fantasy', icon: '🦇', desc: 'Criaturas míticas, castillos y sombras.' },
  { theme: 'Anti-Establishment', icon: '✊', desc: 'Crítica cruda al sistema y corporaciones.' },
  { theme: 'Cosmic Voyage', icon: '🌌', desc: 'Odiseas interestelares y dimensiones paralelas.' },
  { theme: 'Speed & Thunder', icon: '🏍️', desc: 'Autopistas, motores rugientes y adrenalina.' },
  { theme: 'Party & Excess', icon: '🍻', desc: 'Noches salvajes, licor y desenfreno.' },
  { theme: 'Existential Dread', icon: '👁️', desc: 'La fragilidad de la vida y el vacío interior.' }
];

export const STUDIO_TIERS = [
  {
    tier: 1,
    name: 'El Garaje de la Abuela',
    cost: 150,
    minQualityBonus: 0,
    maxQualityBonus: 10,
    desc: 'Grabadora de 4 pistas, cables pelados y acústica con cajas de huevos.'
  },
  {
    tier: 2,
    name: 'Estudio Sótano Analógico',
    cost: 800,
    minQualityBonus: 8,
    maxQualityBonus: 22,
    desc: 'Consola vintage de 16 canales y preamplificadores a tubos con olor a tabaco.'
  },
  {
    tier: 3,
    name: 'Silver Sound Studios',
    cost: 3200,
    minQualityBonus: 20,
    maxQualityBonus: 38,
    desc: 'Ingeniero de mezcla profesional, micrófonos Neumann y sala insonorizada.'
  },
  {
    tier: 4,
    name: 'Abbey Master Suites',
    cost: 12000,
    minQualityBonus: 35,
    maxQualityBonus: 52,
    desc: 'Monitores de clase mundial, consola SSL legendaria y masterización para estadios.'
  },
  {
    tier: 5,
    name: 'Titan Orbit Labs (VIP)',
    cost: 45000,
    minQualityBonus: 50,
    maxQualityBonus: 65,
    desc: 'Tecnología sónica espacial, producción de grammy y sonido con nitidez cósmica.'
  }
];

export const WORLD_VENUES: Venue[] = [
  {
    id: 'venue_garage_dive',
    name: 'The Rusty Fender',
    city: 'Los Ángeles',
    country: 'USA',
    flag: '🇺🇸',
    continent: 'North America',
    capacity: 80,
    rentalCost: 100,
    minFansRequired: 0,
    ticketPriceDefault: 12,
    stageType: 'Dive'
  },
  {
    id: 'venue_underground_ny',
    name: 'Subterranean CB99',
    city: 'Nueva York',
    country: 'USA',
    flag: '🇺🇸',
    continent: 'North America',
    capacity: 350,
    rentalCost: 450,
    minFansRequired: 250,
    ticketPriceDefault: 20,
    stageType: 'Club'
  },
  {
    id: 'venue_camden_london',
    name: 'Camden Electric Monarch',
    city: 'Londres',
    country: 'Reino Unido',
    flag: '🇬🇧',
    continent: 'Europe',
    capacity: 900,
    rentalCost: 1400,
    minFansRequired: 900,
    ticketPriceDefault: 28,
    stageType: 'Club'
  },
  {
    id: 'venue_berlin_vault',
    name: 'Krautrock Bunker SO44',
    city: 'Berlín',
    country: 'Alemania',
    flag: '🇩🇪',
    continent: 'Europe',
    capacity: 1500,
    rentalCost: 2800,
    minFansRequired: 2500,
    ticketPriceDefault: 35,
    stageType: 'Theater'
  },
  {
    id: 'venue_ba_obras',
    name: 'Templo del Rock Obras',
    city: 'Buenos Aires',
    country: 'Argentina',
    flag: '🇦🇷',
    continent: 'Latin America',
    capacity: 4500,
    rentalCost: 5500,
    minFansRequired: 6000,
    ticketPriceDefault: 42,
    stageType: 'Theater'
  },
  {
    id: 'venue_mx_foro',
    name: 'Arena Sol Azteca',
    city: 'Ciudad de México',
    country: 'México',
    flag: '🇲🇽',
    continent: 'Latin America',
    capacity: 18000,
    rentalCost: 18000,
    minFansRequired: 15000,
    ticketPriceDefault: 55,
    stageType: 'Arena'
  },
  {
    id: 'venue_tokyo_budokan',
    name: 'Nippon Rock Arena',
    city: 'Tokio',
    country: 'Japón',
    flag: '🇯🇵',
    continent: 'Asia',
    capacity: 14000,
    rentalCost: 22000,
    minFansRequired: 22000,
    ticketPriceDefault: 65,
    stageType: 'Arena'
  },
  {
    id: 'venue_sydney_harbour',
    name: 'Harbour Headland Amphitheatre',
    city: 'Sídney',
    country: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    capacity: 25000,
    rentalCost: 35000,
    minFansRequired: 40000,
    ticketPriceDefault: 75,
    stageType: 'Stadium'
  },
  {
    id: 'venue_wembley_stadium',
    name: 'Royal Apex Stadium',
    city: 'Londres',
    country: 'Reino Unido',
    flag: '🇬🇧',
    continent: 'Europe',
    capacity: 75000,
    rentalCost: 95000,
    minFansRequired: 85000,
    ticketPriceDefault: 95,
    stageType: 'Stadium'
  },
  {
    id: 'venue_wacken_fest',
    name: 'Gods of Thunder Festival',
    city: 'Hamburgo',
    country: 'Alemania',
    flag: '🇩🇪',
    continent: 'Europe',
    capacity: 110000,
    rentalCost: 150000,
    minFansRequired: 150000,
    ticketPriceDefault: 125,
    stageType: 'Festival'
  }
];

export const RECORD_LABELS: RecordLabel[] = [
  {
    id: 'label_garage_diy',
    name: 'DIY Basement Tapes',
    tier: 'Indie',
    description: 'El sello de los rebeldes locales. Cero ataduras, máximo porcentaje para ti.',
    logoColor: '#64748b',
    advanceOffer: 500,
    royaltyRate: 0.85,
    albumCommitment: 1,
    marketingPower: 20,
    minFansRequired: 50,
    signingBonusGear: 'Pedal Fuzz Vintage'
  },
  {
    id: 'label_black_skull',
    name: 'Black Skull Underground',
    tier: 'Mid',
    description: 'Especialistas en rock sucio y giras independientes de culto por todo el continente.',
    logoColor: '#e11d48',
    advanceOffer: 8500,
    royaltyRate: 0.60,
    albumCommitment: 2,
    marketingPower: 45,
    minFansRequired: 1500,
    signingBonusGear: 'Amplificador Marshall Stack'
  },
  {
    id: 'label_valhalla',
    name: 'Valhalla Sound Records',
    tier: 'Major',
    description: 'El peso pesado del rock mundial. Te colocan en radios, festivales y portadas de revistas.',
    logoColor: '#eab308',
    advanceOffer: 55000,
    royaltyRate: 0.38,
    albumCommitment: 3,
    marketingPower: 75,
    minFansRequired: 12000,
    signingBonusGear: 'Guitarra Custom Gibson Les Paul Gold'
  },
  {
    id: 'label_apex_mega',
    name: 'Global Apex Music Empire',
    tier: 'MegaCorp',
    description: 'La corporación musical más influyente del planeta. Adelantos colosales pero contratos implacables.',
    logoColor: '#3b82f6',
    advanceOffer: 250000,
    royaltyRate: 0.22,
    albumCommitment: 4,
    marketingPower: 98,
    minFansRequired: 60000,
    signingBonusGear: 'Estudio de Grabación Móvil en Autobús de Lujo'
  }
];

export const INITIAL_MEMBERS: BandMember[] = [
  {
    id: 'member_1',
    name: 'Jax "Viper" Vance',
    role: 'Vocals',
    avatarSeed: 'jax_vocal',
    trait: 'Crowd Magnet',
    skills: {
      technique: 42,
      creativity: 55,
      stagePresence: 68,
      songwriting: 50,
      stamina: 60
    },
    energy: 100,
    morale: 90,
    gearLevel: 1,
    salaryPerWeek: 45
  },
  {
    id: 'member_2',
    name: 'Slashy Ramirez',
    role: 'Lead Guitar',
    avatarSeed: 'slashy_guitar',
    trait: 'Virtuoso',
    skills: {
      technique: 65,
      creativity: 58,
      stagePresence: 48,
      songwriting: 62,
      stamina: 55
    },
    energy: 100,
    morale: 95,
    gearLevel: 1,
    salaryPerWeek: 50
  },
  {
    id: 'member_3',
    name: 'Nikki "Bass" Cruz',
    role: 'Bass',
    avatarSeed: 'nikki_bass',
    trait: 'Wild Party Animal',
    skills: {
      technique: 48,
      creativity: 40,
      stagePresence: 58,
      songwriting: 38,
      stamina: 75
    },
    energy: 95,
    morale: 88,
    gearLevel: 1,
    salaryPerWeek: 35
  },
  {
    id: 'member_4',
    name: 'Axel "Animal" Blake',
    role: 'Drums',
    avatarSeed: 'axel_drums',
    trait: 'Perfectionist',
    skills: {
      technique: 58,
      creativity: 45,
      stagePresence: 52,
      songwriting: 30,
      stamina: 80
    },
    energy: 100,
    morale: 92,
    gearLevel: 1,
    salaryPerWeek: 40
  }
];

export const RIVAL_CHART_SONGS = [
  { title: 'Master of Riffs', artist: 'Iron Voltage', genre: 'Heavy Metal' as MusicGenre, baseStreams: 840000 },
  { title: 'Smells Like Pure Gasoline', artist: 'Nirvana Clone 99', genre: 'Grunge' as MusicGenre, baseStreams: 720000 },
  { title: 'Highway to Oblivion', artist: 'Thunder Highway', genre: 'Hard Rock' as MusicGenre, baseStreams: 690000 },
  { title: 'Anarchy in the Metaverse', artist: 'The Rotten Pistols', genre: 'Punk Rock' as MusicGenre, baseStreams: 550000 },
  { title: 'Stairway to the Stratosphere', artist: 'Zeppelin Ghost', genre: 'Prog Rock' as MusicGenre, baseStreams: 510000 },
  { title: 'Pour Some Neon on Me', artist: 'Glitter Leopard', genre: 'Glam Metal' as MusicGenre, baseStreams: 480000 },
  { title: 'Paranoid Android Soul', artist: 'Radio Void', genre: 'Alternative' as MusicGenre, baseStreams: 440000 },
  { title: 'Lucy in the Web3 Sky', artist: 'The Shaman Beatles', genre: 'Psychedelic Rock' as MusicGenre, baseStreams: 390000 },
  { title: 'Sweet Child of Distortion', artist: 'Guns & Bullets', genre: 'Hard Rock' as MusicGenre, baseStreams: 340000 },
  { title: 'Enter the Sandman', artist: 'Titanium Men', genre: 'Heavy Metal' as MusicGenre, baseStreams: 310000 }
];

export const CRITIC_OUTLETS = [
  { name: 'Rolling Tone', weight: 1.2 },
  { name: 'Kerrang! Radar', weight: 1.0 },
  { name: 'Pitchfork Underground', weight: 0.9 },
  { name: 'Metal Hammer Global', weight: 1.1 }
];

export const RANDOM_ROCK_EVENTS: RockEvent[] = [
  {
    id: 'event_tv_hotel',
    title: '¡Televisor volando por la ventana del hotel!',
    description: 'Durante la fiesta posterior al último ensayo, alguien del grupo lanzó un televisor a la piscina del hotel. La prensa local tiene fotos exclusivas.',
    icon: '📺',
    options: [
      {
        text: 'Pagar los daños ($850) y pedir disculpas públicas.',
        outcomeText: 'Conservas tu reputación intacta aunque tu billetera sufre una pérdida.',
        action: (s) => ({ cash: Math.max(0, s.cash - 850), hype: s.hype + 5 })
      },
      {
        text: '¡Abrazar el caos! Publicar el video en redes como rockeros salvajes.',
        outcomeText: '¡El video se vuelve viral en TikTok! Ganas 1,200 fans nuevos y mucho Hype, pero pierdes algo de moral.',
        action: (s) => ({ fans: s.fans + 1200, hype: Math.min(100, s.hype + 25) })
      }
    ]
  },
  {
    id: 'event_guitar_duel',
    title: 'Duelo de Solos Callejero',
    description: 'Un famoso virtuoso de una banda rival desafía a tu guitarrista a un duelo de solos transmitido en vivo.',
    icon: '🎸',
    options: [
      {
        text: 'Aceptar el reto con un solo improvisado.',
        outcomeText: '¡Tu guitarrista deslumbra al público! La técnica de la banda sube.',
        action: (s) => {
          const updated = s.members.map(m => 
            m.role === 'Lead Guitar' 
              ? { ...m, skills: { ...m.skills, technique: Math.min(100, m.skills.technique + 4) } } 
              : m
          );
          return { members: updated, fans: s.fans + 800, hype: Math.min(100, s.hype + 15) };
        }
      },
      {
        text: 'Ignorarlo y concentrarse en componer nuevas canciones.',
        outcomeText: 'Evitas el drama y la creatividad de la banda aumenta para el próximo hit.',
        action: (s) => {
          const updated = s.members.map(m => ({
            ...m,
            skills: { ...m.skills, creativity: Math.min(100, m.skills.creativity + 2) }
          }));
          return { members: updated };
        }
      }
    ]
  },
  {
    id: 'event_energy_drink_sponsor',
    title: 'Oferta de Patrocinio de Bebida Energética',
    description: '"Nitro Volt Energy" quiere poner su logo en los bombos de tu batería y ofrecerles $3,500 inmediatos a cambio de exclusividad.',
    icon: '⚡',
    options: [
      {
        text: 'Firmar el patrocinio (+$3,500 en efectivo).',
        outcomeText: 'Dinero fresco en la caja para financiar tu próximo álbum.',
        action: (s) => ({ cash: s.cash + 3500, hype: Math.min(100, s.hype + 8) })
      },
      {
        text: 'Rechazar: "El rock auténtico no se vende por latas azucaradas".',
        outcomeText: 'Tus fanáticos más puristas aplauden tu integridad artística. Ganas lealtad y 500 fans de culto.',
        action: (s) => ({ fans: s.fans + 500, hype: Math.min(100, s.hype + 10) })
      }
    ]
  }
];
