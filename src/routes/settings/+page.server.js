import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.userId) {
		throw redirect(302, '/email-login');
	}

	return {
		user: locals.userPublic
	};
}
