import {deepStrictEqual} from 'assert';
import {CSSFunction, Parser} from '../../../syntax/parser';
import {radialGradient} from '../radial-gradient';
import {CSSImageType, CSSRadialExtent, CSSRadialShape, CSSRadialGradientImage} from '../../image';
import {color, pack} from '../../color';
import {TokenType} from '../../../syntax/tokenizer';
import {FIFTY_PERCENT, HUNDRED_PERCENT} from '../../length-percentage';
import {processColorStops} from '../gradient';

const parse = (value: string) => radialGradient((Parser.parseValues(value)[0] as CSSFunction).values);
const colorParse = (value: string) => color.parse(Parser.parseValue(value));

describe('functions', () => {
    describe('radial-gradient', () => {
        describe('parsing', () => {
            it('radial-gradient(circle closest-side, #3f87a6, #ebf8e1, #f69d3c)', () =>
                deepStrictEqual(parse('radial-gradient(ellipse closest-side, #3f87a6, #ebf8e1, #f69d3c)'), {
                    type: CSSImageType.RADIAL_GRADIENT,
                    shape: CSSRadialShape.ELLIPSE,
                    size: CSSRadialExtent.CLOSEST_SIDE,
                    position: [],
                    stops: [
                        {color: colorParse('#3f87a6'), stop: null},
                        {color: colorParse('#ebf8e1'), stop: null},
                        {color: colorParse('#f69d3c'), stop: null}
                    ]
                }));
                it('radial-gradient(circle closest-side, #3f87a6, #ebf8e1, #f69d3c)', () => {
                    const image = parse('radial-gradient(ellipse closest-side, #3f87a6, 30%, #f69d3c)');
                    deepStrictEqual(image, {
                        type: CSSImageType.RADIAL_GRADIENT,
                        shape: CSSRadialShape.ELLIPSE,
                        size: CSSRadialExtent.CLOSEST_SIDE,
                        position: [],
                        stops: [
                            {color: colorParse('#3f87a6'), stop: null},
                            {color: null, stop: { flags: 4, number: 30, type: 16 }},
                            {color: colorParse('#f69d3c'), stop: null}
                        ]
                    });

                    const colorStops = processColorStops((image as CSSRadialGradientImage).stops, 10);
                    deepStrictEqual(colorStops, [
                        {color: pack(0x3f, 0x87, 0xa6, 1), stop: 0},
                        {color: pack(Math.round((0x3f + 0xf6) / 2), Math.round((0x87 + 0x9d) / 2), Math.round((0xa6 + 0x3c) / 2), 1), stop: 0.3},
                        {color: pack(0xf6, 0x9d, 0x3c, 1), stop: 1},
                    ]);
                });
            it('radial-gradient(circle at center, red 0, blue, green 100%)', () =>
                deepStrictEqual(parse('radial-gradient(circle at center, red 0, blue, green 100%)'), {
                    type: CSSImageType.RADIAL_GRADIENT,
                    shape: CSSRadialShape.CIRCLE,
                    size: CSSRadialExtent.FARTHEST_CORNER,
                    position: [FIFTY_PERCENT],
                    stops: [
                        {color: colorParse('red'), stop: {type: TokenType.NUMBER_TOKEN, number: 0, flags: 4}},
                        {color: colorParse('blue'), stop: null},
                        {color: colorParse('green'), stop: {type: TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4}}
                    ]
                }));
            it('radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%)', () =>
                deepStrictEqual(parse('radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%)'), {
                    type: CSSImageType.RADIAL_GRADIENT,
                    shape: CSSRadialShape.CIRCLE,
                    size: CSSRadialExtent.FARTHEST_CORNER,
                    position: [HUNDRED_PERCENT],
                    stops: [
                        {color: colorParse('#333'), stop: null},
                        {color: colorParse('#333'), stop: {type: TokenType.PERCENTAGE_TOKEN, number: 50, flags: 4}},
                        {color: colorParse('#eee'), stop: {type: TokenType.PERCENTAGE_TOKEN, number: 75, flags: 4}},
                        {color: colorParse('#333'), stop: {type: TokenType.PERCENTAGE_TOKEN, number: 75, flags: 4}}
                    ]
                }));
            it('radial-gradient(20px, red, blue)', () =>
                deepStrictEqual(parse('radial-gradient(20px, red, blue)'), {
                    type: CSSImageType.RADIAL_GRADIENT,
                    shape: CSSRadialShape.CIRCLE,
                    size: [{type: TokenType.DIMENSION_TOKEN, number: 20, flags: 4, unit: 'px'}],
                    position: [],
                    stops: [{color: colorParse('red'), stop: null}, {color: colorParse('blue'), stop: null}]
                }));
        });
    });
});
