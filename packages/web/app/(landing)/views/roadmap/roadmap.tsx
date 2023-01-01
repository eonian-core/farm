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
  width: number;
  height: number;
  centeredCheckpointIndex: number;
  checkpoints: CheckpointRenderData[];
  content: React.ReactNode[];
}

export default class Roadmap extends PureComponent<Props, State> {
  private containerRef: React.RefObject<HTMLDivElement>;
  private wavesRef: React.RefObject<Waves>;
  private stripRef: React.RefObject<RoadmapCheckpointStrip>;

  private readonly transitionDuration = 300;
  private transitionStart: number = -1;
  private transitionFrameId: number = -1;

  constructor(props: Props) {
    super(props);

    this.containerRef = React.createRef();
    this.wavesRef = React.createRef();
    this.stripRef = React.createRef();

    this.state = {
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
    const { content, checkpoints, centeredCheckpointIndex, width, height } =
      this.state;

    const peaks = 3;
    const waveHeight = 32;
    const waveThickness = 25;
    const wavePeakHeight = waveHeight * 2 + waveThickness;

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
            wavePeakHeight={wavePeakHeight}
            checkpoints={checkpoints}
            startAt={centeredCheckpointIndex}
          />
          <Waves
            ref={this.wavesRef}
            peaks={peaks}
            width={width}
            height={height}
            waveHeight={waveHeight}
            waveThickness={waveThickness}
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

  private animate = (timestamp: number) => {
    const delta = timestamp - this.transitionStart;
    const progress = Math.min(delta / this.transitionDuration, 1);

    this.wavesRef.current?.animate(progress);
    this.stripRef.current?.animate(progress);

    if (delta < this.transitionDuration) {
      this.transitionFrameId = requestAnimationFrame(this.animate);
    }
  };

  private startTransition(index: number) {
    cancelAnimationFrame(this.transitionFrameId);

    this.transitionStart = performance.now();

    this.wavesRef.current?.prepareAnimation(index);
    this.stripRef.current?.prepareAnimation(index);

    this.animate(this.transitionStart);
  }

  private handleResize = () => {
    const { current: container } = this.containerRef;
    this.setState({
      width: container?.offsetWidth ?? 0,
      height: container?.offsetHeight ?? 0,
    });
  };

  private handleSetCenteredCheckpointIndex = (index: number) => {
    const { centeredCheckpointIndex: prevIndex } = this.state;
    this.setState({ centeredCheckpointIndex: index }, () => {
      index !== prevIndex && this.startTransition(index);
    });
  };

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
