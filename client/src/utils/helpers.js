import { TEAMS, STAGE_NAMES, VENUES, TOURNAMENT } from './constants';

/** Get team display name in the current language */
export function getTeamName(code, isZh = false) {
  const team = TEAMS[code?.toUpperCase()];
  if (!team) return '';
  return isZh ? team.nameZh : team.nameEn;
}

/** Get team by code */
export function getTeam(code) {
  return TEAMS[code?.toUpperCase()] || null;
}

/** Get team flag emoji — derived from TEAMS constant (single source of truth) */
export function getTeamFlag(code) {
  if (!code) return '🏳️';
  const team = TEAMS[code.toUpperCase()];
  return team?.flag || '🏳️';
}

/** Get stage name in the current language */
export function getStageName(stage, isZh = false) {
  const names = STAGE_NAMES[stage];
  if (!names) return stage;
  return isZh ? names.zh : names.en;
}

/** Get venue display info in the current language */
export function getVenueDisplay(venueStr, isZh = false) {
  if (!venueStr) return '';
  // venueStr format: "Stadium Name, City"
  const venue = VENUES.find((v) => venueStr.includes(v.stadium) || venueStr.includes(v.city));
  if (venue) {
    return isZh ? `${venue.stadiumZh}, ${venue.cityZh}` : `${venue.stadium}, ${venue.city}`;
  }
  return venueStr;
}

/** Get match status display text */
export function getMatchStatusDisplay(match, t) {
  const status = match?.status || 'SCHEDULED';
  if (status === 'LIVE' || status === 'IN_PLAY') {
    return match?.minute != null ? `${match.minute}'` : 'LIVE';
  }
  const key = `match.status.${status}`;
  return t ? t(key) : status;
}

/** Check if match is live */
export function isLive(match) {
  return match?.status === 'LIVE' || match?.status === 'IN_PLAY' || match?.status === 'HALFTIME';
}

/** Check if match is finished */
export function isFinished(match) {
  return match?.status === 'FINISHED' || match?.status === 'FT';
}

/** Format date to YYYY-MM-DD */
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/** Get today's date string YYYY-MM-DD */
export function getToday() {
  return new Date().toISOString().split('T')[0];
}

/** Generate an array of dates for the tournament */
export function getTournamentDates() {
  const dates = [];
  const start = new Date(TOURNAMENT.startDate);
  const end = new Date(TOURNAMENT.endDate);
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Format a match time for display */
export function formatMatchTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
