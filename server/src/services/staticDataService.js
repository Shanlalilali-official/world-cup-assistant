/**
 * Complete static data for 2026 FIFA World Cup
 * — All 48 teams with CN/EN names
 * — Full 104-match schedule (72 group + 32 knockout)
 * — Empty standings for 12 groups
 * — Venue information
 *
 * Used as fallback when no live API data, and as the primary source
 * for team names, flags, and translations.
 */

// ========== TEAMS: 48 teams with bilingual names and group assignment ==========
const TEAMS = {
  MEX: { code: 'MEX', nameEn: 'Mexico', nameZh: '墨西哥', group: 'A', flag: '🇲🇽', fifaRank: 15 },
  RSA: { code: 'RSA', nameEn: 'South Africa', nameZh: '南非', group: 'A', flag: '🇿🇦', fifaRank: 58 },
  KOR: { code: 'KOR', nameEn: 'South Korea', nameZh: '韩国', group: 'A', flag: '🇰🇷', fifaRank: 22 },
  CZE: { code: 'CZE', nameEn: 'Czechia', nameZh: '捷克', group: 'A', flag: '🇨🇿', fifaRank: 36 },
  CAN: { code: 'CAN', nameEn: 'Canada', nameZh: '加拿大', group: 'B', flag: '🇨🇦', fifaRank: 31 },
  BIH: { code: 'BIH', nameEn: 'Bosnia & Herzegovina', nameZh: '波黑', group: 'B', flag: '🇧🇦', fifaRank: 39 },
  QAT: { code: 'QAT', nameEn: 'Qatar', nameZh: '卡塔尔', group: 'B', flag: '🇶🇦', fifaRank: 48 },
  SUI: { code: 'SUI', nameEn: 'Switzerland', nameZh: '瑞士', group: 'B', flag: '🇨🇭', fifaRank: 17 },
  BRA: { code: 'BRA', nameEn: 'Brazil', nameZh: '巴西', group: 'C', flag: '🇧🇷', fifaRank: 3 },
  MAR: { code: 'MAR', nameEn: 'Morocco', nameZh: '摩洛哥', group: 'C', flag: '🇲🇦', fifaRank: 12 },
  HAI: { code: 'HAI', nameEn: 'Haiti', nameZh: '海地', group: 'C', flag: '🇭🇹', fifaRank: 86 },
  SCO: { code: 'SCO', nameEn: 'Scotland', nameZh: '苏格兰', group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fifaRank: 30 },
  USA: { code: 'USA', nameEn: 'United States', nameZh: '美国', group: 'D', flag: '🇺🇸', fifaRank: 14 },
  PAR: { code: 'PAR', nameEn: 'Paraguay', nameZh: '巴拉圭', group: 'D', flag: '🇵🇾', fifaRank: 49 },
  AUS: { code: 'AUS', nameEn: 'Australia', nameZh: '澳大利亚', group: 'D', flag: '🇦🇺', fifaRank: 24 },
  TUR: { code: 'TUR', nameEn: 'Türkiye', nameZh: '土耳其', group: 'D', flag: '🇹🇷', fifaRank: 28 },
  GER: { code: 'GER', nameEn: 'Germany', nameZh: '德国', group: 'E', flag: '🇩🇪', fifaRank: 10 },
  CUW: { code: 'CUW', nameEn: 'Curaçao', nameZh: '库拉索', group: 'E', flag: '🇨🇼', fifaRank: 91 },
  CIV: { code: 'CIV', nameEn: 'Ivory Coast', nameZh: '科特迪瓦', group: 'E', flag: '🇨🇮', fifaRank: 33 },
  ECU: { code: 'ECU', nameEn: 'Ecuador', nameZh: '厄瓜多尔', group: 'E', flag: '🇪🇨', fifaRank: 26 },
  NED: { code: 'NED', nameEn: 'Netherlands', nameZh: '荷兰', group: 'F', flag: '🇳🇱', fifaRank: 7 },
  JPN: { code: 'JPN', nameEn: 'Japan', nameZh: '日本', group: 'F', flag: '🇯🇵', fifaRank: 16 },
  SWE: { code: 'SWE', nameEn: 'Sweden', nameZh: '瑞典', group: 'F', flag: '🇸🇪', fifaRank: 27 },
  TUN: { code: 'TUN', nameEn: 'Tunisia', nameZh: '突尼斯', group: 'F', flag: '🇹🇳', fifaRank: 41 },
  BEL: { code: 'BEL', nameEn: 'Belgium', nameZh: '比利时', group: 'G', flag: '🇧🇪', fifaRank: 6 },
  EGY: { code: 'EGY', nameEn: 'Egypt', nameZh: '埃及', group: 'G', flag: '🇪🇬', fifaRank: 32 },
  IRN: { code: 'IRN', nameEn: 'Iran', nameZh: '伊朗', group: 'G', flag: '🇮🇷', fifaRank: 20 },
  NZL: { code: 'NZL', nameEn: 'New Zealand', nameZh: '新西兰', group: 'G', flag: '🇳🇿', fifaRank: 95 },
  ESP: { code: 'ESP', nameEn: 'Spain', nameZh: '西班牙', group: 'H', flag: '🇪🇸', fifaRank: 2 },
  CPV: { code: 'CPV', nameEn: 'Cape Verde', nameZh: '佛得角', group: 'H', flag: '🇨🇻', fifaRank: 64 },
  KSA: { code: 'KSA', nameEn: 'Saudi Arabia', nameZh: '沙特阿拉伯', group: 'H', flag: '🇸🇦', fifaRank: 53 },
  URU: { code: 'URU', nameEn: 'Uruguay', nameZh: '乌拉圭', group: 'H', flag: '🇺🇾', fifaRank: 13 },
  FRA: { code: 'FRA', nameEn: 'France', nameZh: '法国', group: 'I', flag: '🇫🇷', fifaRank: 1 },
  SEN: { code: 'SEN', nameEn: 'Senegal', nameZh: '塞内加尔', group: 'I', flag: '🇸🇳', fifaRank: 19 },
  IRQ: { code: 'IRQ', nameEn: 'Iraq', nameZh: '伊拉克', group: 'I', flag: '🇮🇶', fifaRank: 56 },
  NOR: { code: 'NOR', nameEn: 'Norway', nameZh: '挪威', group: 'I', flag: '🇳🇴', fifaRank: 11 },
  ARG: { code: 'ARG', nameEn: 'Argentina', nameZh: '阿根廷', group: 'J', flag: '🇦🇷', fifaRank: 4 },
  ALG: { code: 'ALG', nameEn: 'Algeria', nameZh: '阿尔及利亚', group: 'J', flag: '🇩🇿', fifaRank: 38 },
  AUT: { code: 'AUT', nameEn: 'Austria', nameZh: '奥地利', group: 'J', flag: '🇦🇹', fifaRank: 25 },
  JOR: { code: 'JOR', nameEn: 'Jordan', nameZh: '约旦', group: 'J', flag: '🇯🇴', fifaRank: 71 },
  POR: { code: 'POR', nameEn: 'Portugal', nameZh: '葡萄牙', group: 'K', flag: '🇵🇹', fifaRank: 5 },
  COD: { code: 'COD', nameEn: 'DR Congo', nameZh: '刚果(金)', group: 'K', flag: '🇨🇩', fifaRank: 60 },
  UZB: { code: 'UZB', nameEn: 'Uzbekistan', nameZh: '乌兹别克斯坦', group: 'K', flag: '🇺🇿', fifaRank: 54 },
  COL: { code: 'COL', nameEn: 'Colombia', nameZh: '哥伦比亚', group: 'K', flag: '🇨🇴', fifaRank: 9 },
  ENG: { code: 'ENG', nameEn: 'England', nameZh: '英格兰', group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaRank: 8 },
  CRO: { code: 'CRO', nameEn: 'Croatia', nameZh: '克罗地亚', group: 'L', flag: '🇭🇷', fifaRank: 18 },
  GHA: { code: 'GHA', nameEn: 'Ghana', nameZh: '加纳', group: 'L', flag: '🇬🇭', fifaRank: 59 },
  PAN: { code: 'PAN', nameEn: 'Panama', nameZh: '巴拿马', group: 'L', flag: '🇵🇦', fifaRank: 67 },
};

// ========== GROUPS ==========
const GROUPS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COD', 'UZB', 'COL'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
};

// ========== FULL GROUP STAGE SCHEDULE (72 matches) ==========
// June 11 - June 27. Each group: 4 teams, round-robin = 6 matches
// Match dates spread across group stage window
function generateGroupSchedule() {
  const schedule = [];
  let matchId = 1;
  const groupNames = Object.keys(GROUPS);

  // Schedule pattern: spread group matches across June 11-27
  const groupDates = [];
  const startDate = new Date('2026-06-11');
  const endDate = new Date('2026-06-27');
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    groupDates.push(new Date(d));
  }

  // Each group has 6 matches, distribute across dates
  const allGroupMatches = [];
  groupNames.forEach((groupName, gi) => {
    const teams = GROUPS[groupName];
    // Round-robin pairings
    const pairings = [
      [0, 1], [2, 3], // Matchday 1
      [0, 2], [1, 3], // Matchday 2
      [0, 3], [1, 2], // Matchday 3
    ];
    pairings.forEach(([h, a], pi) => {
      allGroupMatches.push({ group: groupName, home: teams[h], away: teams[a], matchday: pi < 2 ? 1 : pi < 4 ? 2 : 3 });
    });
  });

  // Assign dates — roughly 3-4 matches per day, 17 days for 72 matches ≈ 4.2 matches/day
  // Days 1-3 (June 11-13): opening round
  // Days 4-8 (June 14-18): second round
  // Days 9-12 (June 19-22): third round
  // Simultaneous final group matches: June 23-27
  const timeSlots = ['13:00', '16:00', '19:00', '22:00']; // local time slots

  const venuesPool = [
    { name: 'Estadio Azteca', city: 'Mexico City' },
    { name: 'Estadio BBVA', city: 'Monterrey' },
    { name: 'Estadio Akron', city: 'Guadalajara' },
    { name: 'BMO Field', city: 'Toronto' },
    { name: 'BC Place', city: 'Vancouver' },
    { name: 'MetLife Stadium', city: 'East Rutherford' },
    { name: 'SoFi Stadium', city: 'Los Angeles' },
    { name: 'AT&T Stadium', city: 'Dallas' },
    { name: 'Arrowhead Stadium', city: 'Kansas City' },
    { name: 'Mercedes-Benz Stadium', city: 'Atlanta' },
    { name: 'NRG Stadium', city: 'Houston' },
    { name: 'Lumen Field', city: 'Seattle' },
    { name: "Levi's Stadium", city: 'Santa Clara' },
    { name: 'Lincoln Financial Field', city: 'Philadelphia' },
    { name: 'Hard Rock Stadium', city: 'Miami' },
    { name: 'Gillette Stadium', city: 'Foxborough' },
  ];

  let venueIdx = 0;
  let dateIdx = 0;

  // Sort: matchday 1 first, then 2, then 3
  const sorted = [...allGroupMatches].sort((a, b) => a.matchday - b.matchday || a.group.localeCompare(b.group));

  sorted.forEach((m, i) => {
    const d = groupDates[Math.floor(i / 4) % groupDates.length];
    const timeSlot = timeSlots[i % timeSlots.length];
    const venue = venuesPool[venueIdx % venuesPool.length];
    venueIdx++;

    schedule.push({
      id: `G${matchId}`,
      status: 'SCHEDULED',
      startTime: `${d.toISOString().split('T')[0]}T${timeSlot}:00-06:00`,
      homeTeam: { name: TEAMS[m.home].nameEn, code: m.home, score: 0 },
      awayTeam: { name: TEAMS[m.away].nameEn, code: m.away, score: 0 },
      venue: `${venue.name}, ${venue.city}`,
      group: `Group ${m.group}`,
      stage: 'Group Stage',
      matchday: m.matchday,
    });
    matchId++;
  });

  return schedule;
}

// ========== KNOCKOUT STAGE (32 matches) ==========
function generateKnockoutSchedule() {
  const knockout = [];
  let kId = 101;

  // Round of 32: June 28 - July 3 (16 matches)
  const r32Dates = ['2026-06-28', '2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03'];
  for (let i = 0; i < 16; i++) {
    knockout.push({
      id: `K${kId++}`,
      status: 'SCHEDULED',
      startTime: `${r32Dates[i % 6]}T${i % 2 === 0 ? '16:00' : '20:00'}:00-06:00`,
      homeTeam: { name: 'TBD', code: 'TBD', score: 0 },
      awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
      venue: 'TBD',
      group: '',
      stage: 'Round of 32',
    });
  }

  // Round of 16: July 4-7 (8 matches)
  const r16Dates = ['2026-07-04', '2026-07-05', '2026-07-06', '2026-07-07'];
  for (let i = 0; i < 8; i++) {
    knockout.push({
      id: `K${kId++}`,
      status: 'SCHEDULED',
      startTime: `${r16Dates[i % 4]}T${i % 2 === 0 ? '16:00' : '20:00'}:00-06:00`,
      homeTeam: { name: 'TBD', code: 'TBD', score: 0 },
      awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
      venue: 'TBD',
      group: '',
      stage: 'Round of 16',
    });
  }

  // Quarter-finals: July 9-11 (4 matches)
  const qfDates = ['2026-07-09', '2026-07-10', '2026-07-11'];
  for (let i = 0; i < 4; i++) {
    knockout.push({
      id: `K${kId++}`,
      status: 'SCHEDULED',
      startTime: `${qfDates[i % 3]}T20:00:00-06:00`,
      homeTeam: { name: 'TBD', code: 'TBD', score: 0 },
      awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
      venue: ['SoFi Stadium, Los Angeles', 'AT&T Stadium, Dallas', 'MetLife Stadium, East Rutherford', 'Mercedes-Benz Stadium, Atlanta'][i],
      group: '',
      stage: 'Quarter-finals',
    });
  }

  // Semi-finals: July 14-15 (2 matches)
  knockout.push({
    id: `K${kId++}`, status: 'SCHEDULED', startTime: '2026-07-14T20:00:00-06:00',
    homeTeam: { name: 'TBD', code: 'TBD', score: 0 }, awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
    venue: 'AT&T Stadium, Dallas', group: '', stage: 'Semi-finals',
  });
  knockout.push({
    id: `K${kId++}`, status: 'SCHEDULED', startTime: '2026-07-15T20:00:00-06:00',
    homeTeam: { name: 'TBD', code: 'TBD', score: 0 }, awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
    venue: 'Mercedes-Benz Stadium, Atlanta', group: '', stage: 'Semi-finals',
  });

  // Third place: July 18
  knockout.push({
    id: `K${kId++}`, status: 'SCHEDULED', startTime: '2026-07-18T16:00:00-06:00',
    homeTeam: { name: 'TBD', code: 'TBD', score: 0 }, awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
    venue: 'Hard Rock Stadium, Miami', group: '', stage: 'Third Place',
  });

  // Final: July 19
  knockout.push({
    id: `K${kId++}`, status: 'SCHEDULED', startTime: '2026-07-19T15:00:00-06:00',
    homeTeam: { name: 'TBD', code: 'TBD', score: 0 }, awayTeam: { name: 'TBD', code: 'TBD', score: 0 },
    venue: 'MetLife Stadium, East Rutherford', group: '', stage: 'Final',
  });

  return knockout;
}

// ========== STATIC DATA API ==========
const staticDataService = {
  /** Get all teams with bilingual names */
  getTeams() {
    return TEAMS;
  },

  /** Get team info by code */
  getTeam(code) {
    return TEAMS[code?.toUpperCase()] || null;
  },

  /** Get all teams in a group */
  getGroupTeams(groupName) {
    const codes = GROUPS[groupName?.toUpperCase()];
    if (!codes) return [];
    return codes.map((c) => TEAMS[c]);
  },

  /** Get all groups */
  getGroups() {
    return Object.entries(GROUPS).map(([name, teams]) => ({
      name: `Group ${name}`,
      group: name,
      teams: teams.map((code) => TEAMS[code]),
    }));
  },

  /** Get full match schedule (group + knockout) */
  getFullSchedule() {
    const groupMatches = generateGroupSchedule();
    const knockoutMatches = generateKnockoutSchedule();
    return [...groupMatches, ...knockoutMatches];
  },

  /** Get matches for a specific date */
  getMatchesByDate(dateStr) {
    const all = this.getFullSchedule();
    return all.filter((m) => m.startTime?.startsWith(dateStr));
  },

  /** Get today's matches */
  getTodayMatches() {
    const today = new Date().toISOString().split('T')[0];
    return this.getMatchesByDate(today);
  },

  /** Get empty standings for all groups */
  getStandings() {
    return Object.entries(GROUPS).map(([name, codes]) => ({
      name: `Group ${name}`,
      group: name,
      teams: codes.map((code) => ({
        code,
        name: TEAMS[code].nameEn,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0,
      })),
    }));
  },

  /** Get static top scorers placeholder */
  getTopScorers() {
    return [];
  },

  /** Get match by ID */
  getMatchById(id) {
    const all = this.getFullSchedule();
    return all.find((m) => m.id === id) || null;
  },

  /** Get all venues */
  getVenues() {
    return [
      { city: 'Mexico City', cityZh: '墨西哥城', stadium: 'Estadio Azteca', stadiumZh: '阿兹特克体育场', country: 'Mexico', countryZh: '墨西哥' },
      { city: 'Monterrey', cityZh: '蒙特雷', stadium: 'Estadio BBVA', stadiumZh: 'BBVA体育场', country: 'Mexico', countryZh: '墨西哥' },
      { city: 'Guadalajara', cityZh: '瓜达拉哈拉', stadium: 'Estadio Akron', stadiumZh: '阿克伦体育场', country: 'Mexico', countryZh: '墨西哥' },
      { city: 'Toronto', cityZh: '多伦多', stadium: 'BMO Field', stadiumZh: 'BMO球场', country: 'Canada', countryZh: '加拿大' },
      { city: 'Vancouver', cityZh: '温哥华', stadium: 'BC Place', stadiumZh: 'BC广场', country: 'Canada', countryZh: '加拿大' },
      { city: 'East Rutherford', cityZh: '东卢瑟福', stadium: 'MetLife Stadium', stadiumZh: '大都会人寿体育场', country: 'USA', countryZh: '美国' },
      { city: 'Los Angeles', cityZh: '洛杉矶', stadium: 'SoFi Stadium', stadiumZh: 'SoFi体育场', country: 'USA', countryZh: '美国' },
      { city: 'Dallas', cityZh: '达拉斯', stadium: 'AT&T Stadium', stadiumZh: 'AT&T体育场', country: 'USA', countryZh: '美国' },
      { city: 'Kansas City', cityZh: '堪萨斯城', stadium: 'Arrowhead Stadium', stadiumZh: '箭头体育场', country: 'USA', countryZh: '美国' },
      { city: 'Atlanta', cityZh: '亚特兰大', stadium: 'Mercedes-Benz Stadium', stadiumZh: '梅赛德斯-奔驰体育场', country: 'USA', countryZh: '美国' },
      { city: 'Houston', cityZh: '休斯顿', stadium: 'NRG Stadium', stadiumZh: 'NRG体育场', country: 'USA', countryZh: '美国' },
      { city: 'Seattle', cityZh: '西雅图', stadium: 'Lumen Field', stadiumZh: '流明球场', country: 'USA', countryZh: '美国' },
      { city: 'Santa Clara', cityZh: '圣克拉拉', stadium: "Levi's Stadium", stadiumZh: '李维斯体育场', country: 'USA', countryZh: '美国' },
      { city: 'Philadelphia', cityZh: '费城', stadium: 'Lincoln Financial Field', stadiumZh: '林肯金融球场', country: 'USA', countryZh: '美国' },
      { city: 'Miami', cityZh: '迈阿密', stadium: 'Hard Rock Stadium', stadiumZh: '硬石体育场', country: 'USA', countryZh: '美国' },
      { city: 'Foxborough', cityZh: '福克斯堡', stadium: 'Gillette Stadium', stadiumZh: '吉列体育场', country: 'USA', countryZh: '美国' },
    ];
  },

  /** Get stage name translations */
  getStageNames() {
    return {
      'Group Stage': { en: 'Group Stage', zh: '小组赛' },
      'Round of 32': { en: 'Round of 32', zh: '32强赛' },
      'Round of 16': { en: 'Round of 16', zh: '16强赛' },
      'Quarter-finals': { en: 'Quarter-finals', zh: '四分之一决赛' },
      'Semi-finals': { en: 'Semi-finals', zh: '半决赛' },
      'Third Place': { en: 'Third Place', zh: '三四名决赛' },
      'Final': { en: 'Final', zh: '决赛' },
    };
  },
};

module.exports = staticDataService;
