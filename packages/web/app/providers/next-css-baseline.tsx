"use client";

import { CssBaseline } from "@nextui-org/react";
import React from "react";

export default function NextCssBaselineWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>{CssBaseline.flush()}</head>
      {children}
    </>
  );
}
