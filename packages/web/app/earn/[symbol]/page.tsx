"use client";

import { useParams } from "next/navigation";
import { Vault, useGetVaultBySymbol } from "../../api";
import Form from "./form/form";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <FormWrapper />;
}

function FormWrapper() {
  const { symbol } = useParams();
  const { data } = useGetVaultBySymbol({ symbol });
  return <Form vault={data.vaultBySymbol as Vault} />;
}
