/* ── Coach Profile Store (localStorage) ── */

const PROFILES_KEY = 'coacheasy_profiles';
const SESSIONS_KEY = 'coacheasy_sessions';
const MEDIA_KEY = 'coacheasy_media';

/* ── Seed Data ── */
const TIM_TURK_PROFILE = {
  id: 'tim-turk',
  firstName: 'Tim',
  lastName: 'Turk',
  orgName: 'Tim Turk Hockey',
  city: 'Toronto',
  province: 'ON',
  sport: 'Hockey',
  levels: ['AA/AAA', 'AAA'],
  ageRange: '8–18',
  languages: ['EN', 'FR'],
  phone: '(416) 555-0147',
  email: 'tim@timturkhockey.com',
  website: 'https://timturkhockey.com',
  instagram: 'https://instagram.com/timturkhockey',
  facebook: 'https://facebook.com/timturkhockey',
  tiktok: 'https://tiktok.com/@timturkhockey',
  youtube: 'https://youtube.com/@timturkhockey',
  bio: "One of Canada's most sought-after skill development coaches. High-intensity, results-driven training from AAA bantam to the NHL — puck control, shooting mechanics, and game-speed decision making.",
  bioFr: "L'un des entraîneurs de développement des habiletés les plus recherchés au Canada. Formation intensive et axée sur les résultats.",
  rating: 4.9,
  reviewCount: 63,
  athleteCount: 247,
  yearsExp: '15+',
  expertise: ['Puck Handling', 'Shooting', 'Edge Work', 'Power Skating', 'AAA Training', 'Game Intelligence'],
  media: [
    { id: 'p1', type: 'photo', url: '', caption: 'On-ice session', uploadedAt: '2026-01-15' },
    { id: 'p2', type: 'photo', url: '', caption: "Skills camp '25", uploadedAt: '2026-01-20' },
    { id: 'v1', type: 'video', url: '', caption: 'The Grind Never Stops', uploadedAt: '2026-02-01' },
  ],
  isComplete: true,
  lastUpdated: '2026-03-01',
};

const TIM_TURK_SESSIONS = [
  {
    id: 'skills-clinic',
    coachId: 'tim-turk',
    title: 'Skills Clinic',
    sport: 'Hockey',
    level: 'AA/AAA',
    ageRange: '10–16',
    sessionType: 'Single',
    price: 80,
    priceLabel: 'per athlete',
    date: 'Saturday, March 22, 2026',
    dateShort: 'Sat Mar 22',
    time: '8:00 PM – 9:30 PM',
    duration: '90 min',
    location: 'Canlan Ice Sports, 2222 Erin Mills Pkwy, Mississauga ON',
    spotsTotal: 12,
    spotsLeft: 2,
    description: 'High-intensity skills session focused on puck handling, shooting mechanics, and edge work. Suitable for AA/AAA level players aged 10–16. Bring full equipment. Water and off-ice warm-up included.',
    status: 'live',
    createdAt: '2026-02-15',
  },
  {
    id: 'march-break-camp',
    coachId: 'tim-turk',
    title: 'March Break Camp',
    sport: 'Hockey',
    level: 'AA/AAA',
    ageRange: '10–16',
    sessionType: 'Camp (5 days)',
    price: 300,
    priceLabel: 'per athlete',
    date: 'Mon Mar 10 – Fri Mar 14, 2026',
    dateShort: 'Mar 10–14',
    time: '9:00 AM – 12:00 PM daily',
    duration: '3 hrs/day',
    location: 'William Allison Arena, 65 Westheights Dr, Kitchener ON',
    spotsTotal: 20,
    spotsLeft: 4,
    description: 'A full March Break skills camp covering skating, puck handling, shooting, and game-play. Players grouped by skill level. Daily snack provided. Arrive 15 minutes early.',
    status: 'live',
    createdAt: '2026-02-10',
  },
  {
    id: 'private-1on1',
    coachId: 'tim-turk',
    title: 'Private 1-on-1',
    sport: 'Hockey',
    level: 'All levels',
    ageRange: '8–18',
    sessionType: 'Private',
    price: 150,
    priceLabel: 'per session',
    date: 'Flexible — contact coach to schedule',
    dateShort: 'Flexible',
    time: '60 min · Your preferred time',
    duration: '60 min',
    location: 'To be confirmed with coach',
    spotsTotal: 1,
    spotsLeft: null,
    description: "Fully personalized session tailored to the athlete's specific needs. Coach Tim conducts a brief assessment then designs the session around skating, shooting, puck skills, or positioning.",
    status: 'live',
    createdAt: '2026-02-20',
  },
];

const BROWSE_COACHES = [
  {
    id: 'velocity-hockey',
    firstName: 'Velocity',
    lastName: 'Hockey',
    orgName: 'Velocity Hockey Academy',
    city: 'Montréal',
    province: 'QC',
    sport: 'Hockey',
    levels: ['AA/AAA', 'AAA'],
    ageRange: '8–17',
    languages: ['EN', 'FR'],
    phone: '(514) 555-0221',
    email: 'info@velocityhockey.ca',
    website: '', instagram: '', facebook: '', tiktok: '', youtube: '',
    bio: 'Elite hockey skills academy specializing in power skating, edge work, and high-speed puck control. Training future champions in the heart of Montréal.',
    bioFr: "Académie de hockey d'élite spécialisée en patinage de puissance et contrôle de la rondelle.",
    rating: 4.9,
    reviewCount: 41,
    athleteCount: 180,
    yearsExp: '10+',
    expertise: ['Power Skating', 'Elite Skills'],
    media: [],
    isComplete: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'kayla-tutino',
    firstName: 'Kayla',
    lastName: 'Tutino',
    orgName: 'Kayla Tutino Skating',
    city: 'Montréal',
    province: 'QC',
    sport: 'Hockey',
    levels: ['A/AA', 'AA/AAA'],
    ageRange: '6–16',
    languages: ['EN', 'FR'],
    phone: '(514) 555-0198',
    email: 'kayla@kaylatutino.ca',
    website: '', instagram: 'https://instagram.com/kaylatutino', facebook: '', tiktok: '', youtube: '',
    bio: 'Former professional skater turned power skating coach. Specializes in edge work, crossovers, and explosive starts for competitive hockey players.',
    bioFr: "Ancienne patineuse professionnelle devenue entraîneuse de patinage de puissance.",
    rating: 4.8,
    reviewCount: 34,
    athleteCount: 120,
    yearsExp: '8+',
    expertise: ['Power Skating', 'Skating & Edge Work'],
    media: [],
    isComplete: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'martin-lee',
    firstName: 'Martin',
    lastName: 'Lee',
    orgName: 'Martin Lee Hockey',
    city: 'Brossard',
    province: 'QC',
    sport: 'Hockey',
    levels: ['AA/AAA', 'AAA'],
    ageRange: '9–17',
    languages: ['EN', 'FR'],
    phone: '(450) 555-0133',
    email: 'martin@martinleehockey.ca',
    website: '', instagram: '', facebook: '', tiktok: '', youtube: '',
    bio: 'AAA-focused power skating and game IQ development. Over a decade coaching competitive players on the South Shore.',
    bioFr: "Spécialiste en patinage de puissance AAA et développement du QI de jeu.",
    rating: 4.7,
    reviewCount: 28,
    athleteCount: 95,
    yearsExp: '12+',
    expertise: ['AAA Power Skating'],
    media: [],
    isComplete: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'if-power-elite',
    firstName: 'iF',
    lastName: 'Power',
    orgName: 'iF Power Elite',
    city: 'Ottawa',
    province: 'ON',
    sport: 'Hockey',
    levels: ['AAA', 'Elite/Pro'],
    ageRange: '10–18',
    languages: ['EN'],
    phone: '(613) 555-0177',
    email: 'info@ifpowerelite.ca',
    website: '', instagram: '', facebook: '', tiktok: '', youtube: '',
    bio: 'The capital region\'s top AAA power skating program. Precision blade technique and explosive speed development for elite-level players.',
    bioFr: "Programme de patinage de puissance AAA de premier plan dans la région de la capitale.",
    rating: 5.0,
    reviewCount: 19,
    athleteCount: 72,
    yearsExp: '6+',
    expertise: ['AAA Power Skating'],
    media: [],
    isComplete: true,
    lastUpdated: '2026-03-01',
  },
];

const BROWSE_SESSIONS = [
  { id: 'vh-power-skate', coachId: 'velocity-hockey', title: 'Power Skating Fundamentals', sport: 'Hockey', level: 'AA/AAA', ageRange: '8–14', sessionType: 'Single', price: 85, priceLabel: 'per athlete', date: 'Saturday, March 29, 2026', dateShort: 'Sat Mar 29', time: '6:00 PM – 7:30 PM', duration: '90 min', location: 'Centre Sportif, 1000 Rue St-Antoine, Montréal QC', spotsTotal: 16, spotsLeft: 5, description: 'Build explosive speed and edge control. Covers crossovers, tight turns, and stop-starts.', status: 'live', createdAt: '2026-03-01' },
  { id: 'vh-elite-camp', coachId: 'velocity-hockey', title: 'Elite Skills Weekend', sport: 'Hockey', level: 'AAA', ageRange: '12–17', sessionType: 'Camp (2 days)', price: 160, priceLabel: 'per athlete', date: 'Sat–Sun, April 5–6, 2026', dateShort: 'Apr 5–6', time: '9:00 AM – 12:00 PM', duration: '3 hrs/day', location: 'Centre Sportif, 1000 Rue St-Antoine, Montréal QC', spotsTotal: 12, spotsLeft: 3, description: 'Intensive weekend for AAA players. Advanced puck handling, shooting, and game situations.', status: 'live', createdAt: '2026-03-01' },
  { id: 'kt-edge-work', coachId: 'kayla-tutino', title: 'Edge Work Clinic', sport: 'Hockey', level: 'A/AA', ageRange: '6–12', sessionType: 'Single', price: 95, priceLabel: 'per athlete', date: 'Sunday, March 30, 2026', dateShort: 'Sun Mar 30', time: '10:00 AM – 11:30 AM', duration: '90 min', location: 'Aréna de Montréal, 4545 Av. Pierre-De Coubertin, Montréal QC', spotsTotal: 10, spotsLeft: 4, description: 'Deep-dive into inside and outside edges, crossover technique, and lateral agility.', status: 'live', createdAt: '2026-03-01' },
  { id: 'kt-private', coachId: 'kayla-tutino', title: 'Private Skating Session', sport: 'Hockey', level: 'All levels', ageRange: '6–16', sessionType: 'Private', price: 120, priceLabel: 'per session', date: 'Flexible — contact coach', dateShort: 'Flexible', time: '45 min · Your preferred time', duration: '45 min', location: 'TBD', spotsTotal: 1, spotsLeft: null, description: 'One-on-one skating session tailored to individual needs. Video analysis included.', status: 'live', createdAt: '2026-03-01' },
  { id: 'ml-aaa-skate', coachId: 'martin-lee', title: 'AAA Power Skating', sport: 'Hockey', level: 'AAA', ageRange: '10–16', sessionType: 'Single', price: 75, priceLabel: 'per athlete', date: 'Friday, March 28, 2026', dateShort: 'Fri Mar 28', time: '7:00 PM – 8:30 PM', duration: '90 min', location: 'Aréna de Brossard, 3905 Blvd de Rome, Brossard QC', spotsTotal: 14, spotsLeft: 6, description: 'AAA-level power skating with focus on stride mechanics and speed.', status: 'live', createdAt: '2026-03-01' },
  { id: 'ml-game-iq', coachId: 'martin-lee', title: 'Game IQ Workshop', sport: 'Hockey', level: 'AA/AAA', ageRange: '12–17', sessionType: 'Single', price: 70, priceLabel: 'per athlete', date: 'Saturday, April 5, 2026', dateShort: 'Sat Apr 5', time: '4:00 PM – 5:30 PM', duration: '90 min', location: 'Aréna de Brossard, 3905 Blvd de Rome, Brossard QC', spotsTotal: 12, spotsLeft: 8, description: 'Off-ice and on-ice session on positioning, reads, and in-game decision making.', status: 'live', createdAt: '2026-03-01' },
  { id: 'if-elite-skate', coachId: 'if-power-elite', title: 'Elite Power Skating', sport: 'Hockey', level: 'AAA', ageRange: '12–18', sessionType: 'Single', price: 110, priceLabel: 'per athlete', date: 'Saturday, March 29, 2026', dateShort: 'Sat Mar 29', time: '5:00 PM – 6:30 PM', duration: '90 min', location: 'Bell Sensplex, 1565 Maple Grove Rd, Ottawa ON', spotsTotal: 10, spotsLeft: 2, description: 'Precision blade technique and explosive speed development for elite players.', status: 'live', createdAt: '2026-03-01' },
  { id: 'if-spring-camp', coachId: 'if-power-elite', title: 'Spring Training Camp', sport: 'Hockey', level: 'AAA', ageRange: '10–18', sessionType: 'Camp (3 days)', price: 250, priceLabel: 'per athlete', date: 'Mon–Wed, April 7–9, 2026', dateShort: 'Apr 7–9', time: '10:00 AM – 1:00 PM', duration: '3 hrs/day', location: 'Bell Sensplex, 1565 Maple Grove Rd, Ottawa ON', spotsTotal: 16, spotsLeft: 7, description: 'Three-day spring training camp. Speed, agility, and game conditioning.', status: 'live', createdAt: '2026-03-01' },
];

/* ── Helpers ── */
function getStore(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStore(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ── Seed on first load ── */
function ensureSeeded() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('coacheasy_seeded')) return;

  const profiles = {};
  [TIM_TURK_PROFILE, ...BROWSE_COACHES].forEach((p) => {
    profiles[p.id] = p;
  });
  setStore(PROFILES_KEY, profiles);

  const sessions = {};
  [...TIM_TURK_SESSIONS, ...BROWSE_SESSIONS].forEach((s) => {
    sessions[s.id] = s;
  });
  setStore(SESSIONS_KEY, sessions);

  localStorage.setItem('coacheasy_seeded', 'true');
}

/* ── Public API ── */

export function getCoachProfile(coachId) {
  ensureSeeded();
  const profiles = getStore(PROFILES_KEY) || {};
  return profiles[coachId] || null;
}

export function saveCoachProfile(profile) {
  ensureSeeded();
  const profiles = getStore(PROFILES_KEY) || {};
  profiles[profile.id] = { ...profile, lastUpdated: new Date().toISOString() };
  setStore(PROFILES_KEY, profiles);
}

export function getAllCoachProfiles() {
  ensureSeeded();
  const profiles = getStore(PROFILES_KEY) || {};
  return Object.values(profiles);
}

export function getCoachSessions(coachId) {
  ensureSeeded();
  const sessions = getStore(SESSIONS_KEY) || {};
  return Object.values(sessions).filter((s) => s.coachId === coachId);
}

export function saveSession(session) {
  ensureSeeded();
  const sessions = getStore(SESSIONS_KEY) || {};
  sessions[session.id] = session;
  setStore(SESSIONS_KEY, sessions);
}

export function getCoachMedia(coachId) {
  ensureSeeded();
  const profile = getCoachProfile(coachId);
  return profile?.media || [];
}

export function saveCoachMedia(coachId, media) {
  ensureSeeded();
  const profiles = getStore(PROFILES_KEY) || {};
  if (profiles[coachId]) {
    profiles[coachId].media = media;
    profiles[coachId].lastUpdated = new Date().toISOString();
    setStore(PROFILES_KEY, profiles);
  }
}

/* ── Profile quality score ── */
export function calcProfileQuality(profile) {
  if (!profile) return 0;
  const fields = [
    profile.firstName, profile.lastName, profile.orgName, profile.city,
    profile.province, profile.sport, profile.phone, profile.email,
    profile.bio, profile.yearsExp,
  ];
  const optional = [
    profile.website, profile.instagram, profile.facebook, profile.tiktok,
    profile.youtube, profile.bioFr, profile.ageRange,
  ];
  const levelsFilled = profile.levels?.length > 0;
  const langFilled = profile.languages?.length > 0;
  const expertiseFilled = profile.expertise?.length > 0;
  const mediaFilled = profile.media?.length > 0;

  let score = 0;
  const total = fields.length + optional.length + 4; // +4 for arrays/media
  fields.forEach((f) => { if (f) score++; });
  optional.forEach((f) => { if (f) score++; });
  if (levelsFilled) score++;
  if (langFilled) score++;
  if (expertiseFilled) score++;
  if (mediaFilled) score++;

  return Math.round((score / total) * 100);
}
