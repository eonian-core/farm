"use client";

import { Button, ButtonProps } from "@nextui-org/react";
import React from "react";

import styles from "./percent-button-group.module.scss";

interface Props extends ButtonProps {
  inputValue: number;
  maxValue: number;
  onValueChange: (value: number) => void;
}

const COUNT = 4;

export const PercentButtonGroup: React.FC<Props> = ({
  inputValue,
  maxValue,
  onValueChange,
  ...restProps
}) => {
  return (
    <div className={styles.container}>
      {new Array(COUNT).fill(0).map((_, index) => {
        const value = (100 / COUNT) * (index + 1);
        const factor = value / 100;
        const isActive = inputValue / maxValue === factor;
        return (
          <Button
            key={index}
            className={styles.button}
            color="primary"
            auto
            bordered={!isActive}
            onPress={() => onValueChange(maxValue * factor)}
            {...restProps}
          >
            {value}%
          </Button>
        );
      })}
    </div>
  );
};
