// tokenDict.test.ts
import { ChainSymobls, chains } from './chains';
import { getTokenBySymbol, listToDict, tokensByChains } from './tokensByChains';
import { TokenInfo } from '@uniswap/token-lists';

describe('listToDict function', () => {
    it('should convert token list to dict filtered by chain symbol', () => {
        const testTokens: TokenInfo[] = [
            { chainId: chains[ChainSymobls.ETH].chainId, symbol: 'ETH1', address: '0x1', decimals: 18 },
            { chainId: chains[ChainSymobls.ETH].chainId, symbol: 'ETH2', address: '0x2', decimals: 18 },
            { chainId: chains[ChainSymobls.BSC].chainId, symbol: 'BSC1', address: '0x3', decimals: 18 },
            { chainId: chains[ChainSymobls.BSC].chainId, symbol: 'BSC2', address: '0x4', decimals: 18 },
            { chainId: chains[ChainSymobls.Sepolia].chainId, symbol: 'SEP1', address: '0x5', decimals: 18 },
            { chainId: chains[ChainSymobls.Sepolia].chainId, symbol: 'SEP2', address: '0x6', decimals: 18 },
        ] as any;

        const ethDict = listToDict(testTokens, ChainSymobls.ETH);
        expect(ethDict).toEqual({
            'ETH1': testTokens[0],
            'ETH2': testTokens[1]
        });

        const bscDict = listToDict(testTokens, ChainSymobls.BSC);
        expect(bscDict).toEqual({
            'BSC1': testTokens[2],
            'BSC2': testTokens[3]
        });

        const sepDict = listToDict(testTokens, ChainSymobls.Sepolia);
        expect(sepDict).toEqual({
            'SEP1': testTokens[4],
            'SEP2': testTokens[5]
        });
    });

    it('should return an empty dict when no tokens match the chain symbol', () => {
        const testTokens: TokenInfo[] = [
            { chainId: chains[ChainSymobls.ETH].chainId, symbol: 'ETH1', address: '0x1', decimals: 18 },
            { chainId: chains[ChainSymobls.ETH].chainId, symbol: 'ETH2', address: '0x2', decimals: 18 },
        ] as any;

        const bscDict = listToDict(testTokens, ChainSymobls.BSC);
        expect(bscDict).toEqual({});
    });
});

describe('getTokenBySymbol function', () => {
    it('should return the correct token for given chain symbol and token symbol', () => {
        const testToken: TokenInfo = { chainId: 1, symbol: 'TEST', address: '0x1', decimals: 18 } as any;
        tokensByChains[ChainSymobls.ETH] = { 'TEST': testToken }; // mock the tokensByChains data

        const result = getTokenBySymbol(ChainSymobls.ETH, 'TEST');
        expect(result).toEqual(testToken);
    });

    it('should throw an error when the chain symbol does not exist in tokensByChains', () => {
        expect(() => {
            getTokenBySymbol('NON_EXISTENT' as ChainSymobls, 'TEST');
        }).toThrowError(new Error('Chain NON_EXISTENT and token TEST pair is not found'));
    });

    it('should return undefined when the token symbol does not exist in the chain', () => {
        const result = getTokenBySymbol(ChainSymobls.ETH, 'NON_EXISTENT');
        expect(result).toBeUndefined();
    });
});