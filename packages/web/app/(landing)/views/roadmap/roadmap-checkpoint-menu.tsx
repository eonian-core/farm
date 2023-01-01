import clsx from "clsx";
import React from "react";
import IconChevron from "../../../components/icons/icon-chevron";
import { CheckpointRenderData } from "./roadmap-checkpoint-strip";

interface Props {
  activeCheckpointIndex: number;
  checkpoints: CheckpointRenderData[];
  onActiveCheckpointChanged: (index: number) => void;
}

const RoadmapCheckpointMenu: React.FC<Props> = ({
  checkpoints,
  activeCheckpointIndex,
  onActiveCheckpointChanged,
}) => {
  const handleChangeIndex = React.useCallback(
    (index: number) => {
      index = Math.max(Math.min(index, checkpoints.length - 1), 0);
      onActiveCheckpointChanged(index);
    },
    [checkpoints, onActiveCheckpointChanged]
  );

  return (
    <div className="mt-6 flex flex-row justify-center">
      <IconChevron
        width={28}
        height={28}
        className="rotate-180 cursor-pointer hover:text-gray-200"
        onClick={() => handleChangeIndex(activeCheckpointIndex - 1)}
      />
      {checkpoints.map((checkpoint, index) => {
        const classes = clsx(
          "cursor-pointer p-2 hover:opacity-80",
          index === activeCheckpointIndex ? "opacity-80" : "opacity-20"
        );
        return (
          <div key={index} data-tip={checkpoint.title} className="tooltip">
            <div className={classes} onClick={() => handleChangeIndex(index)}>
              <div className="h-3 w-3 rounded-full bg-gray-50"></div>
            </div>
          </div>
        );
      })}
      <IconChevron
        width={28}
        height={28}
        className="cursor-pointer hover:text-gray-200"
        onClick={() => handleChangeIndex(activeCheckpointIndex + 1)}
      />
    </div>
  );
};

export default React.memo(RoadmapCheckpointMenu);
