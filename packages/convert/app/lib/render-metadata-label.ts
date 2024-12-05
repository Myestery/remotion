import {MetadataEntry} from '@remotion/media-parser';

/* eslint-disable complexity */
export const renderMetadataLabel = (key: string) => {
	if (key === 'com.apple.quicktime.location.accuracy.horizontal') {
		return 'Location Accuracy (Horizontal)';
	}

	if (key === 'artist') {
		return 'Artist';
	}

	if (key === 'album') {
		return 'Album';
	}

	if (key === 'composer') {
		return 'Composer';
	}

	if (key === 'comment') {
		return 'Comment';
	}

	if (key === 'releaseDate') {
		return 'Release Date';
	}

	if (key === 'genre') {
		return 'Genre';
	}

	if (key === 'title') {
		return 'Title';
	}

	if (key === 'writer') {
		return 'Writer';
	}

	if (key === 'director') {
		return 'Director';
	}

	if (key === 'producer') {
		return 'Producer';
	}

	if (key === 'description') {
		return 'Description';
	}

	if (key === 'duration') {
		return 'Metadata Duration';
	}

	if (key === 'encoder') {
		return 'Encoder';
	}

	if (key === 'copyright') {
		return 'Copyright';
	}

	if (key === 'major_brand') {
		return 'Major Brand';
	}

	if (key === 'minor_version') {
		return 'Minor Version';
	}

	if (key === 'compatible_brands') {
		return 'Compatible Brands';
	}

	if (key === 'handler_name') {
		return 'Handler';
	}

	if (key === 'com.apple.quicktime.camera.focal_length.35mm_equivalent') {
		return '35mm-equivalent focal length';
	}

	if (key === 'com.apple.quicktime.camera.lens_model') {
		return 'Lens';
	}

	if (key === 'com.apple.quicktime.creationdate') {
		return 'Created';
	}

	if (key === 'com.apple.quicktime.software') {
		return 'OS Device Version';
	}

	if (key === 'com.apple.quicktime.model') {
		return 'Device';
	}

	if (key === 'com.apple.quicktime.make') {
		return 'Manufacturer';
	}

	if (key === 'com.apple.quicktime.live-photo.vitality-score') {
		return 'Live Photo Vitality Score';
	}

	if (key === 'com.apple.quicktime.live-photo.vitality-scoring-version') {
		return 'Live Photo Vitality Scoring Version';
	}

	if (key === 'com.apple.quicktime.content.identifier') {
		return 'Identifier';
	}

	if (key === 'com.apple.quicktime.full-frame-rate-playback-intent') {
		return 'Should play at full frame rate';
	}

	if (key === 'com.apple.quicktime.information') {
		return 'Information';
	}

	if (key === 'com.apple.quicktime.location.ISO6709') {
		return 'Location';
	}

	if (key === 'com.apple.quicktime.live-photo.auto') {
		return 'Live Photo Auto Mode';
	}

	return key;
};

export const sortMetadataByRelevance = (metadata: MetadataEntry[]) => {
	const metadataKeys = [
		// General metadata sorted by relevance
		'title',
		'artist',
		'album',
		'releaseDate',
		'genre',
		'composer',
		'writer',
		'director',
		'producer',
		'description',
		'duration',
		'comment',
		'encoder',
		'copyright',

		// Apple-specific metadata sorted by relevance
		'com.apple.quicktime.creationdate', // Relevant: useful for sorting by creation date
		'com.apple.quicktime.make', // Relevant: manufacturer information
		'com.apple.quicktime.model', // Relevant: device information can be interesting
		'com.apple.quicktime.camera.lens_model', // Relevant: for photography enthusiasts
		'com.apple.quicktime.camera.focal_length.35mm_equivalent', // Relevant: for photography enthusiasts
		'com.apple.quicktime.software', // Less relevant: technical detail
		'com.apple.quicktime.location.ISO6709', // Relevant: location information can be useful
		'com.apple.quicktime.location.accuracy.horizontal', // Relevant: complements location data
		'com.apple.quicktime.content.identifier', // Less relevant: unique identifier
		'com.apple.quicktime.information', // Less relevant: technical detail
		'com.apple.quicktime.live-photo.vitality-score', // Less relevant: specific to live photos
		'com.apple.quicktime.live-photo.vitality-scoring-version', // Less relevant: specific to live photos
		'com.apple.quicktime.live-photo.auto', // Less relevant: specific to live photos
		'com.apple.quicktime.full-frame-rate-playback-intent', // Less relevant: playback detail
		'major_brand',
		'minor_version',
		'compatible_brands',
		'handler_name',
	];

	return metadata.slice().sort((a, b) => {
		const aIndex = metadataKeys.indexOf(a.key);
		const bIndex = metadataKeys.indexOf(b.key);

		if (aIndex === -1 && bIndex === -1) {
			return a.key.localeCompare(b.key);
		}

		if (aIndex === -1) {
			return 1;
		}

		if (bIndex === -1) {
			return -1;
		}

		return aIndex - bIndex;
	});
};

function displayLocationData(locationString: string): string {
	// Regular expression to match the pattern of the location string
	const locationPattern = /^([+-]\d+\.\d+)([+-]\d+\.\d+)\/(\d+)?$/;
	const match = locationString.match(locationPattern);

	if (!match) {
		throw new Error('Invalid location format');
	}

	// Extract latitude, longitude, and altitude
	const latitude = parseFloat(match[1]);
	const longitude = parseFloat(match[2]);
	const altitude = parseFloat(match[3]);

	// Format the output
	return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°\nAltitude ${altitude.toFixed(2)}m`;
}

function formatDateString(dateString: string): string {
	// Parse the date string into a Date object
	const date = new Date(dateString);

	// Define the options for formatting the date
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short', // This includes the timezone
		hour12: false, // Use 24-hour format
	};

	// Create a DateTimeFormat object for the user's locale
	const formatter = new Intl.DateTimeFormat('en-CH', options);

	// Format the date
	return formatter.format(date);
}

export const renderMetadataValue = (key: string, value: string | number) => {
	if (key === 'com.apple.quicktime.location.ISO6709') {
		return displayLocationData(String(value));
	}
	if (key === 'com.apple.quicktime.creationdate') {
		return formatDateString(String(value));
	}
	if (key === 'com.apple.quicktime.camera.focal_length.35mm_equivalent') {
		return String(value) + 'mm';
	}

	return value;
};