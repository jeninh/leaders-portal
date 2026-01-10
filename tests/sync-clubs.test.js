import { describe, it, expect } from 'vitest';

function getEffectiveEmailForUser(user) {
	if (user.provider === 'hackclub_auth' && user.hackclub_primary_email) {
		return user.hackclub_primary_email;
	}
	return user.email;
}

describe('sync-clubs', () => {
	describe('getEffectiveEmailForUser', () => {
		it('returns hackclub_primary_email when provider is hackclub_auth', () => {
			const user = {
				provider: 'hackclub_auth',
				email: 'oauth@example.com',
				hackclub_primary_email: 'primary@hackclub.com'
			};
			expect(getEffectiveEmailForUser(user)).toBe('primary@hackclub.com');
		});

		it('returns regular email when provider is not hackclub_auth', () => {
			const user = {
				provider: 'email',
				email: 'user@example.com',
				hackclub_primary_email: 'primary@hackclub.com'
			};
			expect(getEffectiveEmailForUser(user)).toBe('user@example.com');
		});

		it('returns regular email when hackclub_primary_email is missing', () => {
			const user = {
				provider: 'hackclub_auth',
				email: 'user@example.com'
			};
			expect(getEffectiveEmailForUser(user)).toBe('user@example.com');
		});

		it('returns regular email when hackclub_primary_email is null', () => {
			const user = {
				provider: 'hackclub_auth',
				email: 'user@example.com',
				hackclub_primary_email: null
			};
			expect(getEffectiveEmailForUser(user)).toBe('user@example.com');
		});

		it('returns regular email when hackclub_primary_email is empty string', () => {
			const user = {
				provider: 'hackclub_auth',
				email: 'user@example.com',
				hackclub_primary_email: ''
			};
			expect(getEffectiveEmailForUser(user)).toBe('user@example.com');
		});

		it('handles google provider correctly', () => {
			const user = {
				provider: 'google',
				email: 'google@gmail.com',
				hackclub_primary_email: 'ignored@hackclub.com'
			};
			expect(getEffectiveEmailForUser(user)).toBe('google@gmail.com');
		});

		it('handles user with only email field', () => {
			const user = {
				email: 'simple@example.com'
			};
			expect(getEffectiveEmailForUser(user)).toBe('simple@example.com');
		});
	});
});
