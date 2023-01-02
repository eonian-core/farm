import React, { Component } from "react";
import WavePainter from "./wave-painter";

interface Props {
  peaks: number;
  width: number;
  height: number;
  waveHeight: number;
  waveThickness: number;
  startAt: number;
}

export default class Waves extends Component<Props> {
  private ref: React.RefObject<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  private mainWavePainter!: WavePainter;
  private middleWavePainter!: WavePainter;
  private farestWavePainter!: WavePainter;

  private currentX: number;
  private targetX: number;

  private readonly frameInterval: number;
  private frameId: number;
  private previousFrameTimestamp: number;

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef();

    this.currentX = 0;
    this.targetX = 0;

    this.frameId = 0;
    this.frameInterval = 1000 / 30; // 30 frames per second
    this.previousFrameTimestamp = 0;
  }

  componentDidMount(): void {
    this.init();
    this.draw();

    this.startSecondaryWavesAnimation();
  }

  componentDidUpdate(): void {
    this.init();
    this.draw();

    this.startSecondaryWavesAnimation();
  }

  shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const { peaks, width, height } = this.props;
    return (
      peaks !== nextProps.peaks ||
      width !== nextProps.width ||
      height !== nextProps.height
    );
  }

  private init() {
    const { current: canvas } = this.ref;
    if (!canvas) {
      return;
    }

    this.ctx = canvas.getContext("2d")!;

    const { peaks, height, waveHeight, waveThickness, startAt } = this.props;
    const mainWaveWidth = waveThickness;
    const mainWaveScaleY = waveHeight;
    const waveY = height - mainWaveWidth / 2 - mainWaveScaleY;

    this.mainWavePainter = new WavePainter.Builder(canvas)
      .setPeaks(peaks)
      .setLineWidth(mainWaveWidth)
      .setScaleY(mainWaveScaleY)
      .setColor("#5073b8")
      .setPeakColor("#ef4e7b")
      .setOffsetY(waveY)
      .setOffsetX(this.getShift(startAt))
      .build();

    const middleWaveGradient = this.createGradient(this.ctx, waveY, "#ef4e7b");
    this.middleWavePainter = new WavePainter.Builder(canvas)
      .setPeaks(peaks)
      .setLineWidth(40)
      .setScaleY(24)
      .setColor(middleWaveGradient)
      .setOffsetX(800 + this.getShift(startAt) * 0.75)
      .setBlur(1)
      .setOffsetY(waveY + 20)
      .build();

    const farestWaveGradient = this.createGradient(this.ctx, waveY, "#5073b8");
    this.farestWavePainter = new WavePainter.Builder(canvas)
      .setPeaks(peaks)
      .setLineWidth(40)
      .setScaleY(16)
      .setColor(farestWaveGradient)
      .setOffsetX(256 + this.getShift(startAt) * 0.5)
      .setBlur(2)
      .setOffsetY(waveY + 10)
      .build();
  }

  private getShift(index: number): number {
    const { width } = this.props;
    return width * 2 * (index - 1);
  }

  private createGradient(
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    color: string
  ) {
    const { width } = this.props;
    const x = width / 2;
    const gradient = ctx.createLinearGradient(x, offsetY - 60, x, offsetY + 30);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "hsl(180, 4%, 14%)");
    return gradient;
  }

  private startSecondaryWavesAnimation() {
    cancelAnimationFrame(this.frameId);
    const timestamp = performance.now();
    this.previousFrameTimestamp = timestamp;
    this.animateSecondaryWaves(timestamp);
  }

  private animateSecondaryWaves = (timestamp: number) => {
    const elapsed = timestamp - this.previousFrameTimestamp;
    if (elapsed > this.frameInterval) {
      this.previousFrameTimestamp = timestamp - (elapsed % this.frameInterval);

      this.farestWavePainter.setOffsetX(this.farestWavePainter.getOffsetX() - 4);
      this.middleWavePainter.setOffsetX(this.middleWavePainter.getOffsetX() - 8);

      this.draw();
    }
    this.frameId = requestAnimationFrame(this.animateSecondaryWaves);
  };

  private draw = () => {
    const { width, height } = this.props;
    this.ctx.clearRect(0, 0, width, height);

    this.farestWavePainter.draw();
    this.middleWavePainter.draw();
    this.mainWavePainter.draw();
  };

  public prepareAnimation(moveTo: number) {
    this.currentX = this.mainWavePainter.getOffsetX();
    this.targetX = this.getShift(moveTo);
  }

  public animate = (progress: number) => {
    const x = this.currentX + (this.targetX - this.currentX) * progress;
    this.mainWavePainter.setOffsetX(x);
    this.draw();
  };

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        ref={this.ref}
        width={width}
        height={height}
        className="h-full w-full"
      />
    );
  }
}
