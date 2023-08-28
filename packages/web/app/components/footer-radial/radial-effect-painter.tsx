import React, { PureComponent } from 'react'

interface Props {
  width: number
  height: number
  radius: number
}

export default class RadialEffectPainter extends PureComponent<Props> {
  private ref: React.RefObject<HTMLCanvasElement>
  private ctx!: CanvasRenderingContext2D

  constructor(props: Props) {
    super(props)

    this.ref = React.createRef()
  }

  componentDidMount(): void {
    this.init()
  }

  componentDidUpdate(): void {
    this.init()
  }

  private init() {
    const { current: canvas } = this.ref
    if (!canvas) {
      return
    }

    this.ctx = canvas.getContext('2d')!

    this.renderContext()
  }

  private renderContext() {
    const { width, height, radius } = this.props
    this.ctx.clearRect(0, 0, width, height)

    const x = width / 2
    const y = height / 2
    const circles = Math.floor(Math.min(width, height) / radius) / 2
    for (let i = 0; i < circles; i++) {
      this.drawCircle({
        r: radius * i,
        t: Math.max(3.5 - i, 1),
        x,
        y,
      })
    }
  }

  render() {
    const { width, height } = this.props
    return <canvas ref={this.ref} width={width} height={height} />
  }

  private drawCircle(options: { r: number; x: number; y: number; t?: number }) {
    const { r, x, y, t = 2 } = options
    const quadrants = [
      {
        angleStart: Math.PI * -0.5,
        angleEnd: 0,
        x1: x,
        y1: y - r,
        x2: x + r,
        y2: y,
        colorStops: [
          { stop: 0, color: 'hsl(341, 67%, 50%)' },
          { stop: 1, color: 'hsl(270, 35%, 50%)' },
        ],
      },
      {
        angleStart: 0,
        angleEnd: Math.PI * 0.5,
        x1: x + r,
        y1: y,
        x2: x,
        y2: y + r,
        colorStops: [
          { stop: 0, color: 'hsl(270, 35%, 50%)' },
          { stop: 1, color: 'hsl(229, 80%, 66%)' },
        ],
      },
      {
        angleStart: Math.PI * 0.5,
        angleEnd: Math.PI,
        x1: x,
        y1: y + r,
        x2: x - r,
        y2: y,
        colorStops: [
          { stop: 0, color: 'hsl(229, 80%, 66%)' },
          { stop: 1, color: 'hsl(256, 77%, 60%)' },
        ],
      },
      {
        angleStart: Math.PI,
        angleEnd: Math.PI * 1.5,
        x1: x - r,
        y1: y,
        x2: x,
        y2: y - r,
        colorStops: [
          { stop: 0, color: 'hsl(256, 77%, 60%)' },
          { stop: 1, color: 'hsla(341, 67%, 50%)' },
        ],
      },
    ]

    for (let i = 0; i < quadrants.length; ++i) {
      const quad = quadrants[i]
      const grad = this.ctx.createLinearGradient(quad.x1, quad.y1, quad.x2, quad.y2)
      for (let j = 0; j < quad.colorStops.length; ++j) {
        const cs = quad.colorStops[j]
        grad.addColorStop(cs.stop, cs.color)
      }
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, quad.angleStart, quad.angleEnd)
      this.ctx.strokeStyle = grad
      this.ctx.lineWidth = t
      this.ctx.stroke()
    }
  }
}
