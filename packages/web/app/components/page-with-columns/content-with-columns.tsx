import clsx from "clsx";
import React from "react";
import FadeInList from "../fade-in/fade-in-list";
import { MOBILE_SCREEN } from "../resize-hooks/screens";
import { useWindowSize } from "../resize-hooks/useWindowSize";
import { ColumnItemProps } from "./column-item";

import styles from "./content-with-columns.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ContentWithColumns: React.FC<Props> = ({ children, className }) => {
  const { items, other } = React.useMemo(
    () => extractItems(children),
    [children]
  );

  const { width: windowWidth = 0 } = useWindowSize();

  const columns = React.useMemo(
    () => splitToColumns(items, windowWidth < MOBILE_SCREEN ? 1 : 2),
    [items, windowWidth]
  );

  return (
    <div className={clsx(styles.container, className)}>
      {other}
      <div className={styles.columns}>{columns.map(renderColumn)}</div>
    </div>
  );

  function renderColumn(items: React.ReactElement[], index: number) {
    return (
      <FadeInList
        key={index}
        amount="some"
        initialDelay={0.1}
        className={styles.column}
      >
        {items.map((item) => item)}
      </FadeInList>
    );
  }
};

function splitToColumns(
  items: React.ReactElement[],
  columns = 2
): React.ReactElement[][] {
  return items.reduce((result, item, index) => {
    const column = index % columns;
    result[column] ??= [];
    result[column].push(item);
    return result;
  }, [] as React.ReactElement[][]);
}

function extractItems(children: React.ReactNode): {
  items: React.ReactElement[];
  other: React.ReactElement[];
} {
  const elements = React.Children.toArray(children) as React.ReactElement[];
  if (!Array.isArray(elements) || !elements.length) {
    return { items: [], other: [] };
  }
  return elements.reduce(
    (result, child) => {
      const props = child.props as ColumnItemProps;
      if (typeof props.title === "string") {
        result.items.push(child);
      } else {
        result.other.push(child);
      }
      return result;
    },
    { items: [], other: [] } as {
      items: React.ReactElement[];
      other: React.ReactElement[];
    }
  );
}

export default ContentWithColumns;
