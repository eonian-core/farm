import clsx from "clsx";
import React from "react";
import IconCheck from "../../../components/icons/icon-check";
import { CheckpointRenderData } from "./roadmap-checkpoint-strip";
import styles from "./roadmap-checkpoint.module.scss";

interface Props extends Omit<CheckpointRenderData, "node"> {
  width: number;
  isCentered: boolean;
  children: React.ReactNode;
}

const RoadmapCheckpoint: React.FC<Props> = ({
  width,
  title,
  date,
  isPassed,
  isCentered,
  children,
}) => {
  return (
    <div
      className={clsx("relative h-full px-4", { "text-center px-6": isCentered })}
      style={{ width: `${width}px` }}
    >
      <h3 className="text-gray-300">{title}</h3>
      <div className="text-sm">{date}</div>
      <div className="mt-4 text-sm text-gray-400">{children}</div>
      <div className={clsx(styles.pin, { hidden: isCentered })} />
      <div
        className={clsx(styles.point, {
          [styles["point--done"]]: isPassed,
          [styles["point--centered"]]: isCentered,
        })}
      >
        {isPassed && <IconCheck width={20} height={20} />}
      </div>
    </div>
  );
};

export default React.memo(RoadmapCheckpoint);
