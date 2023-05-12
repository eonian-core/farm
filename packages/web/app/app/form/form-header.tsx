"use client";

import React from "react";
import { Card, Button, Spacer, PressEvent } from "@nextui-org/react";

import styles from "./form-header.module.scss";
import clsx from "clsx";

export type FormAction = "deposit" | "withdraw";

interface Props {
  currentAction: FormAction;
  onCurrentActionChange: (value: FormAction) => void;
}

const FormHeader: React.FC<Props> = ({
  currentAction,
  onCurrentActionChange,
}) => {
  const handleClick = React.useCallback(
    (event: PressEvent) => {
      const target = event.target as HTMLElement;
      onCurrentActionChange(target.dataset.key as FormAction);
    },
    [onCurrentActionChange]
  );

  return (
    <Card.Header className={styles.header}>
      {renderButton("deposit", "Deposit")}
      {renderButton("withdraw", "Withdraw")}

      <div
        className={clsx(styles.underline, {
          [styles.underlineMoved]: currentAction === "withdraw",
        })}
      />
    </Card.Header>
  );

  function renderButton(key: FormAction, text: string) {
    const isActive = key === currentAction;
    const classNames = clsx(styles.button, { [styles.buttonActive]: isActive });
    return (
      <Button
        data-key={key}
        onPress={handleClick}
        className={classNames}
        size="lg"
        light
      >
        {text}
      </Button>
    );
  }
};

export default FormHeader;
