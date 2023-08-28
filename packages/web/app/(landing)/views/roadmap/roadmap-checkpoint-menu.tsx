import clsx from 'clsx'
import React from 'react'
import IconChevron from '../../../components/icons/icon-chevron'
import styles from './roadmap-checkpoint-menu.module.scss'

export interface RoadmapCheckpointMenuProps {
  activeCheckpointIndex: number
  count: number
  onActiveCheckpointChanged: (index: number) => void
}

const RoadmapCheckpointMenu: React.FC<RoadmapCheckpointMenuProps> = ({
  count,
  activeCheckpointIndex,
  onActiveCheckpointChanged,
}) => {
  const handleChangeIndex = React.useCallback(
    (index: number) => {
      index = Math.max(Math.min(index, count - 1), 0)
      onActiveCheckpointChanged(index)
    },
    [count, onActiveCheckpointChanged],
  )

  return (
    <div className={styles.menu}>
      <Chevron
        left={true}
        disabled={activeCheckpointIndex === 0}
        onClick={() => handleChangeIndex(activeCheckpointIndex - 1)}
      />

      {Array.from({ length: count }).fill(0).map((_, index) => (
        <div
          key={index}
          className={clsx(styles.point, { [styles.active]: index === activeCheckpointIndex })}
          onClick={() => handleChangeIndex(index)}
        >
          <div className={styles.pointDot}></div>
        </div>
      ))}

      <Chevron
        disabled={activeCheckpointIndex === count - 1}
        onClick={() => handleChangeIndex(activeCheckpointIndex + 1)}
      />
    </div>
  )
}

export interface ChevronProps {
  onClick: VoidFunction
  left?: boolean
  disabled?: boolean
}

function Chevron({ onClick, left = false, disabled = false }: ChevronProps) {
  return <IconChevron
    width={28}
    height={28}
    onClick={onClick}
    className={clsx({
      [styles.chevron]: !disabled,
      [styles.chevronLeft]: left,
      [styles.chevronDiabled]: disabled,
    })}
  />
}

export default React.memo(RoadmapCheckpointMenu)
