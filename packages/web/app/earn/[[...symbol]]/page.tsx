import styles from "./page.module.scss";
import Form from "./form/form";
import { Vault, getVaultBySymbol, getVaults } from "../../api";
import { redirect } from "next/navigation";

interface PageParams {
  params: {
    symbol: string[];
  };
}

export async function generateStaticParams() {
  const { data } = await getVaults({ symbols: true, revalidate: 600 });
  return data.vaults.map(({ symbol }) => [{ symbol }]);
}

export default async function Earn({ params }: PageParams) {
  const { symbol: symbols } = params;
  if (!symbols) {
    const [[{ symbol }]] = await generateStaticParams();
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
