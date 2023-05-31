import styles from "./page.module.scss";
import Form from "./form/form";
import { getVaults } from "../../api";
import { redirect } from "next/navigation";

interface PageParams {
  params: {
    symbol: string;
  };
}

export async function generateStaticParams(): Promise<
  PageParams["params"][][]
> {
  const { data } = await getVaults({ symbols: true, revalidate: 600 });
  return data.vaults.map(({ symbol }) => [{ symbol }]);
}

export default async function Earn({ params }: PageParams) {
  const { symbol } = params;
  if (!symbol) {
    const [[{ symbol }]] = await generateStaticParams();
    redirect("/earn/" + symbol);
  }

  return (
    <main className={styles.main}>
      <Form vaultSymbol={symbol} />
    </main>
  );
}
