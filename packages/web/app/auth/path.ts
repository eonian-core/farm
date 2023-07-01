
/**
 * take url string and return url with top level deep path
 * @example: http://localhost:3000/earn/eonUSDT -> http://localhost:3000/earn
 */
export function getTopLevelPath(url: string): string {
    try {
        // Parse the input URL
        const parsedUrl = new URL(url);

        // Split the pathname into segments
        const pathSegments = parsedUrl.pathname.split('/');

        // If there are more than 1 segments (first one is always an empty string before the first slash)
        if (pathSegments.length > 1) {
            // Reconstruct the URL with the top-level path segment
            parsedUrl.pathname = '/' + pathSegments[1];
            return parsedUrl.toString();
        } else {
            // If there's no path in the URL, return the URL as is
            return url;
        }
    } catch (error) {
        console.warn('Invalid URL:', error);
        return url;
    }
}

/**
 * Attach path to url or replace if there exists such
 */
export function attachOrReplacePath(originalUrl: string, newPath: string): string {
    try {
        // Parse the original URL
        const parsedUrl = new URL(originalUrl);

        // Concatenate the origin with the new path
        return parsedUrl.origin + (newPath.startsWith('/') ? newPath : `/${newPath}`);
    } catch (error) {
        console.warn('Invalid URL:', error);
        return originalUrl;
    }
}