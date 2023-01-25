import React from "react";
import styles from "./secops.module.scss";
import Container from "../../../components/contrainer/container";

export interface SecOpsProps {
  children: React.ReactNode;
}

export default function SecOps({
  children,
}: SecOpsProps) {
  return (
      <Container>
          <div className={styles.secops}>
              {children}
          </div>
      </Container>
  );
}
