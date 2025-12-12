import { refreshAllStaleClubs } from './club-cache.js';

let schedulerInterval = null;
const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export function startCacheScheduler() {
	if (schedulerInterval) {
		console.log('[CacheScheduler] Scheduler already running');
		return;
	}

	console.log('[CacheScheduler] Starting hourly cache refresh scheduler');

	schedulerInterval = setInterval(async () => {
		console.log('[CacheScheduler] Running scheduled cache refresh');
		try {
			const refreshedCount = await refreshAllStaleClubs();
			console.log('[CacheScheduler] Refreshed', refreshedCount, 'stale clubs');
		} catch (error) {
			console.error('[CacheScheduler] Error during scheduled refresh:', error);
		}
	}, REFRESH_INTERVAL_MS);

	console.log('[CacheScheduler] Scheduler started, will refresh every hour');
}

export function stopCacheScheduler() {
	if (schedulerInterval) {
		clearInterval(schedulerInterval);
		schedulerInterval = null;
		console.log('[CacheScheduler] Scheduler stopped');
	}
}
