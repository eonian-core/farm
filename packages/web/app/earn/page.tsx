"use client";

import { redirect } from "next/navigation";
import { useGetVaultsSymbols } from "../api";
import React from "react";
import { ClientOnly } from "../components/client-only/client-only";
import { AuthProvider } from "../auth";

export default async function Page() {
  return (
    <ClientOnly>
      <AuthProvider>
        <Redirect />
      </AuthProvider>
    </ClientOnly>
  );
}

function Redirect() {
  const { data } = useGetVaultsSymbols();

  const [{ symbol }] = data.vaults;
  redirect("/earn/" + symbol);
  
}

