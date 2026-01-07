import Airtable from 'airtable';
import { env } from '$env/dynamic/private';

export { checkLeaderEmail, getClubsForLeaderEmail as getClubsForLeader } from './clubapi.js';

function getAirtableBase() {
	if (!env.AIRTABLE_API_KEY) {
		throw new Error("Missing AIRTABLE_API_KEY");
	}
	if (!env.AIRTABLE_BASE_ID) {
		throw new Error("Missing AIRTABLE_BASE_ID");
	}
	return new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);
}

export async function getMapOptOut(clubName) {
	const base = getAirtableBase();
	
	try {
		const records = await base('Clubs').select({
			filterByFormula: `{club_name} = "${clubName}"`,
			maxRecords: 1
		}).firstPage();

		if (records.length === 0) {
			return null;
		}

		const record = records[0];
		const venueLat = record.get('venue_lat');
		const venueLng = record.get('venue_lng');
		const venueFuzz = record.get('venue_fuzz');
		return {
			optedOut: !!record.get('map-opt-out'),
			hasLocation: venueLat !== undefined && venueLat !== null,
			venueLat: venueLat ? String(venueLat) : null,
			venueLng: venueLng ? String(venueLng) : null,
			venueFuzz: venueFuzz ?? 0
		};
	} catch (error) {
		console.error('Error getting map-opt-out from Airtable:', error);
		return null;
	}
}

export async function toggleMapOptOut(clubName) {
	const base = getAirtableBase();
	
	try {
		const records = await base('Clubs').select({
			filterByFormula: `{club_name} = "${clubName}"`,
			maxRecords: 1
		}).firstPage();

		if (records.length === 0) {
			throw new Error("Club not found in Airtable");
		}

		const currentValue = !!records[0].get('map-opt-out');
		const newValue = !currentValue;

		await base('Clubs').update(records[0].id, {
			'map-opt-out': newValue
		});
		
		console.log(`Set map-opt-out to ${newValue} for club: ${clubName}`);
		return { optedOut: newValue };
	} catch (error) {
		console.error('Error toggling map-opt-out in Airtable:', error);
		throw new Error("Failed to update map opt-out setting");
	}
}

export async function optInToMap(clubName, latitude, longitude) {
	const base = getAirtableBase();
	
	try {
		const records = await base('Clubs').select({
			filterByFormula: `{club_name} = "${clubName}"`,
			maxRecords: 1
		}).firstPage();

		if (records.length === 0) {
			throw new Error("Club not found in Airtable");
		}

		await base('Clubs').update(records[0].id, {
			'map-opt-out': false,
			'venue_lat': String(latitude),
			'venue_lng': String(longitude)
		});
		
		console.log(`Opted in club ${clubName} to map with lat: ${latitude}, lng: ${longitude}`);
		return { optedOut: false, hasLocation: true };
	} catch (error) {
		console.error('Error opting in to map in Airtable:', error);
		throw new Error("Failed to opt in to map");
	}
}

export async function updateMapSettings(clubName, { optedOut, latitude, longitude, fuzz }) {
	const base = getAirtableBase();
	
	try {
		const records = await base('Clubs').select({
			filterByFormula: `{club_name} = "${clubName}"`,
			maxRecords: 1
		}).firstPage();

		if (records.length === 0) {
			throw new Error("Club not found in Airtable");
		}

		const updateData = {
			'map-opt-out': optedOut
		};

		if (latitude !== undefined && longitude !== undefined) {
			updateData['venue_lat'] = String(latitude);
			updateData['venue_lng'] = String(longitude);
		}

		if (fuzz !== undefined) {
			updateData['venue_fuzz'] = fuzz;
		}

		await base('Clubs').update(records[0].id, updateData);
		
		console.log(`Updated map settings for club ${clubName}:`, updateData);
		return { 
			optedOut, 
			hasLocation: latitude !== undefined && longitude !== undefined,
			venueLat: latitude ? String(latitude) : null,
			venueLng: longitude ? String(longitude) : null,
			venueFuzz: fuzz ?? 0
		};
	} catch (error) {
		console.error('Error updating map settings in Airtable:', error);
		throw new Error("Failed to update map settings");
	}
}
