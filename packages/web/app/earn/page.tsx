"use client";

import { redirect } from "next/navigation";
import { useGetVaultsSymbols } from "../api";
import React from "react";
import { ClientOnly } from "../components/client-only/client-only";

export default async function Page() {
  return (
    <ClientOnly>
      <Redirect />
    </ClientOnly>
  );
}

function Redirect() {
  const { data } = useGetVaultsSymbols();

  const [{ symbol }] = data.vaults;
  redirect("/earn/" + symbol);
  
  return <></>;
}

