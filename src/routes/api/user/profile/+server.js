import { json, error } from '@sveltejs/kit';
import { getEffectiveEmail } from '$lib/server/auth/users.js';
import { getKnex } from '$lib/server/db/knex.js';
import { getLeaderProfile, updateLeaderProfile } from '$lib/server/airtable.js';

export const GET = async ({ locals }) => {
	if (!locals.userId) {
		throw error(401, 'Unauthorized');
	}

	try {
		const knex = getKnex();
		const email = await getEffectiveEmail(knex, locals.userId);
		
		if (!email) {
			throw error(400, 'No email associated with account');
		}

		const profile = await getLeaderProfile(email);
		
		if (!profile) {
			throw error(404, 'Leader profile not found');
		}

		return json({ profile });
	} catch (err) {
		if (err.status) throw err;
		console.error('Error fetching leader profile:', err);
		throw error(500, 'Failed to fetch leader profile');
	}
};

const ALLOWED_UPDATE_FIELDS = new Set([
	'first_name',
	'last_name',
	'pronouns',
	'gender',
	'phone_number',
	'address_line_1',
	'address_line_2',
	'address_city',
	'address_state',
	'address_country',
	'address_zip_code',
	'link_github',
	'link_personal_website',
	'link_social_media'
]);

export const POST = async ({ locals, request }) => {
	if (!locals.userId) {
		throw error(401, 'Unauthorized');
	}

	let body;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	if (!body || typeof body !== 'object') {
		throw error(400, 'Request body must be an object');
	}

	const updates = {};
	for (const [key, value] of Object.entries(body)) {
		if (ALLOWED_UPDATE_FIELDS.has(key)) {
			updates[key] = value;
		}
	}

	if (Object.keys(updates).length === 0) {
		throw error(400, 'No valid fields to update');
	}

	try {
		const knex = getKnex();
		const email = await getEffectiveEmail(knex, locals.userId);
		
		if (!email) {
			throw error(400, 'No email associated with account');
		}

		const result = await updateLeaderProfile(email, updates);
		return json(result);
	} catch (err) {
		if (err.status) throw err;
		console.error('Error updating leader profile:', err);
		
		if (err.message.includes('not found')) {
			throw error(404, 'Leader profile not found');
		}
		if (err.message.includes('Invalid')) {
			throw error(400, err.message);
		}
		
		throw error(500, 'Failed to update leader profile');
	}
};
