import { redirect } from "next/navigation";
import { fetchVault, fetchVaultsSymbols } from "../../api";
import { ChainId } from "../../providers/wallet/wrappers/helpers";
import { defaultChain } from "../../web3-onboard";
import Form from "./form/form";

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
  const chainName = getDefaultChainName();
  const symbols = await fetchVaultsSymbols(chainName);
  return symbols.map((vaultSymbol) => {
    return { vault: [chainName, vaultSymbol] };
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

  const [chainName, vaultSymbol] = vaultRoute;
  const vault = await fetchVault(vaultSymbol, chainName);

  return <Form vault={vault} chainId={ChainId.getByName(chainName)} />;
}

function getDefaultChainName(): string {
  const chainId = ChainId.parse(defaultChain.id);
  const chainName = ChainId.getName(chainId);
  return chainName.toLowerCase();
}
