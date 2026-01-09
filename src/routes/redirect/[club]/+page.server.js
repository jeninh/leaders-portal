import { error } from '@sveltejs/kit';
import { getClubWebsite } from '$lib/server/airtable.js';

export async function load({ params }) {
	const clubName = decodeURIComponent(params.club).replace(/-/g, ' ');
	
	const club = await getClubWebsite(clubName);
	
	if (!club) {
		throw error(404, 'Club not found');
	}
	
	if (!club.clubWebsite) {
		throw error(404, 'This club does not have a website configured');
	}
	
	return {
		clubName: club.clubName,
		clubWebsite: club.clubWebsite
	};
}
