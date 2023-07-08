"use client";

import { Card } from "@nextui-org/react";
import React from "react";

import { Vault } from "../../../api";

import CompactNumber from "../../../components/compact-number/compact-number";
import IconBoxArrow from "../../../components/icons/icon-box-arrow";

import styles from "./vault-info-card.module.scss";
import { calculateVaultAPY } from "../../../shared/projections/calculate-apy";
import clsx from "clsx";
import { FormAction } from "../../../store/slices/vaultActionSlice";

interface Props {
  value: bigint;
  currentDeposit: bigint;
  vault: Vault;
  formAction: FormAction;
  className?: string;
}

export const VaultInfoCard: React.FC<Props> = ({
  value,
  currentDeposit,
  vault,
  formAction,
  className,
}) => {
  const { symbol: assetSymbol } = vault.asset;

  const threshold = React.useMemo(() => {
    return BigInt(1e6) * 10n ** BigInt(vault.asset.decimals);
  }, [vault.asset.decimals]);

  const [apyPercents, apy, apyD] = React.useMemo(() => {
    const bps = 1e6;
    const apy = calculateVaultAPY(vault);
    return [apy, BigInt(parseInt(String(apy * bps))), BigInt(bps * 100)];
  }, [vault]);

  const total = React.useMemo(() => {
    switch (formAction) {
      case FormAction.DEPOSIT:
        return currentDeposit + value;
      case FormAction.WITHDRAW:
        return currentDeposit < value ? 0n : currentDeposit - value;
    }
  }, [currentDeposit, value, formAction]);

  const currentYearlyReward = React.useMemo(() => {
    return (currentDeposit * apy) / apyD;
  }, [currentDeposit, apy, apyD]);

  const yearlyReward = React.useMemo(() => {
    return (total * apy) / apyD;
  }, [total, apy, apyD]);

  const depositInAYear = React.useMemo(() => {
    return total + yearlyReward;
  }, [total, yearlyReward]);

  const profitChange = React.useMemo(() => {
    return yearlyReward - currentYearlyReward;
  }, [yearlyReward, currentYearlyReward]);

  return (
    <Card.Body className={className}>
      <header className={styles.apyInfo}>
        With the current <b>{apyPercents.toFixed(2)}% APY</b>, projected
      </header>
      <Card variant="bordered" className={styles.info}>
        <Card.Body>
          <ul>
            <li>
              <h5>Yearly reward</h5>
              {renderInfoNumber(yearlyReward)}
            </li>
            <li>
              <h5>Deposit in a year</h5>
              {renderInfoNumber(depositInAYear)}
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Card.Body>
  );

  function renderInfoNumber(value: bigint) {
    return (
      <div className={styles.infoNumberWrapper}>
        <CompactNumber
          value={value}
          decimals={vault.asset.decimals}
          threshold={threshold}
          fractionDigits={2}
          className={styles.infoNumber}
          tooltipContent={(value) => `${value} ${assetSymbol}`}
        >
          <span className={styles.asset}>{assetSymbol}</span>
          <ProfitChangeIndicator profitChange={profitChange} />
        </CompactNumber>
      </div>
    );
  }
};

function ProfitChangeIndicator({ profitChange }: { profitChange: bigint }) {
  const direction = React.useMemo(
    () => (profitChange > 0 ? "top" : "bottom"),
    [profitChange]
  );

  if (!profitChange) {
    return null;
  }

  const className = clsx({
    [styles.positiveChange]: profitChange > 0n,
    [styles.negativeChange]: profitChange < 0n,
  });

  return (
    <span className={className}>
      <IconBoxArrow direction={direction} />
    </span>
  );
}
