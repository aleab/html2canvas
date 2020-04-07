import { backgroundImage } from '../css/property-descriptors/background-image';
import { Parser } from '../css/syntax/parser';
import { Tokenizer } from '../css/syntax/tokenizer';

export function parse(style?: string | null) {
    const tokenizer = new Tokenizer();
    const value = style !== null && typeof style !== 'undefined' ? style.toString() : backgroundImage.initialValue;
    tokenizer.write(value);
    const parser = new Parser(tokenizer.read());
    return backgroundImage.parse(parser.parseComponentValues());
}
