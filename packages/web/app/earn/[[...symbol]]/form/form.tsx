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
    (event: React.ChangeEvent<FormElement>) => {
      const { target } = event;
      const value = target.value.replaceAll(",", ".");
      const valid = value.match(/^[0-9]*\.?[0-9]*$/);
      if (!valid) {
        return;
      }

      // Perhaps later we can consider to use some big decimal library for this.
      const numberValue = parseFloat(value);
      const safeValue = isNaN(numberValue) ? 0 : Math.min(numberValue, balance);
      setDisplayValue(safeValue === balance ? String(safeValue) : value);
      setValue(safeValue);
    },
    [setValue, setDisplayValue, balance]
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
      Vault: {vault.name}
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
                    <span>{yearlyReward.toFixed(2)} BTC</span>
                    <IconBoxArrow />
                  </div>
                </li>
                <li>
                  <h5>Deposit in a year</h5>
                  <div>
                    <span>{depositInAYear.toFixed(2)} BTC</span>
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
            onValueChange={setValue}
          />
          <Input
            className={styles.input}
            value={displayValue}
            bordered
            color="primary"
            placeholder="Loading..."
            size="xl"
            contentLeft={<Loading size="xs" />}
            contentRightStyling={false}
            contentRight={
              wallet ? (
                <span className={styles.inputBalance}>
                  Balance: {balance.toFixed(1)}
                </span>
              ) : null
            }
            onChange={handleValueChange}
          />
          <FormButton formAction={formAction} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Form;
