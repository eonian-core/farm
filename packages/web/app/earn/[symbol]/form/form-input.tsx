"use client";

import { FormElement, Input, Loading } from "@nextui-org/react";
import React from "react";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";

import styles from "./form-input.module.scss";
import IconCoin from "../../../components/icons/icon-coin";

interface Props {
  value: string;
  balance: number;
  assetSymbol: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const FormInput: React.FC<Props> = ({
  assetSymbol,
  balance,
  value,
  onChange,
  isLoading,
}) => {
  const handleInputValueChange = React.useCallback(
    (event: React.ChangeEvent<FormElement>) => onChange(event.target.value),
    [onChange]
  );

  return (
    <Input
      className={styles.input}
      value={value}
      bordered
      color="primary"
      placeholder="0"
      size="xl"
      contentLeft={
        <IconCoin symbol={assetSymbol} width="1.5em" height="1.5em" />
      }
      contentRightStyling={false}
      contentRight={<InputRightContent balance={balance} isLoading={isLoading} />}
      onChange={handleInputValueChange}
      disabled={isLoading}
    />
  );
};

function InputRightContent({
  balance,
  isLoading,
}: Pick<Props, "balance" | "isLoading">) {
  const { wallet } = useWalletWrapperContext();
  if (isLoading) {
    return <Loading className={styles.loading} size="sm" />;
  }
  return <span className={styles.balance}>Balance: {balance.toFixed(1)}</span>;
}

export default FormInput;
