import type {IsoBaseMediaBox} from '../../../parse-video';
import {getArrayBufferIterator} from '../../../read-and-increment-offset';
import type {BaseBox} from '../base-type';
import {parseBoxes} from '../process-box';

export interface MoovBox extends BaseBox {
	type: 'moov-box';
	children: IsoBaseMediaBox[];
}

export const parseMoov = (data: Uint8Array, offset: number): MoovBox => {
	const iterator = getArrayBufferIterator(data);
	const size = iterator.getUint32();
	if (size !== data.byteLength) {
		throw new Error(`Expected moov size of ${data.byteLength}, got ${size}`);
	}

	const atom = iterator.getAtom();
	if (atom !== 'moov') {
		throw new Error(`Expected moov type of moov, got ${atom}`);
	}

	const children = parseBoxes(
		iterator.sliceFromHere(0),
		offset + iterator.counter.getOffset(),
	);

	return {
		offset,
		boxSize: data.byteLength,
		type: 'moov-box',
		children,
	};
};
