import { error } from '@sveltejs/kit';
import { getMemberByCode, deleteMember } from '$lib/server/clubapi.js';

export async function load({ params }) {
	const { code } = params;
	const member = await getMemberByCode(code);
	
	if (!member || member.error) {
		throw error(404, 'Member not found');
	}
	
	return {
		code,
		memberName: member.name,
		clubName: Array.isArray(member.club_name) ? member.club_name[0] : member.club_name,
		email: member.email
	};
}

export const actions = {
	default: async ({ params }) => {
		const { code } = params;
		const member = await getMemberByCode(code);
		
		if (!member || member.error) {
			return { success: false, error: 'Member not found' };
		}
		
		try {
			const clubName = Array.isArray(member.club_name) ? member.club_name[0] : member.club_name;
			await deleteMember(member.name, clubName);
			return { success: true };
		} catch (err) {
			console.error('Error deleting member:', err);
			return { success: false, error: 'Failed to leave club' };
		}
	}
};
