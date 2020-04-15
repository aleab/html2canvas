import {CSSValue} from '../../syntax/parser';
import {
    CSSRadialExtent,
    CSSRadialGradientImage,
    CSSRadialShape,
    GradientColorStop,
    GradientCorner,
    UnprocessedGradientColorStop,
    UnprocessedGradientColorHint
} from '../image';
import {color as colorType, pack} from '../color';
import {getAbsoluteValue, HUNDRED_PERCENT, isLengthPercentage, ZERO_LENGTH} from '../length-percentage';

export const parseColorStop = (args: CSSValue[]): UnprocessedGradientColorStop | UnprocessedGradientColorHint => {
    if (isLengthPercentage(args[0])) { // Interpolation Hint / Gradient Midpoint
        return { color: null, stop: args[0] };
    } else {
        const color = colorType.parse(args[0]);
        const stop = args[1];
        return stop && isLengthPercentage(stop) ? {color, stop} : {color, stop: null};
    }
};

export const processColorStops = (stops: (UnprocessedGradientColorStop | UnprocessedGradientColorHint)[], lineLength: number): GradientColorStop[] => {
    const first = stops[0];
    const last = stops[stops.length - 1];

    if (first.stop === null) first.stop = ZERO_LENGTH;
    if (first.color === null) first.color = 255;

    if (last.stop === null) last.stop = HUNDRED_PERCENT;
    if (last.color === null) last.color = 255;

    const processStops: (number | null)[] = [];
    let previous = 0;
    for (let i = 0; i < stops.length; i++) {
        const stop = stops[i].stop;
        if (stop !== null) {
            const absoluteValue = getAbsoluteValue(stop, lineLength);
            if (absoluteValue > previous) {
                processStops.push(absoluteValue);
            } else {
                processStops.push(previous);
            }
            previous = absoluteValue;
        } else {
            processStops.push(null);
        }
    }

    let gapBegin = null;
    for (let i = 0; i < processStops.length; i++) {
        const stop = processStops[i];
        if (stop === null) {
            if (gapBegin === null) {
                gapBegin = i;
            }
        } else if (gapBegin !== null) {
            const gapLength = i - gapBegin;
            const beforeGap = processStops[gapBegin - 1] as number;
            const gapValue = (stop - beforeGap) / (gapLength + 1);
            for (let g = 1; g <= gapLength; g++) {
                processStops[gapBegin + g - 1] = gapValue * g;
            }
            gapBegin = null;
        }
    }

    return stops.map(({color}, i) => {
        const stop = Math.max(Math.min(1, (processStops[i] as number) / lineLength), 0);
        let _color: number = 0;
        if (color === null) {
            // Interpolation Hint / Gradient Midpoint
            const prev = stops[i-1];
            const next = stops[i+1];
            if (prev.color !== null && next.color !== null) {
                const prevColor = { a: 0xff & prev.color, b: 0xff & (prev.color >> 8), g: 0xff & (prev.color >> 16), r: 0xff & (prev.color >> 24) };
                const nextColor = { a: 0xff & next.color, b: 0xff & (next.color >> 8), g: 0xff & (next.color >> 16), r: 0xff & (next.color >> 24) };
                _color = pack(
                    Math.round((prevColor.r + nextColor.r) / 2),
                    Math.round((prevColor.g + nextColor.g) / 2),
                    Math.round((prevColor.b + nextColor.b) / 2),
                    Math.round((prevColor.a + nextColor.a) / 2) / 255,
                );
            }
        } else {
            _color = color;
        }
        return {color: _color, stop};
    });
};

const getAngleFromCorner = (corner: GradientCorner, width: number, height: number): number => {
    const centerX = width / 2;
    const centerY = height / 2;
    const x = getAbsoluteValue(corner[0], width) - centerX;
    const y = centerY - getAbsoluteValue(corner[1], height);

    return (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);
};

export const calculateGradientDirection = (
    angle: number | GradientCorner,
    width: number,
    height: number
): [number, number, number, number, number] => {
    const radian = typeof angle === 'number' ? angle : getAngleFromCorner(angle, width, height);

    const lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfLineLength = lineLength / 2;

    const yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;
    const xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;

    return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];
};

const distance = (a: number, b: number): number => Math.sqrt(a * a + b * b);

const findCorner = (width: number, height: number, x: number, y: number, closest: boolean): [number, number] => {
    const corners = [[0, 0], [0, height], [width, 0], [width, height]];

    return corners.reduce(
        (stat, corner) => {
            const [cx, cy] = corner;
            const d = distance(x - cx, y - cy);
            if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {
                return {
                    optimumCorner: corner,
                    optimumDistance: d
                };
            }

            return stat;
        },
        {
            optimumDistance: closest ? Infinity : -Infinity,
            optimumCorner: null
        }
    ).optimumCorner as [number, number];
};

export const calculateRadius = (
    gradient: CSSRadialGradientImage,
    x: number,
    y: number,
    width: number,
    height: number
): [number, number] => {
    let rx = 0;
    let ry = 0;

    switch (gradient.size) {
        case CSSRadialExtent.CLOSEST_SIDE:
            // The ending shape is sized so that that it exactly meets the side of the gradient box closest to the gradient’s center.
            // If the shape is an ellipse, it exactly meets the closest side in each dimension.
            if (gradient.shape === CSSRadialShape.CIRCLE) {
                rx = ry = Math.min(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
            } else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                rx = Math.min(Math.abs(x), Math.abs(x - width));
                ry = Math.min(Math.abs(y), Math.abs(y - height));
            }
            break;

        case CSSRadialExtent.CLOSEST_CORNER:
            // The ending shape is sized so that that it passes through the corner of the gradient box closest to the gradient’s center.
            // If the shape is an ellipse, the ending shape is given the same aspect-ratio it would have if closest-side were specified.
            if (gradient.shape === CSSRadialShape.CIRCLE) {
                rx = ry = Math.min(
                    distance(x, y),
                    distance(x, y - height),
                    distance(x - width, y),
                    distance(x - width, y - height)
                );
            } else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                // Compute the ratio ry/rx (which is to be the same as for "closest-side")
                const c = Math.min(Math.abs(y), Math.abs(y - height)) / Math.min(Math.abs(x), Math.abs(x - width));
                const [cx, cy] = findCorner(width, height, x, y, true);
                rx = distance(cx - x, (cy - y) / c);
                ry = c * rx;
            }
            break;

        case CSSRadialExtent.FARTHEST_SIDE:
            // Same as closest-side, except the ending shape is sized based on the farthest side(s)
            if (gradient.shape === CSSRadialShape.CIRCLE) {
                rx = ry = Math.max(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
            } else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                rx = Math.max(Math.abs(x), Math.abs(x - width));
                ry = Math.max(Math.abs(y), Math.abs(y - height));
            }
            break;

        case CSSRadialExtent.FARTHEST_CORNER:
            // Same as closest-corner, except the ending shape is sized based on the farthest corner.
            // If the shape is an ellipse, the ending shape is given the same aspect ratio it would have if farthest-side were specified.
            if (gradient.shape === CSSRadialShape.CIRCLE) {
                rx = ry = Math.max(
                    distance(x, y),
                    distance(x, y - height),
                    distance(x - width, y),
                    distance(x - width, y - height)
                );
            } else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                // Compute the ratio ry/rx (which is to be the same as for "farthest-side")
                const c = Math.max(Math.abs(y), Math.abs(y - height)) / Math.max(Math.abs(x), Math.abs(x - width));
                const [cx, cy] = findCorner(width, height, x, y, false);
                rx = distance(cx - x, (cy - y) / c);
                ry = c * rx;
            }
            break;
    }

    if (Array.isArray(gradient.size)) {
        rx = getAbsoluteValue(gradient.size[0], width);
        ry = gradient.size.length === 2 ? getAbsoluteValue(gradient.size[1], height) : rx;
    }

    return [rx, ry];
};
