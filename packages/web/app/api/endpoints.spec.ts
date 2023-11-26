import { ChainEnvironment, getChainEnvironment } from './endpoints'

describe('getChainEnvironment', () => {
  it('Should fallback to DEVELOPMENT if chain env is not specified', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = ''
    expect(getChainEnvironment()).toBe(ChainEnvironment.DEVELOPMENT)

    delete process.env.NEXT_PUBLIC_ENVIRONMENT
    expect(getChainEnvironment()).toBe(ChainEnvironment.DEVELOPMENT)
  })

  it('Should throw error if chain is not valid', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'UNKNOWN CHAIN'
    expect(getChainEnvironment).toThrow(Error)
  })

  it('Should parse specified chain environment', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'DEVELOPMENT'
    expect(getChainEnvironment()).toBe(ChainEnvironment.DEVELOPMENT)

    process.env.NEXT_PUBLIC_ENVIRONMENT = 'STAGING'
    expect(getChainEnvironment()).toBe(ChainEnvironment.STAGING)

    process.env.NEXT_PUBLIC_ENVIRONMENT = 'PRODUCTION'
    expect(getChainEnvironment()).toBe(ChainEnvironment.PRODUCTION)
  })
})
