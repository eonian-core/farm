import type { ReactElement } from 'react'
import React, { Children, PureComponent } from 'react'
import clsx from 'clsx'
import Waves from './waves'
import type { RoadmapCheckpointProps } from './roadmap-checkpoint-strip'
import RoadmapCheckpointStrip from './roadmap-checkpoint-strip'
import RoadmapCheckpointMenu from './roadmap-checkpoint-menu'
import styles from './roadmap.module.scss'

export interface RoadmapProps {
  children: React.ReactNode
}

export interface RoadmapState {
  peaks: number
  width: number
  height: number
  centeredCheckpointIndex: number
}

export default class Roadmap extends PureComponent<RoadmapProps, RoadmapState> {
  private readonly containerRef: React.RefObject<HTMLDivElement>
  private readonly wavesRef: React.RefObject<Waves>
  private readonly stripRef: React.RefObject<RoadmapCheckpointStrip>

  // Duration of the wave scrolling animation
  private readonly transitionDuration = 300

  // Animation start timestamp
  private transitionStart: number = -1

  // Currently active animation frame id
  private transitionFrameId: number = -1

  // Wave height relative to its zero
  private readonly waveHeight

  // Wave line width
  private readonly waveThickness

  // Peak wave height (including thickness) relative to the bottom of the container
  private readonly wavePeakHeight

  constructor(props: RoadmapProps) {
    super(props)

    this.containerRef = React.createRef()
    this.wavesRef = React.createRef()
    this.stripRef = React.createRef()

    this.waveHeight = 32
    this.waveThickness = 25
    this.wavePeakHeight = this.waveHeight * 2 + this.waveThickness

    this.state = {
      peaks: 0,
      width: 0,
      height: 0,
      centeredCheckpointIndex: -1,
    }
  }

  static getDerivedStateFromProps({ children }: RoadmapProps, state: RoadmapState) {
    const { centeredCheckpointIndex: currentIndex } = state
    if (currentIndex >= 0) {
      return null
    }

    const firstUndoneCheckpointIndex = (
      Children.toArray(children) as Array<ReactElement<RoadmapCheckpointProps>>
    ).findIndex(checkpoint => !checkpoint?.props.completed)

    return {
      centeredCheckpointIndex: Math.max(firstUndoneCheckpointIndex, 0),
    }
  }

  componentDidMount(): void {
    this.handleResize()

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount(): void {
    cancelAnimationFrame(this.transitionFrameId)

    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    const { centeredCheckpointIndex, width, height, peaks } = this.state
    const { children } = this.props

    return (
      <div ref={this.containerRef} className={clsx(styles.overlay)}>
        <RoadmapCheckpointStrip
          ref={this.stripRef}
          containerWidth={width}
          peaks={peaks}
          wavePeakHeight={this.wavePeakHeight}
          startAt={centeredCheckpointIndex}
        >
          {children}
        </RoadmapCheckpointStrip>

        <Waves
          ref={this.wavesRef}
          peaks={peaks}
          width={width}
          height={height}
          waveHeight={this.waveHeight}
          waveThickness={this.waveThickness}
          startAt={centeredCheckpointIndex}
        />

        <RoadmapCheckpointMenu
          activeCheckpointIndex={centeredCheckpointIndex}
          count={Children.toArray(children).length}
          onActiveCheckpointChanged={this.handleSetCenteredCheckpointIndex}
        />
      </div>
    )
  }

  /**
   * Main handler for the scrolling animation, used for Component & Canvas animation sync.
   * Simultaneously performs the roadmap-strip and canvas animation by passing the current animation progress.
   * @param timestamp the current timestamp
   */
  private animate = (timestamp: number) => {
    const delta = timestamp - this.transitionStart
    const progress = Math.min(this.easing(delta / this.transitionDuration), 1)

    this.wavesRef.current?.animate(progress)
    this.stripRef.current?.animate(progress)

    if (delta < this.transitionDuration) {
      this.transitionFrameId = requestAnimationFrame(this.animate)
    }
  }

  /**
   * Starts the transition animation to the specified roadmap checkpoint.
   * Cancels the current animation (if any).
   * @param index the index of the roadmap checkpoint.
   */
  private startTransition(index: number) {
    cancelAnimationFrame(this.transitionFrameId)

    this.transitionStart = performance.now()

    this.wavesRef.current?.prepareAnimation(index)
    this.stripRef.current?.prepareAnimation(index)

    this.animate(this.transitionStart)
  }

  /**
   * Ease-In-Out (Quint) https://easings.net/#easeInOutQuint
   */
  private easing(x: number): number {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2
  }

  /**
   * Resize handler. Sets the width and height used for the canvas size.
   * Also sets the number of peaks to maintain the screen adaptivity.
   */
  private handleResize = () => {
    const { current: container } = this.containerRef
    const windowWidth = window.innerWidth

    this.setState({
      width: container?.offsetWidth ?? 0,
      height: container?.offsetHeight ?? 0,
      peaks: windowWidth > 1024 ? 3 : windowWidth > 640 ? 2 : 1,
    })
  }

  private handleSetCenteredCheckpointIndex = (index: number) => {
    const { centeredCheckpointIndex: prevIndex } = this.state
    this.setState({ centeredCheckpointIndex: index }, () => {
      index !== prevIndex && this.startTransition(index)
    })
  }
}
