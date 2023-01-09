import clsx from "clsx";
import React, { useContext } from "react";
import IconCheck from "../../../components/icons/icon-check";
import IconExternal from "../../../components/icons/icon-external";
import { RoadmapCheckpointProps, RoadmapContext } from "./roadmap-checkpoint-strip";
import styles from "./roadmap-checkpoint.module.scss";



const RoadmapCheckpoint: React.FC<RoadmapCheckpointProps> = ({
  title,
  date,
  href,
  completed,
  children,
}) => {
  const {width, isCentered} = useContext(RoadmapContext);
  
  return (
    <a
      className={clsx(
        styles.container,
        "relative h-full px-4",
        { "px-10": isCentered },
        { "cursor-pointer": href }
      )}
      style={{ width: `${width}px` }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3 className="text-gray-300">
        {title}
        {href && <IconExternal size={12} className="ml-1 inline" />}
      </h3>

      <div className="text-sm">{date}</div>
      
      <div className={clsx(styles.content, "mt-4 text-sm text-gray-400")}>
        {children}
      </div>
      
      <div className={clsx(styles.pin, { hidden: isCentered })} />
      
      <div
        className={clsx(styles.point, {
          [styles["point--done"]]: completed,
          [styles["point--centered"]]: isCentered,
        })}
      >
        {completed && <IconCheck width={20} height={20} />}
      </div>
    </a>
  );
};

RoadmapCheckpoint.displayName = "RoadmapCheckpoint";

export default RoadmapCheckpoint;
