import type { InitOptions, ThemingMap } from '@web3-onboard/core/dist/types'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import init from '@web3-onboard/core'
import { ChainId, getRPCEndpoint } from './providers/wallet/wrappers/helpers'

const theme: ThemingMap = {
  '--w3o-background-color': 'var(--color-background-start)',
  '--w3o-foreground-color': 'var(--color-background-end)',
  '--w3o-text-color': 'var(--color-text-300)',
  '--w3o-border-color': 'var(--color-text-500)',
  '--w3o-action-color': 'var(--color-primary-500)',
  '--w3o-border-radius': 'var(--border-radius-500)',
}

const chains: Partial<Record<ChainId, InitOptions['chains'][0]>> = {
  [ChainId.SEPOLIA]: {
    id: ChainId.toHex(ChainId.SEPOLIA),
    token: 'SepoliaETH',
    label: 'Sepolia - Testnet',
    rpcUrl: getRPCEndpoint(ChainId.SEPOLIA),
  },
  [ChainId.BSC_MAINNET]: {
    id: ChainId.toHex(ChainId.BSC_MAINNET),
    token: 'BNB',
    label: 'BSC Mainnet',
    rpcUrl: getRPCEndpoint(ChainId.BSC_MAINNET),
  },
}

const supportedChains = Object.values(chains).filter(chain => !!chain.rpcUrl)

export default init({
  theme,
  wallets: getWallets(),
  chains: supportedChains,
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
  appMetadata: {
    name: 'Eonian Finance',
    icon: `
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-width="17.5" 
            d="M8.12132 9.87868L10.2044 11.9617L10.2106 11.9555L11.6631 13.408L11.6693 13.4142L13.7907 15.5355C15.7433 17.4882 18.9091 17.4882 20.8617 15.5355C22.8144 13.5829 22.8144 10.4171 20.8617 8.46447C18.9091 6.51184 15.7433 6.51184 13.7907 8.46447L13.0773 9.17786L14.4915 10.5921L15.2049 9.87868C16.3764 8.70711 18.2759 8.70711 19.4475 9.87868C20.6191 11.0503 20.6191 12.9497 19.4475 14.1213C18.2759 15.2929 16.3764 15.2929 15.2049 14.1213L13.1326 12.0491L13.1263 12.0554L9.53553 8.46447C7.58291 6.51184 4.41709 6.51184 2.46447 8.46447C0.511845 10.4171 0.511845 13.5829 2.46447 15.5355C4.41709 17.4882 7.58291 17.4882 9.53553 15.5355L10.2488 14.8222L8.83463 13.408L8.12132 14.1213C6.94975 15.2929 5.05025 15.2929 3.87868 14.1213C2.70711 12.9497 2.70711 11.0503 3.87868 9.87868C5.05025 8.70711 6.94975 8.70711 8.12132 9.87868Z"
            fill="currentColor"
          />
        </svg>
    `,
    description: 'Decentralized and secure protocol for passive investments with peace of mind.',
    gettingStartedGuide: 'https://eonian.finance/', // The url to a getting started guide for app
    explore: 'https://eonian.finance/', // The url that points to more information about app
  },
})

function getWallets(): InitOptions['wallets'] {
  const wallets = [injectedModule()]
  const walletConnectProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
  if (walletConnectProjectId) {
    wallets.push(
      walletConnectModule({
        projectId: walletConnectProjectId,
        requiredChains: Object.keys(chains)
          .map(Number)
          .filter(id => id !== ChainId.SEPOLIA),
      }),
    )
  }
  return wallets
}

export const supportedChainsIds = supportedChains.map(chain => ChainId.parse(chain.id))

export const defaultChain = chains[ChainId.getByName(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_NAME)]!
