"use client";

import { Card } from "@nextui-org/react";
import React from "react";

import CompactNumber from "../../../components/compact-number/compact-number";
import IconBoxArrow from "../../../components/icons/icon-box-arrow";

import styles from "./vault-info-card.module.scss";
import { calculateVaultAPY } from "../../../shared/projections/calculate-apy";
import { FormAction } from "./form-header";
import { Vault } from "../../../api";
import clsx from "clsx";

interface Props {
  value: number;
  currentDeposit: number;
  vault: Vault;
  formAction: FormAction;
  className?: string;
}

const VaultInfoCard: React.FC<Props> = ({
  value,
  currentDeposit,
  vault,
  formAction,
  className,
}) => {
  const { symbol: assetSymbol } = vault.underlyingAsset;

  const apy = React.useMemo(() => calculateVaultAPY(vault), [vault]);

  const total = React.useMemo(() => {
    return formAction === FormAction.DEPOSIT
      ? currentDeposit + value
      : Math.max(currentDeposit - value, 0);
  }, [currentDeposit, value, formAction]);

  const currentYearlyReward = React.useMemo(() => {
    return currentDeposit * (apy / 100);
  }, [currentDeposit, apy]);

  const yearlyReward = React.useMemo(() => {
    return total * (apy / 100);
  }, [total, apy]);

  const depositInAYear = React.useMemo(() => {
    return total + yearlyReward;
  }, [total, yearlyReward]);

  const profitChange = React.useMemo(() => {
    return yearlyReward - currentYearlyReward;
  }, [yearlyReward, currentYearlyReward]);

  return (
    <Card.Body className={className}>
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
                <ProfitChangeIndicator profitChange={profitChange} />
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
                <ProfitChangeIndicator profitChange={profitChange} />
              </div>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Card.Body>
  );
};

function ProfitChangeIndicator({ profitChange }: { profitChange: number }) {
  const direction = React.useMemo(
    () => (profitChange > 0 ? "top" : "bottom"),
    [profitChange]
  );

  if (!profitChange) {
    return null;
  }

  const className = clsx({
    [styles.positiveChange]: profitChange > 0,
    [styles.negativeChange]: profitChange < 0,
  });

  return (
    <span className={className}>
      <IconBoxArrow direction={direction} />
    </span>
  );
}

export default VaultInfoCard;
