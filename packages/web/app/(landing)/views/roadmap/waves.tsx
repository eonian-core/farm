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

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef();

    this.currentX = 0;
    this.targetX = 0;
  }

  componentDidMount(): void {
    this.init();
    this.draw();
  }

  componentDidUpdate(): void {
    this.init();
    this.draw();
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
      .setShiftX(this.getShift(startAt))
      .build();

    const middleWaveGradient = this.createGradient(this.ctx, waveY, "#ef4e7b");
    this.middleWavePainter = new WavePainter.Builder(canvas)
      .setPeaks(peaks)
      .setLineWidth(40)
      .setScaleY(24)
      .setColor(middleWaveGradient)
      .setOffsetX(800)
      .setBlur(1)
      .setOffsetY(waveY + 20)
      .setShiftX(this.getShift(startAt) * 0.75)
      .build();

    const farestWaveGradient = this.createGradient(this.ctx, waveY, "#5073b8");
    this.farestWavePainter = new WavePainter.Builder(canvas)
      .setPeaks(peaks)
      .setLineWidth(40)
      .setScaleY(16)
      .setColor(farestWaveGradient)
      .setOffsetX(256)
      .setBlur(2)
      .setOffsetY(waveY + 10)
      .setShiftX(this.getShift(startAt) * 0.5)
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

  private draw = () => {
    const { width, height } = this.props;
    this.ctx.clearRect(0, 0, width, height);

    this.farestWavePainter.draw();
    this.middleWavePainter.draw();
    this.mainWavePainter.draw();
  };

  public prepareAnimation(moveTo: number) {
    this.currentX = this.mainWavePainter.getShiftX();
    this.targetX = this.getShift(moveTo);
  }

  public animate = (progress: number) => {
    const x = this.currentX + (this.targetX - this.currentX) * progress;

    this.farestWavePainter.setShiftX(x / 2);
    this.middleWavePainter.setShiftX(x * 0.75);
    this.mainWavePainter.setShiftX(x);

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
