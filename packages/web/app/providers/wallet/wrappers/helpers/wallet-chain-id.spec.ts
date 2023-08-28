import { ChainId } from './wallet-chain-id'

describe('ChainId', () => {
  it('Should transform id to hex', () => {
    expect(ChainId.toHex(ChainId.BSC_MAINNET)).toBe('0x38')
    expect(ChainId.toHex(ChainId.SEPOLIA)).toBe('0xaa36a7')
  })

  it('Should parse string', () => {
    expect(ChainId.parse('0x38')).toBe(ChainId.BSC_MAINNET)
    expect(ChainId.parse('0xaa36a7')).toBe(ChainId.SEPOLIA)

    expect(ChainId.parse(56)).toBe(ChainId.BSC_MAINNET)
    expect(ChainId.parse(11155111)).toBe(ChainId.SEPOLIA)

    expect(ChainId.parse('56')).toBe(ChainId.BSC_MAINNET)
    expect(ChainId.parse('11155111')).toBe(ChainId.SEPOLIA)

    expect(ChainId.parse(1)).toBe(ChainId.UNKNOWN)
    expect(ChainId.parse('1')).toBe(ChainId.UNKNOWN)
    expect(ChainId.parse('0x1')).toBe(ChainId.UNKNOWN)
  })

  it('Should get enum by string value', () => {
    expect(ChainId.getByName('123')).toBe(ChainId.UNKNOWN)
    expect(ChainId.getByName(null)).toBe(ChainId.UNKNOWN)
    expect(ChainId.getByName('sepolia')).toBe(ChainId.SEPOLIA)
    expect(ChainId.getByName('sepol')).toBe(ChainId.UNKNOWN)
    expect(ChainId.getByName('SEPOLIA')).toBe(ChainId.SEPOLIA)
    expect(ChainId.getByName('BSC_MAINNET')).toBe(ChainId.BSC_MAINNET)
    expect(ChainId.getByName('bsc_mainnet')).toBe(ChainId.BSC_MAINNET)
  })

  it('Should return name by chain id', () => {
    expect(ChainId.getName(ChainId.SEPOLIA)).toBe('SEPOLIA')
    expect(ChainId.getName(ChainId.BSC_MAINNET)).toBe('BSC_MAINNET')
  })
})
