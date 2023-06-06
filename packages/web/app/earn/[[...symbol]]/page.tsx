import styles from "./page.module.scss";
import Form from "./form/form";
import { Vault, getVaultBySymbol, getVaults } from "../../api";
import { redirect } from "next/navigation";

interface PageParams {
  params: {
    symbol: string[];
  };
}

async function getSymbols() {
  const { data } = await getVaults({ symbols: true, revalidate: 600 });
  return data.vaults.map(({ symbol }) => [{ symbol }]);
}

export async function generateStaticParams() {
  try {
    return await getSymbols();
  } catch (e: unknown) {
    return [];
  }
}

export default async function Earn({ params }: PageParams) {
  const { symbol: symbols } = params;
  if (!symbols) {
    const [[{ symbol }]] = await getSymbols();
    return redirect("/earn/" + symbol);
  }

  const [symbol] = symbols;
  const {
    data: { vaultBySymbol: vault },
  } = await getVaultBySymbol({ symbol });

  return (
    <main className={styles.main}>
      <Form vault={vault as Vault} />
    </main>
  );
}
