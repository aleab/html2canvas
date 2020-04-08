import { IPropertyDescriptor } from '../css/IPropertyDescriptor';
import { backgroundClip } from '../css/property-descriptors/background-clip';
import { backgroundColor } from '../css/property-descriptors/background-color';
import { backgroundImage } from '../css/property-descriptors/background-image';
import { backgroundOrigin } from '../css/property-descriptors/background-origin';
import { backgroundPosition } from '../css/property-descriptors/background-position';
import { backgroundRepeat } from '../css/property-descriptors/background-repeat';
import { backgroundSize } from '../css/property-descriptors/background-size';
import { Parser } from '../css/syntax/parser';
import { Tokenizer } from '../css/syntax/tokenizer';
import { color } from '../css/types/color';

function getParser<T extends IPropertyDescriptor>(descriptor: T, style?: string | null) {
    const tokenizer = new Tokenizer();
    const value = style !== null && typeof style !== 'undefined' ? style.toString() : descriptor.initialValue;
    tokenizer.write(value);
    return new Parser(tokenizer.read());
}

export function parseBackgroundClip(style?: string | null) { return backgroundClip.parse(getParser(backgroundClip, style).parseComponentValues()); }
export function parseBackgroundColor(style?: string | null) { return color.parse(getParser(backgroundColor, style).parseComponentValue()); }
export function parseBackgroundImage(style?: string | null) { return backgroundImage.parse(getParser(backgroundImage, style).parseComponentValues()); }
export function parseBackgroundOrigin(style?: string | null) { return backgroundOrigin.parse(getParser(backgroundOrigin, style).parseComponentValues()); }
export function parseBackgroundPosition(style?: string | null) { return backgroundPosition.parse(getParser(backgroundPosition, style).parseComponentValues()); }
export function parseBackgroundRepeat(style?: string | null) { return backgroundRepeat.parse(getParser(backgroundRepeat, style).parseComponentValues()); }
export function parseBackgroundSize(style?: string | null) { return backgroundSize.parse(getParser(backgroundSize, style).parseComponentValues()); }
