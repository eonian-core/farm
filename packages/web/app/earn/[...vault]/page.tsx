import { redirect } from 'next/navigation'
import type { Vault } from '../../api'
import { getClient, getVaultBySymbol, getVaultsSymbols } from '../../api'
import { ChainId } from '../../providers/wallet/wrappers/helpers'
import { defaultChain } from '../../web3-onboard'
import { showEarn } from '../../features'
import Form from './form/form'

import styles from './page.module.scss'

export const revalidate = 10

interface RouteSegment {
  vault: [chainName: string, vaultSymbol: string] | [chainName: string]
}

interface Params {
  params: Partial<RouteSegment>
}

/**
 * Generates static page for each vault in every supported chain.
 * FIXME: For the alpha release, we can only use the default chain (BSC).
 */
export async function generateStaticParams(): Promise<RouteSegment[]> {
  const chainId = ChainId.parse(defaultChain.id)
  const client = getClient(chainId)
  const { data } = await getVaultsSymbols(client)
  return data.vaults.map(({ symbol }) => ({ vault: [ChainId.getName(chainId).toLowerCase(), symbol] }))
}

export default async function Page({ params }: Params) {
  const { vault: vaultRoute = [] } = params

  if (!showEarn) {
    redirect('/')
  }

  if (vaultRoute.length !== 2) {
    redirect('/earn/')
  }

  const [chainName, vaultSymbol] = vaultRoute
  const chainId = ChainId.getByName(chainName)
  const client = getClient(chainId)
  const { data } = await getVaultBySymbol(client, vaultSymbol)
  return (
    <div className={styles.page}>
      <Form vault={data.vaults[0] as Vault} chainId={chainId} />
    </div>
  )
}
