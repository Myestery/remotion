import {useContext} from 'react';
import {CanUseRemotionHooks} from './CanUseRemotionHooks';
import {SequenceContext} from './Sequence';
import {useTimelinePosition} from './timeline-position-state';

export const useAbsoluteCurrentFrame = (): number => {
	const timelinePosition = useTimelinePosition();

	return timelinePosition;
};

/**
 * Get the current frame of the video.
 * Frames are 0-indexed, meaning the first frame is 0, the last frame is the duration of the composition in frames minus one.
 * @link https://www.remotion.dev/docs/use-current-frame
 */
export const useCurrentFrame = (): number => {
	const canUseRemotionHooks = useContext(CanUseRemotionHooks);
	if (!canUseRemotionHooks) {
		throw new Error(
			`useCurrentFrame() was called outside a component that was registered as a composition.`
		);
	}

	const frame = useAbsoluteCurrentFrame();
	const context = useContext(SequenceContext);

	const contextOffset = context
		? context.cumulatedFrom + context.relativeFrom
		: 0;

	return frame - contextOffset;
};
