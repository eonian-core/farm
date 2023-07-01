"use client";

import { useParams } from "next/navigation";
import { Vault, useGetVaultBySymbol } from "../../api";
import Form from "./form/form";
import { ClientOnly } from "../../components/client-only/client-only";
import { AuthProvider } from "../auth";

import 'react-toastify/dist/ReactToastify.css';


export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <ClientOnly>
      <AuthProvider>
        <FormWrapper />
      </AuthProvider>
    </ClientOnly>
  );
}

function FormWrapper() {
  const { symbol } = useParams();
  const { data } = useGetVaultBySymbol({ symbol });
  return <Form vault={data.vaultBySymbol as Vault} />;
}
