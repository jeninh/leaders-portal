import { redirect } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { getEffectiveEmail } from '$lib/server/auth/users.js';
import { getLeaderProfile } from '$lib/server/airtable.js';

export async function load({ locals }) {
	if (!locals.userId) {
		throw redirect(302, '/email-login');
	}

	const knex = getKnex();
	const email = await getEffectiveEmail(knex, locals.userId);
	
	let leaderProfile = null;
	if (email) {
		try {
			leaderProfile = await getLeaderProfile(email);
		} catch (err) {
			console.error('Error loading leader profile:', err);
		}
	}

	return {
		user: locals.userPublic,
		leaderProfile
	};
}
