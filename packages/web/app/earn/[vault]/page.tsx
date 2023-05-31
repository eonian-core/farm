import styles from "./page.module.scss";
import Form from "./form/form";
import { getVaults } from "../../api";

interface PageParams {
  params: {
    vault: string;
  };
}

export async function generateStaticParams(): Promise<PageParams["params"][]> {
  const { data } = await getVaults({ symbols: true, revalidate: 600 });
  return data.vaults.map(({ symbol: vault }) => ({
    vault,
  }));
}

export default function Earn({ params }: PageParams) {
  const { vault } = params;
  return (
    <main className={styles.main}>
      <Form vaultSymbol={vault} />
    </main>
  );
}
