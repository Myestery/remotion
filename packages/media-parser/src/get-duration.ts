import {getSamplePositionsFromTrack} from './boxes/iso-base-media/get-sample-positions-from-track';
import type {TrakBox} from './boxes/iso-base-media/trak/trak';
import {
	getMoofBox,
	getMoovBox,
	getMvhdBox,
} from './boxes/iso-base-media/traversal';
import type {DurationSegment} from './boxes/webm/segments/all-segments';
import {getTracks} from './get-tracks';
import type {AnySegment, Structure} from './parse-result';
import type {ParserState} from './parser-state';

const getDurationFromMatroska = (segments: AnySegment[]): number | null => {
	const mainSegment = segments.find((s) => s.type === 'Segment');
	if (!mainSegment || mainSegment.type !== 'Segment') {
		return null;
	}

	const {value: children} = mainSegment;
	if (!children) {
		return null;
	}

	const infoSegment = children.find((s) => s.type === 'Info');

	const relevantBoxes = [
		...mainSegment.value,
		...(infoSegment && infoSegment.type === 'Info' ? infoSegment.value : []),
	];

	const timestampScale = relevantBoxes.find((s) => s.type === 'TimestampScale');
	if (!timestampScale || timestampScale.type !== 'TimestampScale') {
		return null;
	}

	const duration = relevantBoxes.find(
		(s) => s.type === 'Duration',
	) as DurationSegment;
	if (!duration || duration.type !== 'Duration') {
		return null;
	}

	return (duration.value.value / timestampScale.value.value) * 1000;
};

export const isMatroska = (boxes: AnySegment[]) => {
	const matroskaBox = boxes.find((b) => b.type === 'Segment');
	return matroskaBox;
};

export const getDuration = (
	structure: Structure,
	parserState: ParserState,
): number | null => {
	if (structure.type === 'matroska') {
		return getDurationFromMatroska(structure.boxes);
	}

	if (structure.type === 'iso-base-media') {
		const moovBox = getMoovBox(structure.boxes);
		if (!moovBox) {
			return null;
		}

		const moofBox = getMoofBox(structure.boxes);
		const mvhdBox = getMvhdBox(moovBox);

		if (!mvhdBox) {
			return null;
		}

		if (mvhdBox.type !== 'mvhd-box') {
			throw new Error('Expected mvhd-box');
		}

		if (mvhdBox.durationInSeconds > 0) {
			return mvhdBox.durationInSeconds;
		}

		const tracks = getTracks(structure, parserState);
		const allTracks = [
			...tracks.videoTracks,
			...tracks.audioTracks,
			...tracks.otherTracks,
		];
		const allSamples = allTracks.map((t) => {
			const {timescale: ts} = t;
			const samplePositions = getSamplePositionsFromTrack(
				t.trakBox as TrakBox,
				moofBox,
			);

			const highest = samplePositions
				?.map((sp) => (sp.cts + sp.duration) / ts)
				.reduce((a, b) => Math.max(a, b), 0);
			return highest ?? 0;
		});
		const highestTimestamp = Math.max(...allSamples);
		return highestTimestamp;
	}

	throw new Error('Has no duration');
};

export const hasDuration = (
	structure: Structure,
	parserState: ParserState,
): boolean => {
	try {
		const duration = getDuration(structure, parserState);
		return getDuration(structure, parserState) !== null && duration !== 0;
	} catch {
		return false;
	}
};
