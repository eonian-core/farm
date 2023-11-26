import clsx from 'clsx'
import React, { useContext } from 'react'
import { H3Context } from '../../../components/heading/heading'
import IconCheck from '../../../components/icons/icon-check'
import type { RoadmapCheckpointProps } from './roadmap-checkpoint-strip'
import { RoadmapContext } from './roadmap-checkpoint-strip'
import styles from './roadmap-checkpoint.module.scss'

const RoadmapCheckpoint: React.FC<RoadmapCheckpointProps> = ({ href, completed, children }) => {
  const { width, isCentered } = useContext(RoadmapContext)

  return (
    <a
      className={clsx(styles.container, { [styles.pointer]: !!href })}
      style={{ width: `${width}px` }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <H3Context.Provider value={{ isExternalLink: !!href }}>
        {children}

        <div className={clsx(styles.pin, { [styles.hidden]: isCentered })} />

        <div
          className={clsx(styles.point, {
            [styles['point--done']]: completed,
            [styles['point--centered']]: isCentered,
          })}
        >
          {completed && <IconCheck width={20} height={20} />}
        </div>
      </H3Context.Provider>
    </a>
  )
}

RoadmapCheckpoint.displayName = 'RoadmapCheckpoint'

export default RoadmapCheckpoint
