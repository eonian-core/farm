import { getTopLevelPath } from './path'; 
import { attachOrReplacePath } from './path'; 

describe('path', () => {
    let warn: any;
    
    beforeEach(() => {
        // suppress warn for invalid URL
        warn = console.warn
        console.warn = jest.fn();
    });

    afterEach(() => {
        console.warn = warn;
    });

    describe('getTopLevelPath', () => {

        test('should return top-level path for a given URL', () => {
            const input = 'http://localhost:3000/earn/eonUSDT';
            const expected = 'http://localhost:3000/earn';

            expect(getTopLevelPath(input)).toBe(expected);
        });

        test('should return input URL if it has no path', () => {
            const input = 'http://localhost:3000';
            const expected = 'http://localhost:3000/';

            expect(getTopLevelPath(input)).toBe(expected);
        });

        test('should return input URL if it has only one path segment', () => {
            const input = 'http://localhost:3000/earn';

            expect(getTopLevelPath(input)).toBe(input);
        });

        test('should return null for an invalid URL', () => {
            const input = 'not-a-valid-url';

            expect(getTopLevelPath(input)).toBe(input);
        });

        test('should handle URLs with query strings and fragments', () => {
            const input = 'http://localhost:3000/earn/eonUSDT?param=value#fragment';
            const expected = 'http://localhost:3000/earn?param=value#fragment';

            expect(getTopLevelPath(input)).toBe(expected);
        });

        test('should return top-level path for eonian.finance with https', () => {
            const input = 'https://eonian.finance/earn/eonUSDT/staking';
            const expected = 'https://eonian.finance/earn';
            expect(getTopLevelPath(input)).toBe(expected);
        });

        test('should return top-level path for eonian.finance with http', () => {
            const input = 'http://eonian.finance/earn/eonUSDT/staking';
            const expected = 'http://eonian.finance/earn';
            expect(getTopLevelPath(input)).toBe(expected);
        });

        test('should return top-level path for subdomain dev.eonian.finance with https', () => {
            const input = 'https://dev.eonian.finance/earn/eonUSDT/staking';
            const expected = 'https://dev.eonian.finance/earn';
            expect(getTopLevelPath(input)).toBe(expected);
        });

        test('should return top-level path for subdomain dev.eonian.finance with http', () => {
            const input = 'http://dev.eonian.finance/earn/eonUSDT/staking';
            const expected = 'http://dev.eonian.finance/earn';
            expect(getTopLevelPath(input)).toBe(expected);
        });

    })

    describe('attachOrReplacePath', () => {

        test('should replace path for a given URL', () => {
            const originalUrl = 'https://eonian.finance/mission';
            const newPath = '/earn';
            const expected = 'https://eonian.finance/earn';
            expect(attachOrReplacePath(originalUrl, newPath)).toBe(expected);
        });
    
        test('should attach path if URL has no path', () => {
            const originalUrl = 'https://eonian.finance';
            const newPath = '/earn';
            const expected = 'https://eonian.finance/earn';
            expect(attachOrReplacePath(originalUrl, newPath)).toBe(expected);
        });
    
        test('should handle URLs with different protocols', () => {
            const originalUrl = 'http://eonian.finance/mission';
            const newPath = '/earn';
            const expected = 'http://eonian.finance/earn';
            expect(attachOrReplacePath(originalUrl, newPath)).toBe(expected);
        });
    
        test('should handle subdomains', () => {
            const originalUrl = 'https://dev.eonian.finance/mission';
            const newPath = '/earn';
            const expected = 'https://dev.eonian.finance/earn';
            expect(attachOrReplacePath(originalUrl, newPath)).toBe(expected);
        });
    
        test('should return null for an invalid URL', () => {
            const originalUrl = 'not-a-valid-url';
            const newPath = '/earn';
            expect(attachOrReplacePath(originalUrl, newPath)).toBe(originalUrl);
        });
    
        test('should handle paths without leading slash', () => {
            const originalUrl = 'https://eonian.finance/mission';
            const newPath = 'earn';
            const expected = 'https://eonian.finance/earn';
            expect(attachOrReplacePath(originalUrl, newPath)).toBe(expected);
        });
    
    });

});




