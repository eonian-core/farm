import { useMemo } from "react";
import { childToString } from "./children-to-string";

/** Memoized verion of toId */
export const useToId = (slug?: string) => useMemo(() => toId(slug), [slug])

/** Memoized version of toId based on children content */
export const useContentToId = (children?: React.ReactNode) => useMemo(() => {
    const content = childToString(children)
    return toId(content);
}, [children]);

/** Make text html id friendly */
export const toId = (slug?: string) => {
    if (typeof slug !== 'string') 
        return undefined;
    

    const resutl = slug
        .trim()
        .replace(/[^a-zA-Z\d\s-]+/g, '-') // Replace any non-alphanumeric and non-dash characters with a single dash
        .replace(/\s+/g, '-') // Replace multiple spaces with a single dash
        .replace(/-+/g, '-') // Replace multiple dashes with a single dash
        .toLowerCase();

    return trim(resutl, '-');
}

/** Remove given character from string at the begining or at the end */
export const trim = (str: string, char: string): string =>
    str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');

