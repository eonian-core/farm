import React, { Component } from 'react'
import styles from './roadmap-checkpoint.module.scss'

export interface RoadmapCheckpointProps {
  completed: boolean
  date: string
  title: string
  href: string
  children: React.ReactNode
}

export interface RoadmapCheckpointStripProps {
  containerWidth: number
  peaks: number
  wavePeakHeight: number
  children: React.ReactNode
  startAt: number
}

export interface RoadmapContextState {
  width: number
  isCentered: boolean
}

export const RoadmapContext = React.createContext<RoadmapContextState>({ width: 100, isCentered: false })

export default class RoadmapCheckpointStrip extends Component<RoadmapCheckpointStripProps> {
  private ref: React.RefObject<HTMLDivElement>

  private regExp = /translateX\('?"?(\-?.*)px\D*\)/
  private currentX: number
  private targetX: number

  constructor(props: RoadmapCheckpointStripProps) {
    super(props)

    this.ref = React.createRef()

    this.currentX = 0
    this.targetX = 0
  }

  shouldComponentUpdate(nextProps: Readonly<RoadmapCheckpointStripProps>): boolean {
    const { peaks, containerWidth } = this.props
    return peaks !== nextProps.peaks || containerWidth !== nextProps.containerWidth
  }

  render() {
    const { wavePeakHeight, children, startAt, peaks } = this.props
    return (
      <div
        ref={this.ref}
        className={styles.strip}
        style={{
          padding: `2rem ${this.halfPeakWidth}px ${wavePeakHeight}px ${this.halfPeakWidth}px`,
          transform: `translateX(${this.getOffset(startAt)}px)`,
        }}
      >
        <RoadmapContext.Provider
          value={{
            width: this.checkpointWidth,
            isCentered: peaks === 1,
          }}
        >
          {children}
        </RoadmapContext.Provider>
      </div>
    )
  }

  private get halfPeakWidth(): number {
    const { containerWidth, peaks } = this.props
    return containerWidth / (peaks * 2)
  }

  private get checkpointWidth(): number {
    return this.halfPeakWidth * 2
  }

  private getOffset(index: number): number {
    const { containerWidth, peaks } = this.props
    const delta = peaks > 1 ? peaks % 2 : -1
    const offset = peaks > 1 ? 0 : containerWidth / 2

    return -this.checkpointWidth * (index - delta) + offset
  }

  public prepareAnimation(moveTo: number) {
    const { current: strip } = this.ref
    if (!strip) {
      return
    }

    this.currentX = +this.regExp.exec(strip.style.transform)![1]
    this.targetX = this.getOffset(moveTo)
  }

  public animate = (progress: number) => {
    const { current: strip } = this.ref
    if (!strip) {
      return
    }

    const x = this.currentX + (this.targetX - this.currentX) * progress
    strip.style.transform = `translateX(${x}px)`
  }
}
