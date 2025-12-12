import { json } from '@sveltejs/kit';
import { getClubAmbassador } from '$lib/server/clubapi.js';

export async function GET({ url, locals }) {
	if (!locals.userPublic) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const clubName = url.searchParams.get('club_name');
	if (!clubName) {
		return json({ error: 'Missing club_name parameter' }, { status: 400 });
	}

	const ambassador = await getClubAmbassador(clubName);
	if (!ambassador) {
		return json({ error: 'Ambassador not found' }, { status: 404 });
	}

	return json(ambassador);
}
