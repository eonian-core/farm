import { Table } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import { Vault } from "../../api";
import { InternalLink } from "../../components/links/links";
import { ScreenName, useScreenName } from "../../components/resize-hooks/screens";
import {
  VaultAPYCell,
  VaultNameCell,
  VaultIndexCell,
  VaultTVLCell,
  VaultYouPositionCell,
} from "./cells";

import styles from "./vault-table.module.scss";

interface Props {
  chainName: string;
  vaults: Vault[];
}

interface Column {
  name: string;
  render: (vault: Vault, index: number) => React.ReactNode;
  align?: "start" | "center";
  moveLinkBack?: boolean;
}

const COLUMNS: Column[] = [
  { name: "#", render: (vault, index) => <VaultIndexCell index={index} /> },
  { name: "Vault", render: (vault) => <VaultNameCell vault={vault} /> },
  {
    name: "APY",
    render: (vault) => <VaultAPYCell vault={vault} />,
    align: "center",
  },
  {
    name: "TVL",
    render: (vault) => <VaultTVLCell vault={vault} />,
    align: "center",
    moveLinkBack: true,
  },
  {
    name: "Your position",
    render: (vault) => <VaultYouPositionCell vault={vault} />,
    align: "center",
    moveLinkBack: true,
  },
];

export function VaultTable({ vaults, chainName }: Props) {
  const columns = useColumns();
  return (
    <Table
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[]}
      css={{ background: "$dark" }}
      className={styles.table}
      shadow
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            css={{ paddingRight: "var(--nextui-space-5)" }}
            align={column.align}
            key={column.name}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={vaults}>
        {(vault) => renderVaultRow(vault, columns)}
      </Table.Body>
    </Table>
  );

  function renderVaultRow(vault: Vault, columns: Column[]) {
    const vaultIndex = vaults.indexOf(vault);
    return (
      <Table.Row key={vault.address}>
        {(key) => {
          const columnIdx = columns.findIndex(({ name }) => name === key);
          const column = columns[columnIdx];
          return (
            <Table.Cell css={{ cursor: "pointer", textAlign: column.align }}>
              <LinkOverlay vault={vault} moveBack={column.moveLinkBack} />
              <div className={styles.cell} onClick={clickLinkUnderneath}>
                {column.render(vault, vaultIndex)}
              </div>
            </Table.Cell>
          );
        }}
      </Table.Row>
    );
  }

  function LinkOverlay(props: { vault: Vault; moveBack?: boolean }) {
    const { vault, moveBack } = props;
    const href = `/earn/${chainName}/${vault.symbol}`;
    const classNames = clsx(styles.link, { [styles.moveBack]: moveBack });
    return <InternalLink href={href} className={classNames} />;
  }
}

function useColumns() {
  const screenName = useScreenName();
  switch (screenName) {
    case ScreenName.SMALL_MOBILE:
    case ScreenName.MOBILE:
      return COLUMNS.slice(1, 3);
    case ScreenName.TABLET:
      return COLUMNS.slice(1, -1);
    default:
      return COLUMNS;
  }
}

function clickLinkUnderneath(event: React.MouseEvent) {
  const element = event.currentTarget as HTMLElement;
  const display = window.getComputedStyle(element).display;

  element.style.display = "none";
  const { clientX: x, clientY: y } = event;
  const elementAtPoint = document.elementFromPoint(x, y);
  element.style.display = display;

  if (elementAtPoint && elementAtPoint.tagName.toLowerCase() === "a") {
    const linkElement = elementAtPoint as HTMLLinkElement;
    linkElement.click();
  }
}
