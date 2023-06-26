"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";
import PercentButtonGroup from "./percent-button-group";
import { Vault } from "../../../api";
import FormInput from "./form-input";
import VaultInfoCard from "./vault-info-card";
import { useNumberInputValue } from "./use-number-input-value";
import useVaultUserInfo from "./use-vault-user-info";
import { useAppSelector } from "../../../store/hooks";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { WalletStatus } from "../../../providers/wallet/wrappers/types";
import { toast } from "react-toastify";

interface Props {
  vault: Vault;
}

const Form: React.FC<Props> = ({ vault }) => {
  const { wallet, status, chains } = useWalletWrapperContext();

  useVaultUserInfo(vault, { autoUpdateInterval: 5000 });

  const { walletBalance, vaultBalance, isLoading, lastRequestForWallet } =
    useAppSelector((state) => state.vaultUser);

  const isFirstRequestFinished = lastRequestForWallet === wallet?.address;
  const isWalletNotConnected = status === WalletStatus.NOT_CONNECTED;
  const isFormReady =
    !isLoading || isFirstRequestFinished || isWalletNotConnected;

  const [formAction, setFormAction] = React.useState<FormAction>(
    FormAction.DEPOSIT
  );

  // TODO: Refactor this logic. Temporarily (for alpha test) we use only one chain, later we will have multiple supported chains.
  const vaultChain = React.useMemo(() => {
    return chains.find((chain) => chain.isDefault)!;
  }, [chains]);

  const [value, displayValue, handleValueChange] =
    useNumberInputValue(walletBalance);

  const handleSubmit = React.useCallback(() => {
    toast("Wow so easy !");
  }, []);

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
          currentDeposit={vaultBalance}
          vault={vault}
          formAction={formAction}
        />

        <Card.Divider />

        <Card.Body className={styles.fragment}>
          <PercentButtonGroup
            inputValue={value}
            maxValue={walletBalance}
            onValueChange={handleValueChange}
          />
          <FormInput
            assetSymbol={vault.underlyingAsset.symbol}
            value={displayValue}
            balance={walletBalance}
            onChange={handleValueChange}
            isLoading={!isFormReady}
          />
          <FormButton
            vaultChain={vaultChain}
            disabled={!isFormReady}
            formAction={formAction}
            onSubmit={handleSubmit}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Form;
