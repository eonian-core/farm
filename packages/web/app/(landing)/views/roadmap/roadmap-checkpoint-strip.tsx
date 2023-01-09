import React, { Component } from "react";
import RoadmapCheckpoint from "./roadmap-checkpoint";

export interface CheckpointRenderData {
  isPassed: boolean;
  title: string;
  date: string;
  url?: string;
  node: React.ReactNode;
}

interface Props {
  containerWidth: number;
  peaks: number;
  wavePeakHeight: number;
  checkpoints: CheckpointRenderData[];
  startAt: number;
}

export default class RoadmapCheckpointStrip extends Component<Props> {
  private ref: React.RefObject<HTMLDivElement>;

  private regExp = /translateX\('?"?(\-?.*)px\D*\)/;
  private currentX: number;
  private targetX: number;

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef();

    this.currentX = 0;
    this.targetX = 0;
  }

  shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const { peaks, containerWidth } = this.props;
    return (
      peaks !== nextProps.peaks || containerWidth !== nextProps.containerWidth
    );
  }

  render() {
    const { wavePeakHeight, checkpoints, startAt } = this.props;
    return (
      <div
        ref={this.ref}
        className="absolute inset-y-0 flex flex-row"
        style={{
          padding: `${wavePeakHeight}px ${this.halfPeakWidth}px`,
          transform: `translateX(${this.getOffset(startAt)}px)`,
        }}
      >
        {checkpoints.map(this.renderCheckpoint)}
      </div>
    );
  }

  private get halfPeakWidth(): number {
    const { containerWidth, peaks } = this.props;
    return containerWidth / (peaks * 2);
  }

  private get checkpointWidth(): number {
    return this.halfPeakWidth * 2;
  }

  private getOffset(index: number): number {
    const { containerWidth, peaks } = this.props;
    const delta = peaks > 1 ? peaks % 2 : -1;
    const offset = peaks > 1 ? 0 : containerWidth / 2;
    return -this.checkpointWidth * (index - delta) + offset;
  }

  public prepareAnimation(moveTo: number) {
    const { current: strip } = this.ref;
    if (!strip) {
      return;
    }
    this.currentX = +this.regExp.exec(strip.style.transform)![1];
    this.targetX = this.getOffset(moveTo);
  }

  public animate = (progress: number) => {
    const { current: strip } = this.ref;
    if (!strip) {
      return;
    }
    const x = this.currentX + (this.targetX - this.currentX) * progress;
    strip.style.transform = `translateX(${x}px)`;
  };

  private renderCheckpoint = (data: CheckpointRenderData, index: number) => {
    const { peaks } = this.props;
    const { node, ...restParams } = data;
    return (
      <RoadmapCheckpoint
        key={index}
        width={this.checkpointWidth}
        isCentered={peaks === 1}
        {...restParams}
      >
        {node}
      </RoadmapCheckpoint>
    );
  };
}
