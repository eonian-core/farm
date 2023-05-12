"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card, Input, Loading } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";

const Form = () => {
  const [formAction, setFormAction] = React.useState<FormAction>("deposit");

  const handleSubmit = React.useCallback(() => {}, []);

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
          <Input
            value={300}
            css={{ width: "auto" }}
            bordered
            color="primary"
            placeholder="Loading..."
            size="xl"
            contentLeft={<Loading size="xs" />}
            contentRightStyling={false}
            contentRight={
              <span className={styles.inputBalance}>Balance: 300.00</span>
            }
          />
          <FormButton formAction={formAction} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Form;
