interface Point {
  x: number
  y: number
}

export default class WavePainter {
  // Number of wave peaks displayed on the screen.
  private peaks: number

  // Wave thickness.
  private lineWidth: number

  // Maximum wave height.
  private scaleY: number

  // Color of the wave.
  private color: string | CanvasGradient

  // Wave peak color (if specified, it will create a gradient).
  private peakColor?: string

  // Wave horizontal shift.
  private offsetX: number

  // Wave vertical shift.
  private offsetY: number

  // Blur in pixels.
  private blur: number

  // Line drawing step. The smaller the value, the smoother the wave
  private stepX: number

  // Specifies whether or not to draw a curved line between drawing steps.
  // We can increase the performance by setting this parameter to "true" and setting a higher value for "stepX".
  private useQuadraticCurvePaint: boolean

  // Distance between wave's peaks. Calculated automatically.
  private scaleX: number

  // Canvas 2D content.
  private ctx: CanvasRenderingContext2D

  // Cached point for curve rendering. Used for optimization.
  private previousQuadraticCurvePoint: Point

  // Cached wave gradient.
  private waveGradient?: CanvasGradient

  constructor(private canvas: HTMLCanvasElement) {
    this.peaks = 3
    this.lineWidth = 1
    this.scaleY = 32
    this.color = '#fff'
    this.offsetX = this.offsetY = 0
    this.blur = 0
    this.stepX = 1
    this.useQuadraticCurvePaint = false

    this.scaleX = this.peaks * 2
    this.ctx = canvas.getContext('2d')!
    this.previousQuadraticCurvePoint = { x: -1, y: -1 }
  }

  public draw() {
    this.ctx.beginPath()

    const startX = this.moveToInitPosition()

    if (this.useQuadraticCurvePaint) {
      this.drawWaveWithQuadraticCurve(startX)
    }
    else {
      this.drawWaveWithLines(startX)
    }

    this.ctx.filter = this.blur ? `blur(${this.blur}px)` : 'none'
    this.ctx.strokeStyle = this.waveGradient ?? this.color
    this.ctx.lineWidth = this.lineWidth
    this.ctx.stroke()
  }

  private calculateY(x: number): number {
    const { width } = this.canvas
    const xR = x * this.scaleX + width / 2 + this.offsetX
    const y = Math.sin((xR * Math.PI) / width)
    const yR = y * this.scaleY + this.offsetY
    return yR
  }

  private moveToInitPosition(): number {
    const { width: initX } = this.canvas
    const y = this.calculateY(initX)
    this.ctx.moveTo(initX, y)
    this.previousQuadraticCurvePoint = { x: initX, y }
    return initX - this.stepX
  }

  private drawLineTo(x: number) {
    const y = this.calculateY(x)
    this.ctx.lineTo(x, y)
  }

  private drawWaveWithLines(startX: number) {
    for (let x = startX; x >= 0; x -= this.stepX) {
      this.drawLineTo(x)
    }
  }

  private drawQuadraticCurveTo(x: number) {
    const y = this.calculateY(x)
    const { x: prevX, y: prevY } = this.previousQuadraticCurvePoint
    const xc = (prevX + x) / 2
    const yc = (prevY + y) / 2
    this.ctx.quadraticCurveTo(prevX, prevY, xc, yc)
    this.previousQuadraticCurvePoint = { x, y }
  }

  private drawWaveWithQuadraticCurve(startX: number) {
    for (let x = startX; x >= 0; x -= this.stepX) {
      this.drawQuadraticCurveTo(x)
    }
  }

  private setupWaveGradient() {
    if (this.peakColor) {
      if (typeof this.color !== 'string') {
        throw new TypeError('Color is not a string')
      }

      const { width } = this.canvas
      const deltaY = (this.lineWidth + this.scaleY) / 2
      this.waveGradient = this.ctx.createLinearGradient(
        width / 2,
        this.offsetY - deltaY * 2.15,
        width / 2,
        this.offsetY + deltaY,
      )
      this.waveGradient.addColorStop(0, this.peakColor)
      this.waveGradient.addColorStop(1, this.color)
    }
    else {
      this.waveGradient = undefined
    }
  }

  /* Getters */

  public getOffsetX(): number {
    return this.offsetX
  }

  /* Setters */

  public setOffsetX(value: number) {
    this.offsetX = value
  }

  /* Builder */

  static Builder = class {
    private painter: WavePainter

    constructor(canvas: HTMLCanvasElement) {
      this.painter = new WavePainter(canvas)
    }

    public build(): WavePainter {
      this.painter.scaleX = this.painter.peaks * 2
      this.painter.setupWaveGradient()
      return this.painter
    }

    public setPeaks(value: number) {
      this.painter.peaks = value
      return this
    }

    public setLineWidth(value: number) {
      this.painter.lineWidth = value
      return this
    }

    public setScaleY(value: number) {
      this.painter.scaleY = value
      return this
    }

    public setColor(value: string | CanvasGradient) {
      this.painter.color = value
      return this
    }

    public setPeakColor(value: string) {
      this.painter.peakColor = value
      return this
    }

    public setOffsetX(value: number) {
      this.painter.offsetX = value
      return this
    }

    public setOffsetY(value: number) {
      this.painter.offsetY = value
      return this
    }

    public setBlur(value: number) {
      this.painter.blur = value
      return this
    }

    public setStepX(value: number) {
      this.painter.stepX = value
      return this
    }

    public setUseQuadraticCurvePaint(value: boolean) {
      this.painter.useQuadraticCurvePaint = value
      return this
    }
  }
}
