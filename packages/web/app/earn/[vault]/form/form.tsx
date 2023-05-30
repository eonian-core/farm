"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card, FormElement, Input, Loading } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import PercentButtonGroup from "./percent-button-group";
import IconBoxArrow from "../../../components/icons/icon-box-arrow";

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
          <header className={styles.apyInfo}>
            With the current <b>15.34% APY</b>, projected
          </header>
          <Card variant="bordered" className={styles.info}>
            <Card.Body>
              <ul>
                <li>
                  <h5>Yearly reward</h5>
                  <div>
                    <span>0.0131 BTC</span>
                    <IconBoxArrow />
                  </div>
                </li>
                <li>
                  <h5>Deposit in a year</h5>
                  <div>
                    <span>0.8 BTC</span>
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
