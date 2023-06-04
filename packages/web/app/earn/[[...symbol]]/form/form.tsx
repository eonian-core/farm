"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card, FormElement, Input, Loading } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import PercentButtonGroup from "./percent-button-group";
import IconBoxArrow from "../../../components/icons/icon-box-arrow";
import { Vault } from "../../../api";
import { calculateVaultAPY } from "../../../components/helpers/calculate-apy";
import FormInput from "./form-input";
import CompactNumber from "../../../components/compact-number/compact-number";

interface Props {
  vault: Vault;
}

const Form: React.FC<Props> = ({ vault }) => {
  const { symbol: assetSymbol } = vault.underlyingAsset;

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

  const apy = React.useMemo(() => calculateVaultAPY(vault), [vault]);

  const total = React.useMemo(() => {
    return currentDeposit + value;
  }, [currentDeposit, value]);

  const yearlyReward = React.useMemo(() => {
    return total * (apy / 100);
  }, [total, apy]);

  const depositInAYear = React.useMemo(() => {
    return total + yearlyReward;
  }, [total, yearlyReward]);

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
        <Card.Body className={styles.fragment}>
          <header className={styles.apyInfo}>
            With the current <b>{apy.toFixed(2)}% APY</b>, projected
          </header>
          <Card variant="bordered" className={styles.info}>
            <Card.Body>
              <ul>
                <li>
                  <h5>Yearly reward</h5>
                  <div>
                    <span>
                      <CompactNumber
                        value={yearlyReward}
                        threshold={1e6}
                        fractionDigits={2}
                      />
                      {assetSymbol}
                    </span>
                    <IconBoxArrow />
                  </div>
                </li>
                <li>
                  <h5>Deposit in a year</h5>
                  <div>
                    <span>
                      <CompactNumber
                        value={depositInAYear}
                        threshold={1e6}
                        fractionDigits={2}
                      />
                      {assetSymbol}
                    </span>
                    <IconBoxArrow />
                  </div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Card.Body>
        <Card.Divider />
        <Card.Body className={styles.fragment}>
          <PercentButtonGroup
            inputValue={value}
            maxValue={balance}
            onValueChange={handleValueChange}
          />
          <FormInput
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
