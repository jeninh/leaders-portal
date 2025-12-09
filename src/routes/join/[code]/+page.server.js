import { error } from '@sveltejs/kit';
import { getClubByCode } from '$lib/server/clubapi.js';

export async function load({ params }) {
	const { code } = params;
	const club = await getClubByCode(code);
	const clubName = club?.fields?.club_name || club?.club_name;
	
	if (!clubName) {
		throw error(404, 'Club not found');
	}
	
	return {
		code,
		clubName
	};
}
