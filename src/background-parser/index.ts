export * as BackgroundParser from './parser';

export { CacheStorage } from '../core/cache-storage';
export { Logger } from '../core/logger';

export { calculateBackgroundSize } from '../render/background';

import { backgroundClip } from '../css/property-descriptors/background-clip';
import { backgroundColor } from '../css/property-descriptors/background-color';
import { backgroundImage } from '../css/property-descriptors/background-image';
import { backgroundOrigin } from '../css/property-descriptors/background-origin';
import { backgroundPosition } from '../css/property-descriptors/background-position';
import { backgroundRepeat } from '../css/property-descriptors/background-repeat';
import { backgroundSize } from '../css/property-descriptors/background-size';
export const PropertyDescriptors = {
    backgroundClip,
    backgroundColor,
    backgroundImage,
    backgroundOrigin,
    backgroundPosition,
    backgroundRepeat,
    backgroundSize,
};

export { BACKGROUND_CLIP } from '../css/property-descriptors/background-clip';
export { BACKGROUND_ORIGIN } from '../css/property-descriptors/background-origin';
export { BACKGROUND_REPEAT } from '../css/property-descriptors/background-repeat';
export { BACKGROUND_SIZE } from '../css/property-descriptors/background-size';

export {
    isUrlImage, isLinearGradient, isRadialGradient,
    ICSSImage, CSSImageType, CSSRadialShape, CSSRadialExtent,
    CSSURLImage, CSSLinearGradientImage, CSSRadialGradientImage
} from '../css/types/image';

import { getAbsoluteValueForTuple, getAbsoluteValue } from '../css/types/length-percentage';
export const LengthPercentage = { getAbsoluteValueForTuple, getAbsoluteValue };

import { calculateGradientDirection, calculateRadius, processColorStops } from '../css/types/functions/gradient';
export const Gradient = { calculateGradientDirection, calculateRadius, processColorStops };

import { asString } from '../css/types/color';
export const Color = { asString };
