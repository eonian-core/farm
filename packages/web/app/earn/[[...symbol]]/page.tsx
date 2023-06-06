"use client";

import styles from "./page.module.scss";
import Form from "./form/form";
import { Vault, getVaultBySymbol, getVaults } from "../../api";
import { redirect, useParams } from "next/navigation";
import { use } from "react";

interface PageParams {
  params: {
    symbol: string[];
  };
}

async function getSymbols() {
  const { data } = await getVaults({ symbols: true, revalidate: 600 });
  return data.vaults.map(({ symbol }) => [{ symbol }]);
}

export default async function Earn() {
  return <FormWrapper />;
}

function FormWrapper() {
  const { symbol: symbols } = useParams();
  const data = use(getSymbols());
  console.log(data);
  return (
    <main className={styles.main}>{/* <Form vault={vault as Vault} /> */}</main>
  );
}
