import { json } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { getEffectiveEmailForUser } from '$lib/server/sync-clubs.js';
import { refreshClubFromApi, invalidateClubCache, invalidateLeaderCache, getLeaderClubsWithCache } from '$lib/server/club-cache.js';

export async function POST({ request, locals }) {
	if (!locals.userPublic) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const clubName = body.clubName;

	if (!clubName) {
		return json({ error: 'Missing clubName' }, { status: 400 });
	}

	const knex = getKnex();
	const user = await knex('users').where({ id: locals.userId }).first();
	const effectiveEmail = getEffectiveEmailForUser(user);

	await invalidateLeaderCache(effectiveEmail);
	const clubs = await getLeaderClubsWithCache(effectiveEmail);

	const club = clubs.find(c => c.name === clubName);
	if (!club) {
		return json({ error: 'Club not found or no access' }, { status: 403 });
	}

	try {
		await invalidateClubCache(clubName);
		const freshData = await refreshClubFromApi(clubName);

		return json({
			success: true,
			club: {
				name: clubName,
				level: freshData.level,
				ships: freshData.ships,
				members: freshData.members,
				joinCode: freshData.joinCode,
				location: freshData.location,
				cachedAt: new Date()
			}
		});
	} catch (error) {
		console.error('[API] Error refreshing club cache:', error);
		return json({ error: 'Failed to refresh club data' }, { status: 500 });
	}
}
