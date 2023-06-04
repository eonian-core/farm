import { FormElement, Input, Loading } from "@nextui-org/react";
import React from "react";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";

import styles from "./form-input.module.scss";

interface Props {
  value: string;
  balance: number;
  onChange: (value: string) => void;
}

const FormInput: React.FC<Props> = ({ balance, value, onChange }) => {
  const { wallet } = useWalletWrapperContext();

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
      contentLeft={<Loading size="xs" />}
      contentRightStyling={false}
      contentRight={
        wallet ? (
          <span className={styles.balance}>Balance: {balance.toFixed(1)}</span>
        ) : null
      }
      onChange={handleInputValueChange}
    />
  );
};

export default FormInput;
