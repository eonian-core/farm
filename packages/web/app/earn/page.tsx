"use client";

import { redirect } from "next/navigation";
import { useGetVaults } from "../api";
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
  const { data } = useGetVaults({ symbols: true });

  const [{ symbol }] = data.vaults;
  redirect("/earn/" + symbol);
  
  return <></>;
}

