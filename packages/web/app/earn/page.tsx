"use client";

import ClientOnly from "../components/client-only/client-only";
import Redirect from "./redirect";

export default async function Page() {
  return (
    <ClientOnly>
      <Redirect />
    </ClientOnly>
  );
}
