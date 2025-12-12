import { getLeaderClubsWithCache, getClubWithCache } from './club-cache.js';

export function getEffectiveEmailForUser(user) {
	if (user.provider === 'hackclub_auth' && user.hackclub_primary_email) {
		return user.hackclub_primary_email;
	}
	return user.email;
}

export async function getClubDataFromApi(clubName) {
	console.log('[SyncClubs] getClubDataFromApi called for:', clubName);
	const clubData = await getClubWithCache(clubName);
	console.log('[SyncClubs] Got club data, level:', clubData.level, 'ships count:', clubData.ships?.length);
	return clubData;
}

export async function getClubsForEmail(email) {
	console.log('[SyncClubs] getClubsForEmail called for email:', email);
	const clubs = await getLeaderClubsWithCache(email);
	console.log('[SyncClubs] Got', clubs.length, 'clubs for email');
	return clubs;
}
