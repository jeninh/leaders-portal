import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_IP = 10;
const MAX_ATTEMPTS_EMAIL = 5;
const BLOCK_DURATION_MS = 30 * 60 * 1000;

const mockDb = new Map();

function checkRateLimit(key, maxAttempts) {
	const now = new Date();
	const record = mockDb.get(key);

	if (!record) {
		return { allowed: true, remaining: maxAttempts - 1 };
	}

	if (record.blocked_until && new Date(record.blocked_until) > now) {
		const retryAfter = Math.ceil((new Date(record.blocked_until) - now) / 1000);
		return { allowed: false, blocked: true, retryAfter };
	}

	const windowStart = new Date(record.window_start);
	const windowExpired = now - windowStart > WINDOW_MS;

	if (windowExpired) {
		return { allowed: true, remaining: maxAttempts - 1 };
	}

	if (record.attempts >= maxAttempts) {
		return { allowed: false, blocked: false, remaining: 0 };
	}

	return { allowed: true, remaining: maxAttempts - record.attempts - 1 };
}

function recordAttempt(key, maxAttempts) {
	const now = new Date();
	const record = mockDb.get(key);

	if (!record) {
		mockDb.set(key, {
			key,
			attempts: 1,
			window_start: now,
			updated_at: now
		});
		return { blocked: false };
	}

	const windowStart = new Date(record.window_start);
	const windowExpired = now - windowStart > WINDOW_MS;

	if (windowExpired) {
		mockDb.set(key, {
			key,
			attempts: 1,
			window_start: now,
			blocked_until: null,
			updated_at: now
		});
		return { blocked: false };
	}

	const newAttempts = record.attempts + 1;

	if (newAttempts >= maxAttempts) {
		const blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MS);
		mockDb.set(key, {
			...record,
			attempts: newAttempts,
			blocked_until: blockedUntil,
			updated_at: now
		});
		return { blocked: true, blockedUntil };
	}

	mockDb.set(key, {
		...record,
		attempts: newAttempts,
		updated_at: now
	});

	return { blocked: false };
}

describe('rate-limit', () => {
	beforeEach(() => {
		mockDb.clear();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('checkRateLimit', () => {
		it('allows first request when no record exists', () => {
			const result = checkRateLimit('ip:192.168.1.1', MAX_ATTEMPTS_IP);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(MAX_ATTEMPTS_IP - 1);
		});

		it('allows requests within limit', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: 5,
				window_start: now,
				updated_at: now
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_IP);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(MAX_ATTEMPTS_IP - 5 - 1);
		});

		it('denies requests at limit', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: MAX_ATTEMPTS_IP,
				window_start: now,
				updated_at: now
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_IP);
			expect(result.allowed).toBe(false);
			expect(result.remaining).toBe(0);
		});

		it('allows requests after window expires', () => {
			const key = 'ip:192.168.1.1';
			const windowStart = new Date('2024-01-15T11:00:00Z');
			const now = new Date('2024-01-15T11:20:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: MAX_ATTEMPTS_IP,
				window_start: windowStart,
				updated_at: windowStart
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_IP);
			expect(result.allowed).toBe(true);
		});

		it('blocks requests when blocked_until is in future', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			const blockedUntil = new Date('2024-01-15T12:30:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: MAX_ATTEMPTS_IP,
				window_start: now,
				blocked_until: blockedUntil,
				updated_at: now
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_IP);
			expect(result.allowed).toBe(false);
			expect(result.blocked).toBe(true);
			expect(result.retryAfter).toBe(1800);
		});
	});

	describe('recordAttempt', () => {
		it('creates new record for first attempt', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			const result = recordAttempt(key, MAX_ATTEMPTS_IP);
			expect(result.blocked).toBe(false);
			expect(mockDb.get(key).attempts).toBe(1);
		});

		it('increments attempts for existing record', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: 3,
				window_start: now,
				updated_at: now
			});

			const result = recordAttempt(key, MAX_ATTEMPTS_IP);
			expect(result.blocked).toBe(false);
			expect(mockDb.get(key).attempts).toBe(4);
		});

		it('blocks when reaching max attempts', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: MAX_ATTEMPTS_IP - 1,
				window_start: now,
				updated_at: now
			});

			const result = recordAttempt(key, MAX_ATTEMPTS_IP);
			expect(result.blocked).toBe(true);
			expect(result.blockedUntil).toBeDefined();
		});

		it('resets window after expiration', () => {
			const key = 'ip:192.168.1.1';
			const windowStart = new Date('2024-01-15T11:00:00Z');
			const now = new Date('2024-01-15T11:20:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: MAX_ATTEMPTS_IP,
				window_start: windowStart,
				updated_at: windowStart
			});

			const result = recordAttempt(key, MAX_ATTEMPTS_IP);
			expect(result.blocked).toBe(false);
			expect(mockDb.get(key).attempts).toBe(1);
		});
	});

	describe('IP rate limiting', () => {
		it('uses correct max attempts for IP (10)', () => {
			const key = 'ip:192.168.1.1';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: 9,
				window_start: now,
				updated_at: now
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_IP);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(0);
		});
	});

	describe('Email rate limiting', () => {
		it('uses correct max attempts for email (5)', () => {
			const key = 'email:test@example.com';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: 4,
				window_start: now,
				updated_at: now
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_EMAIL);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(0);
		});

		it('blocks email after 5 attempts', () => {
			const key = 'email:test@example.com';
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);

			mockDb.set(key, {
				key,
				attempts: MAX_ATTEMPTS_EMAIL,
				window_start: now,
				updated_at: now
			});

			const result = checkRateLimit(key, MAX_ATTEMPTS_EMAIL);
			expect(result.allowed).toBe(false);
		});
	});
});
