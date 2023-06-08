import React from "react";
import { Metadata } from "next";

import styles from "./layout.module.scss";
import { overrideMetadata } from "../layout";

export default function EarnLayout({ children }: React.PropsWithChildren) {
  return <main className={styles.main}>{children}</main>;
}

export const metadata: Metadata = overrideMetadata(
  "Earn",
  "Eonain Earn Application"
);
