import React, { Children, PureComponent } from "react";
import Waves from "./waves";
import RoadmapCheckpointStrip, {
  CheckpointRenderData,
} from "./roadmap-checkpoint-strip";
import RoadmapCheckpointMenu from "./roadmap-checkpoint-menu";
import styles from "./roadmap.module.scss";
import clsx from "clsx";
import Spinner from "../../../components/spinner/spinner";

interface Props {
  children: React.ReactNode;
}

interface State {
  peaks: number;
  width: number;
  height: number;
  centeredCheckpointIndex: number;
  checkpoints: CheckpointRenderData[];
  content: React.ReactNode[];
}

export default class Roadmap extends PureComponent<Props, State> {
  private readonly containerRef: React.RefObject<HTMLDivElement>;
  private readonly wavesRef: React.RefObject<Waves>;
  private readonly stripRef: React.RefObject<RoadmapCheckpointStrip>;

  // Duration of the wave scrolling animation
  private readonly transitionDuration = 300;

  // Animation start timestamp
  private transitionStart: number = -1;

  // Currently active animation frame id
  private transitionFrameId: number = -1;

  // Wave height relative to its zero
  private readonly waveHeight;

  // Wave line width
  private readonly waveThickness;

  // Peak wave height (including thickness) relative to the bottom of the container
  private readonly wavePeakHeight;

  constructor(props: Props) {
    super(props);

    this.containerRef = React.createRef();
    this.wavesRef = React.createRef();
    this.stripRef = React.createRef();

    this.waveHeight = 32;
    this.waveThickness = 25;
    this.wavePeakHeight = this.waveHeight * 2 + this.waveThickness;

    this.state = {
      peaks: 0,
      width: 0,
      height: 0,
      centeredCheckpointIndex: -1,
      checkpoints: [],
      content: [],
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { centeredCheckpointIndex: currentIndex } = state;
    if (currentIndex >= 0) {
      return null;
    }

    const { content, checkpoints } = Roadmap.groupChildren(props.children);
    const firstUndoneCheckpointIndex = checkpoints.findIndex(
      (checkpoint) => !checkpoint.isPassed
    );
    return {
      content,
      checkpoints,
      centeredCheckpointIndex: Math.max(firstUndoneCheckpointIndex - 1, 0),
    };
  }

  componentDidMount(): void {
    this.handleResize();

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount(): void {
    cancelAnimationFrame(this.transitionFrameId);

    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    const {
      content,
      checkpoints,
      centeredCheckpointIndex,
      width,
      height,
      peaks,
    } = this.state;

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div>{content}</div>
        <div
          ref={this.containerRef}
          className={clsx("h-96 w-full", styles.overlay)}
        >
          <RoadmapCheckpointStrip
            ref={this.stripRef}
            containerWidth={width}
            peaks={peaks}
            wavePeakHeight={this.wavePeakHeight}
            checkpoints={checkpoints}
            startAt={centeredCheckpointIndex}
          />
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
            checkpoints={checkpoints}
            onActiveCheckpointChanged={this.handleSetCenteredCheckpointIndex}
          />
        </div>
      </div>
    );
  }

  /**
   * Main handler for the scrolling animation, used for Component & Canvas animation sync.
   * Simultaneously performs the roadmap-strip and canvas animation by passing the current animation progress.
   * @param timestamp the current timestamp
   */
  private animate = (timestamp: number) => {
    const delta = timestamp - this.transitionStart;
    const progress = Math.min(this.easing(delta / this.transitionDuration), 1);

    this.wavesRef.current?.animate(progress);
    this.stripRef.current?.animate(progress);

    if (delta < this.transitionDuration) {
      this.transitionFrameId = requestAnimationFrame(this.animate);
    }
  };

  /**
   * Starts the transition animation to the specified roadmap checkpoint.
   * Cancels the current animation (if any).
   * @param index the index of the roadmap checkpoint.
   */
  private startTransition(index: number) {
    cancelAnimationFrame(this.transitionFrameId);

    this.transitionStart = performance.now();

    this.wavesRef.current?.prepareAnimation(index);
    this.stripRef.current?.prepareAnimation(index);

    this.animate(this.transitionStart);
  }

  /**
   * Ease-In-Out (Quint) https://easings.net/#easeInOutQuint
   */
  private easing(x: number): number {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

  /**
   * Resize handler. Sets the width and height used for the canvas size.
   * Also sets the number of peaks to maintain the screen adaptivity.
   */
  private handleResize = () => {
    const { current: container } = this.containerRef;
    const windowWidth = window.innerWidth;
    this.setState({
      width: container?.offsetWidth ?? 0,
      height: container?.offsetHeight ?? 0,
      peaks: windowWidth > 1024 ? 3 : windowWidth > 640 ? 2 : 1,
    });
  };

  private handleSetCenteredCheckpointIndex = (index: number) => {
    const { centeredCheckpointIndex: prevIndex } = this.state;
    this.setState({ centeredCheckpointIndex: index }, () => {
      index !== prevIndex && this.startTransition(index);
    });
  };

  /**
   * Extracts checkpoint components from the passed "children" props (required to work with MDX)
   * @param children the children prop content
   * @returns two groups - checkpoints and other components
   */
  private static groupChildren(children: React.ReactNode) {
    return Children.toArray(children).reduce(
      (groups, node: any) => {
        const props = node.props ?? {};
        if ("data-checkpoint" in props) {
          groups["checkpoints"].push({
            isPassed: props["data-passed"],
            date: props["data-date"],
            title: props["data-checkpoint"],
            node,
          });
        } else {
          groups["content"].push(node);
        }
        return groups;
      },
      {
        content: [] as React.ReactNode[],
        checkpoints: [] as CheckpointRenderData[],
      }
    );
  }
}

export const RoadmapLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size={40} />
    </div>
  );
};
