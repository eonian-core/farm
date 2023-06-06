"use client";

import { redirect } from "next/navigation";
import { useGetVaults } from "../api";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <Redirect />;
}

function Redirect() {
  const { data } = useGetVaults({ symbols: true });

  const [{ symbol }] = data.vaults;
  redirect("/earn/" + symbol);
  
  return <></>;
}
