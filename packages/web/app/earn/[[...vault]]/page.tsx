import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClient, getVaultBySymbol, getVaultsSymbols, Vault } from "../../api";
import { ChainId } from "../../providers/wallet/wrappers/helpers";
import { defaultChain } from "../../web3-onboard";
import Form from "./form/form";

export const dynamic = "force-dynamic";

interface RouteSegment {
  vault: [chainName: string, vaultSymbol: string] | [chainName: string];
}

interface Params {
  params: Partial<RouteSegment>;
}

/**
 * Generates static page for each vault in every supported chain.
 * FIXME: For the alpha release, we can only use the default chain (BSC).
 */
export async function generateStaticParams(): Promise<RouteSegment[]> {
  const chainId = ChainId.parse(defaultChain.id);
  const client = getClient(chainId);
  const { data } = await getVaultsSymbols(client);
  return data.vaults.map(({ symbol }) => {
    return { vault: [ChainId.getName(chainId).toLowerCase(), symbol] };
  });
}

export default async function Page({ params }: Params) {
  const { vault: vaultRoute = [] } = params;

  // If the route is not complete (e.g. complete route: "/earn/bsc_mainnet/eonUSDT"),
  // we should redirect the user to the first vault in the default chain.
  if (vaultRoute.length != 2) {
    const segment = await generateStaticParams();
    const [{ vault }] = segment;
    const [chainName, vaultSymbol] = vault;
    redirect("/earn/" + chainName + "/" + vaultSymbol);
  }

  revalidatePath("/earn/[[...vault]]");

  const [chainName, vaultSymbol] = vaultRoute;
  const chainId = ChainId.getByName(chainName);
  const client = getClient(chainId);
  await client.cache.reset();
  const { data } = await getVaultBySymbol(client, vaultSymbol);

  return <Form vault={data.vaults[0] as Vault} chainId={chainId} />;
}
