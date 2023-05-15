"use client";

import React from "react";
import { Card, Button, PressEvent } from "@nextui-org/react";

import styles from "./form-header.module.scss";
import clsx from "clsx";

export const enum FormAction {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

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
      <TabButton
        action={FormAction.DEPOSIT}
        currentAction={currentAction}
        text="Deposit"
        onClick={handleClick}
      />
      <TabButton
        action={FormAction.WITHDRAW}
        currentAction={currentAction}
        text="Withdraw"
        onClick={handleClick}
      />

      <div
        className={clsx(styles.underline, {
          [styles.underlineMoved]: currentAction === FormAction.WITHDRAW,
        })}
      />
    </Card.Header>
  );
};

interface TabButtonProps {
  currentAction: FormAction;
  action: FormAction;
  text: string;
  onClick: (event: PressEvent) => void;
}

function TabButton({ action, currentAction, text, onClick }: TabButtonProps) {
  const classNames = clsx(styles.button, {
    [styles.buttonActive]: currentAction === action,
  });
  return (
    <Button
      data-key={action}
      onPress={onClick}
      className={classNames}
      size="lg"
      light
    >
      {text}
    </Button>
  );
}

export default FormHeader;
