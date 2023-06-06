"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import PercentButtonGroup from "./percent-button-group";
import { Vault } from "../../../api";
import FormInput from "./form-input";
import VaultInfoCard from "./vault-info-card";

interface Props {
  vault: Vault;
}

const Form: React.FC<Props> = ({ vault }) => {
  const { wallet } = useWalletWrapperContext();
  const [formAction, setFormAction] = React.useState<FormAction>(
    FormAction.DEPOSIT
  );

  const currentDeposit = 500;
  const balance = 300;

  const [value, setValue] = React.useState(balance);
  const [displayValue, setDisplayValue] = React.useState(value + "");

  const handleSubmit = React.useCallback(() => {}, []);

  const handleValueChange = React.useCallback(
    (value: string | number) => {
      const newValue = String(value).replaceAll(",", ".");
      const valid = newValue.match(/^[0-9]*\.?[0-9]*$/);
      if (!valid) {
        return;
      }

      // Perhaps later we can consider to use some big decimal library for this.
      const numberValue = parseFloat(newValue);
      const safeValue = isNaN(numberValue) ? 0 : numberValue;
      setDisplayValue(newValue);
      setValue(safeValue);
    },
    [setValue, setDisplayValue]
  );

  return (
    <div className={styles.container}>
      <h4>
        {vault.name} ({vault.symbol})
      </h4>
      <Card variant="bordered">
        <FormHeader
          currentAction={formAction}
          onCurrentActionChange={setFormAction}
        />

        <Card.Divider />

        <VaultInfoCard
          className={styles.fragment}
          value={value}
          currentDeposit={currentDeposit}
          vault={vault}
          formAction={formAction}
        />

        <Card.Divider />

        <Card.Body className={styles.fragment}>
          <PercentButtonGroup
            inputValue={value}
            maxValue={balance}
            onValueChange={handleValueChange}
          />
          <FormInput
            assetSymbol={vault.underlyingAsset.symbol}
            value={displayValue}
            balance={balance}
            onChange={handleValueChange}
          />
          <FormButton formAction={formAction} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Form;
