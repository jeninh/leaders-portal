import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const CACHE_TTL_MS = 60 * 60 * 1000;

function isCacheStale(cachedAt) {
	if (!cachedAt) return true;
	const cacheTime = new Date(cachedAt).getTime();
	const now = Date.now();
	return now - cacheTime > CACHE_TTL_MS;
}

describe('club-cache', () => {
	describe('isCacheStale', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('returns true when cachedAt is null', () => {
			expect(isCacheStale(null)).toBe(true);
		});

		it('returns true when cachedAt is undefined', () => {
			expect(isCacheStale(undefined)).toBe(true);
		});

		it('returns false when cache is fresh (within 1 hour)', () => {
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);
			
			const cachedAt = new Date('2024-01-15T11:30:00Z');
			expect(isCacheStale(cachedAt)).toBe(false);
		});

		it('returns false when cache is exactly at the boundary', () => {
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);
			
			const cachedAt = new Date('2024-01-15T11:00:00Z');
			expect(isCacheStale(cachedAt)).toBe(false);
		});

		it('returns true when cache is older than 1 hour', () => {
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);
			
			const cachedAt = new Date('2024-01-15T10:59:59Z');
			expect(isCacheStale(cachedAt)).toBe(true);
		});

		it('returns true when cache is very old (1 day)', () => {
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);
			
			const cachedAt = new Date('2024-01-14T12:00:00Z');
			expect(isCacheStale(cachedAt)).toBe(true);
		});

		it('handles string date inputs', () => {
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);
			
			const cachedAt = '2024-01-15T11:30:00Z';
			expect(isCacheStale(cachedAt)).toBe(false);
		});

		it('handles ISO string dates from database', () => {
			const now = new Date('2024-01-15T12:00:00Z');
			vi.setSystemTime(now);
			
			const cachedAt = '2024-01-15T10:00:00.000Z';
			expect(isCacheStale(cachedAt)).toBe(true);
		});
	});
});
