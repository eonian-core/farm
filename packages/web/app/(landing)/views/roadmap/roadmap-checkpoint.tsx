import clsx from "clsx";
import React from "react";
import IconCheck from "../../../components/icons/icon-check";
import { CheckpointRenderData } from "./roadmap-checkpoint-strip";
import styles from "./roadmap-checkpoint.module.scss";

interface Props extends Omit<CheckpointRenderData, 'node'> {
  width: number;
  children: React.ReactNode;
}

const RoadmapCheckpoint: React.FC<Props> = ({ width, isPassed, title, date, children }) => {
  return (
    <div className="relative h-full px-4" style={{ width: `${width}px` }}>
      <h3 className="text-gray-300">{title}</h3>
      <div className="text-sm">{date}</div>
      <div className="mt-4 text-sm text-gray-400">{children}</div>
      <div className={styles.pin} />
      <div
        className={clsx(styles.point, { [styles["point--done"]]: isPassed })}
      >
        {isPassed && <IconCheck width={16} height={16} />}
      </div>
    </div>
  );
};

export default React.memo(RoadmapCheckpoint);
