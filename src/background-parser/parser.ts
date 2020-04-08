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

export function parseBackgroundClip(style?: string | null) {
    const parser = getParser(backgroundClip, style);
    return backgroundClip.parse(parser.parseComponentValues());
}

export function parseBackgroundColor(style?: string | null) {
    const parser = getParser(backgroundColor, style);
    return color.parse(parser.parseComponentValue());
}

export function parseBackgroundImage(style?: string | null) {
    const parser = getParser(backgroundImage, style);
    return backgroundImage.parse(parser.parseComponentValues());
}

export function parseBackgroundOrigin(style?: string | null) {
    const parser = getParser(backgroundOrigin, style);
    return backgroundOrigin.parse(parser.parseComponentValues());
}

export function parseBackgroundPosition(style?: string | null) {
    const parser = getParser(backgroundPosition, style);
    return backgroundPosition.parse(parser.parseComponentValues());
}

export function parseBackgroundRepeat(style?: string | null) {
    const parser = getParser(backgroundRepeat, style);
    return backgroundRepeat.parse(parser.parseComponentValues());
}

export function parseBackgroundSize(style?: string | null) {
    const parser = getParser(backgroundSize, style);
    return backgroundSize.parse(parser.parseComponentValues());
}
