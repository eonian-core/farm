import clsx from "clsx";
import React from "react";
import IconChevron from "../../../components/icons/icon-chevron";

export interface RoadmapCheckpointMenuProps {
  activeCheckpointIndex: number;
  count: number;
  onActiveCheckpointChanged: (index: number) => void;
}

const RoadmapCheckpointMenu: React.FC<RoadmapCheckpointMenuProps> = ({
  count,
  activeCheckpointIndex,
  onActiveCheckpointChanged,
}) => {
  const handleChangeIndex = React.useCallback(
    (index: number) => {
      index = Math.max(Math.min(index, count - 1), 0);
      onActiveCheckpointChanged(index);
    },
    [count, onActiveCheckpointChanged]
  );

  return (
    <div className="mt-6 flex flex-row justify-center">
      <Chevron
        left={true}
        disabled={activeCheckpointIndex === 0}
        onClick={() => handleChangeIndex(activeCheckpointIndex - 1)}
      />

      {new Array(count).fill(0).map((checkpoint, index) => {
        const classes = clsx(
          "cursor-pointer p-2 hover:opacity-100",
          index === activeCheckpointIndex ? "opacity-80" : "opacity-20"
        );

        return (
          <div key={index} className="tooltip">
            <div className={classes} onClick={() => handleChangeIndex(index)}>
              <div className="h-3 w-3 rounded-full bg-gray-50"></div>
            </div>
          </div>
        );
      })}

      <Chevron
        disabled={activeCheckpointIndex === count - 1}
        onClick={() => handleChangeIndex(activeCheckpointIndex + 1)}
      />
    </div>
  );
};

function Chevron(props: {
  onClick: VoidFunction;
  left?: boolean;
  disabled?: boolean;
}) {
  const { onClick, left = false, disabled = false } = props;
  const classes = clsx({
    "rotate-180": left,
    "hover:text-gray-200 cursor-pointer": !disabled,
    "text-gray-600": disabled,
  });
  return (
    <IconChevron width={28} height={28} className={classes} onClick={onClick} />
  );
}

export default React.memo(RoadmapCheckpointMenu);
