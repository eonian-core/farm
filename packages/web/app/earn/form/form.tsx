"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card, FormElement, Input, Loading } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";
import { useWalletWrapperContext } from "../../providers/wallet/wallet-wrapper-provider";
import PercentButtonGroup from "./percent-button-group";

const Form = () => {
  const { wallet } = useWalletWrapperContext();
  const [formAction, setFormAction] = React.useState<FormAction>(
    FormAction.DEPOSIT
  );

  const balance = 300;
  const [value, setValue] = React.useState(balance);

  const handleSubmit = React.useCallback(() => {}, []);

  const handleValueChange = React.useCallback(
    (event: React.ChangeEvent<FormElement>) => {
      const { target } = event;
      setValue(+target.value);
    },
    [setValue]
  );

  return (
    <div className={styles.container}>
      <Card variant="bordered">
        <FormHeader
          currentAction={formAction}
          onCurrentActionChange={setFormAction}
        />
        <Card.Divider />
        <Card.Body className={styles.fragment}>
          <div className={styles.info}>
            <p>
              With the current <b>15.34% APY</b>, projected:
            </p>
            <ul>
              <li>
                Deposit Balance
                <span>
                  <b>1000 BTC</b> (+300 BTC)
                </span>
              </li>
              <li>
                Weekly reward
                <span>
                  <b>0.01 BTC</b> (+0.005 BTC)
                </span>
              </li>
              <li>
                Balance in year
                <span>
                  <b>280.3 BTC</b> (+98 BTC)
                </span>
              </li>
            </ul>
          </div>
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
            type="number"
            value={value}
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
