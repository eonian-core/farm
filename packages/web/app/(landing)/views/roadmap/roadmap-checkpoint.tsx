import clsx from "clsx";
import React from "react";
import IconCheck from "../../../components/icons/icon-check";
import IconExternal from "../../../components/icons/icon-external";
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
  url,
  isPassed,
  isCentered,
  children,
}) => {
  return (
    <a
      className={clsx(
        styles.container,
        "relative h-full px-4",
        { "px-10": isCentered },
        { "cursor-pointer": url }
      )}
      style={{ width: `${width}px` }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3 className="text-gray-300">
        {title}
        {url && <IconExternal size={12} className="ml-1 inline" />}
      </h3>
      <div className="text-sm">{date}</div>
      <div className={clsx(styles.content, "mt-4 text-sm text-gray-400")}>
        {children}
      </div>
      <div className={clsx(styles.pin, { hidden: isCentered })} />
      <div
        className={clsx(styles.point, {
          [styles["point--done"]]: isPassed,
          [styles["point--centered"]]: isCentered,
        })}
      >
        {isPassed && <IconCheck width={20} height={20} />}
      </div>
    </a>
  );
};

export default React.memo(RoadmapCheckpoint);
