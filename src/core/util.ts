export const SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export function toCodePoints(str: string): number[] {
    return Array.from(str).map(v => v.codePointAt(0) ?? 0);
}
