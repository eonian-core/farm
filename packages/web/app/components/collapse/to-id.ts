/** Make text html id friendly */
export const toId = (slug?: string) => {
    if (typeof slug !== 'string') { 
        return undefined; 
    }

    const resutl = slug
        .trim()
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();

    return trim(resutl, '-');
}

/** Remove given character from string at the begining or at the end */
export const trim = (str: string, char: string): string => 
    str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');
