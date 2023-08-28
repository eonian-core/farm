import { ChainId } from '../providers/wallet/wrappers/helpers'

export enum ChainEnvironment {
  LOCAL = 'LOCAL',
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export function getGraphQLEndpoint(chainId: ChainId): string {
  const chainEnvironment = getChainEnvironment()
  switch (chainId) {
    case ChainId.BSC_MAINNET:
      return getBNBChainEndpoint(chainEnvironment)
    case ChainId.SEPOLIA:
      return process.env.NEXT_PUBLIC_GRAPH_URL || 'http://localhost:4000/'
    case ChainId.UNKNOWN:
      throw new Error('Chain is unknown')
  }
}

function getBNBChainEndpoint(chainEnvironment: ChainEnvironment): string {
  switch (chainEnvironment) {
    case ChainEnvironment.LOCAL:
      return 'http://localhost:4000/'
    case ChainEnvironment.DEVELOPMENT:
      return 'https://api.thegraph.com/subgraphs/name/eonian-core/eonian-bsc-development'
    case ChainEnvironment.STAGING:
      return 'https://api.thegraph.com/subgraphs/name/eonian-core/eonian-bsc-staging'
    default:
      return process.env.NEXT_PUBLIC_GRAPH_URL || 'http://localhost:4000/'
  }
}

export function getChainEnvironment(): ChainEnvironment {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT
  if (!environment) {
    return ChainEnvironment.DEVELOPMENT
  }

  const isExist = Object.values<string>(ChainEnvironment).includes(environment)
  if (!isExist) {
    throw new Error('Unknown chain environment')
  }

  return ChainEnvironment[environment as keyof typeof ChainEnvironment]
}
