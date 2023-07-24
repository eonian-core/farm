import { redirect } from "next/navigation";
import { getClient, getVaults, Vault } from "../api";
import { showEarn } from "../features";
import { ChainId } from "../providers/wallet/wrappers/helpers";
import { supportedChainsIds } from "../web3-onboard";
import { VaultList, VaultsByChain } from "./components";

import styles from "./page.module.scss";

export const revalidate = 30;

export default async function Page() {
  if (!showEarn) redirect("/");

  const vaultsByChain = await fetchVaults();
  return (
    <div className={styles.page}>
      <VaultList vaultsByChain={vaultsByChain} />
    </div>
  );
}

async function fetchVaults() {
  const promises = supportedChainsIds.map(fetchVault);
  const results = await Promise.all(promises);
  return results.reduce((map, result, index) => {
    map[supportedChainsIds[index]] = result;
    return map;
  }, {} as VaultsByChain);
}

async function fetchVault(chainId: ChainId): Promise<Vault[]> {
  try {
    const client = getClient(chainId);
    const { data } = await getVaults(client);
    return data.vaults as Vault[];
  } catch (e) {
    return [];
  }
}
