"use client";

import { Card } from "@nextui-org/react";
import React from "react";

import styles from "./table-container.module.scss";

export function TableContainer({ children }: React.PropsWithChildren) {
  return (
    <Card className={styles.container}>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}
