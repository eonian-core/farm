'use client'

import React, { PureComponent } from 'react'
import type {
  Circle,
  Element,
  G,
  Marker,
  Path,
  Runner,
  Svg,
  Text,
} from '@svgdotjs/svg.js'
import {
  SVG,
  Point as SVGPoint,
  Timeline,
} from '@svgdotjs/svg.js'
import debounce from 'lodash.debounce'
import type { DebouncedFunc } from 'lodash'
import { DESKTOP_SCREEN, TABLET_SCREEN } from '../../../components/resize-hooks/screens'
import styles from './flow-diagram.module.scss'
import { HIW_ANIMATION_DURATION } from './constants'

interface Point {
  x: number
  y: number
}

interface Props {
  stepLabels: string[]
  onActiveStepChanged: (stepLabel: string) => void
}

interface State {
  isMobileDisplay: boolean
  isDesktopDisplay: boolean
}

const fontSizeOnDesktop = 1.5

export default class FlowDiagram extends PureComponent<Props, State> {
  private ref: React.RefObject<HTMLDivElement>
  private svg!: Svg
  private wrapperGroup!: G

  private lineWidth = 0.165

  private colors = ['hsl(341, 67%, 50%)', 'hsl(229, 80%, 66%)', 'hsl(256, 77%, 60%)']

  private params = {
    diagram: {
      attributes: {
        'stroke-width': this.lineWidth,
        'stroke-linecap': 'round',
        'stroke': '#fff',
        'fill': 'transparent',
      },
    },
    arrows: {
      scale: 0.75,
      attributes: {
        fill: '#fff',
      },
    },
    edges: {
      length: 5,
      attributes: {
        'stroke-width': this.lineWidth,
        'stroke-dasharray': '0.25, 0.35',
        'stroke': '#fff',
      },
    },
    points: {
      link: {
        attributes: {
          'stroke-width': this.lineWidth,
          'stroke-dasharray': '0.5, 0.85',
          'stroke-opacity': 0.0,
          'opacity': 0.55,
          'fill': 'none',
        },
      },
      dot: {
        size: this.lineWidth * 1.5,
        attributes: {
          fill: '#fff',
        },
      },
      circle: {
        size: 1.5,
        attributes: {
          'fill': 'var(--color-background-start)',
          'stroke': '#f06',
          'stroke-width': this.lineWidth,
        },
      },
      text: {
        attributes: {
          'fill': 'var(--color-text-300)',
          'style': 'text-transform: uppercase',
          'font-weight': 'var(--font-semibold)',
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
        },
      },
    },
  }

  private activeStepPoint: string | null
  private activeStepPointGroup: G | null
  private activeStepPointLinkGroup!: G

  private debouncedRedrawLink!: DebouncedFunc<(point: string | null) => void>

  constructor(props: Props) {
    super(props)

    this.ref = React.createRef()

    this.state = {
      isMobileDisplay: false,
      isDesktopDisplay: false,
    }

    this.activeStepPoint = null
    this.activeStepPointGroup = null
  }

  componentDidMount(): void {
    this.svg = SVG()
    this.drawSVG()

    this.debouncedRedrawLink = debounce((point: string | null) => {
      point === null ? this.hideLinkToCard() : this.createLinkToCard(point)
    }, 20)

    setTimeout(this.initSliderAnimationObserver, 100)

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentDidUpdate(): void {
    this.drawSVG()
  }

  componentWillUnmount(): void {
    this.disposeSliderAnimationObserver()

    window.removeEventListener('resize', this.handleResize)

    this.resetSVG()
  }

  render() {
    return <div ref={this.ref} id="flow-diagram" className={styles.wrapper} />
  }

  private initSliderAnimationObserver = () => {
    const slider = document.getElementById('diagram-slider')
    slider?.addEventListener('transitionstart', this.handleTransition)
    slider?.addEventListener('transitionend', this.handleTransition)
  }

  private disposeSliderAnimationObserver() {
    this.debouncedRedrawLink.cancel()

    const slider = document.getElementById('diagram-slider')
    slider?.removeEventListener('transitionstart', this.handleTransition)
    slider?.removeEventListener('transitionend', this.handleTransition)
  }

  private handleTransition = (event: TransitionEvent) => {
    const { type, propertyName } = event
    if (!['transform', 'left'].includes(propertyName)) {
      return
    }

    type === 'transitionstart' ? this.debouncedRedrawLink(null) : this.debouncedRedrawLink(this.activeStepPoint)
  }

  private handleResize = () => {
    const { current: container } = this.ref
    if (!container) {
      return
    }

    const { width } = container.getBoundingClientRect()
    const { isMobileDisplay, isDesktopDisplay } = this.state

    const toMobile = width <= TABLET_SCREEN
    if (toMobile !== isMobileDisplay) {
      this.setState({ isMobileDisplay: toMobile, isDesktopDisplay: false })
      return
    }

    const toDesktop = width <= DESKTOP_SCREEN
    if (!toMobile && toDesktop !== isDesktopDisplay) {
      this.setState({ isDesktopDisplay: toDesktop })
    }
  }

  private drawSVG() {
    const { current: container } = this.ref
    if (!container) {
      return
    }

    this.resetSVG()

    this.svg.addTo(container).size('100%', '100%')

    this.activeStepPointLinkGroup = this.svg.group()

    this.wrapperGroup = this.svg.group()
    const diagramGroup = this.drawDiagram(this.wrapperGroup)

    const { isMobileDisplay } = this.state
    if (!isMobileDisplay) {
      this.drawLineEntry(diagramGroup)
      this.drawLineExit(diagramGroup)
    }

    this.drawArrows(diagramGroup)
    this.drawPoints(diagramGroup)

    this.focusViewBoxTo(diagramGroup, { x: 1, y: 5 })
  }

  private drawLineEntry(group: G) {
    const { edges } = this.params
    const path = group.get(0) as Path
    const { x, y } = path.pointAt(0)
    group.path(`M ${x} ${y} h -${edges.length}`).attr(edges.attributes)
  }

  private drawLineExit(group: G) {
    const { edges } = this.params
    const path = group.get(1) as Path
    const length = path.length()
    const { x, y } = path.pointAt(length)
    group.path(`M ${x} ${y} h ${edges.length}`).attr(edges.attributes)
  }

  private drawDiagram(group?: G, attributes = this.params.diagram.attributes): G {
    const paths = this.state.isMobileDisplay
      ? [
          'M 0 -16 Q 4 -15 7 -12 q 5 6 1 15',
          'M -8 -3 Q -12 7 -7 12 Q -4 15 0 16',
          'M 8 3 A 1 1 60 0 1 -8 -3 A 1 1 60 0 1 8 3',
        ]
      : [
          'm 0 10 Q 10 10 13 1 q 3 -9 12 -13 Q 35 -16 47 -7',
          'M 35 8 Q 46 16 56 12 Q 65 9 68 -1 Q 71 -10 81 -10',
          'M 47 -7 a 1 1 0 0 1 -12 15 A 1 1 0 0 1 47 -7',
        ]

    const entryPath = paths[0]
    const exitPath = paths[1]
    const loopPath = paths[2]

    group = group ?? this.svg.group()

    const entryPathGradient = this.svg.gradient('linear', (add) => {
      add.stop(0.65, this.colors[0])
      add.stop(0.85, this.colors[2])
      add.stop(1, this.colors[2])
    })
    group.path(entryPath).attr({ ...attributes, stroke: entryPathGradient })
    const exitPathGradient = this.svg.gradient('linear', (add) => {
      add.stop(0.15, this.colors[2])
      add.stop(0.35, this.colors[1])
      add.stop(1, this.colors[1])
    })
    group.path(exitPath).attr({ ...attributes, stroke: exitPathGradient })
    group.path(loopPath).attr({ ...attributes, stroke: this.colors[2] })

    return group
  }

  private drawArrows(group: G) {
    const createArrow = (marker: Marker, color: string) => {
      const { arrows } = this.params
      marker
        .path('M 0 1 L 8 5 L 0 9 L 1 5 L 0 1')
        .attr({
          ...arrows.attributes,
          fill: 'var(--color-background-start)',
        })
        .scale(arrows.scale)
      marker
        .path('M 0 1 L 10 5 L 0 9 L 3 5 L 0 1')
        .attr({
          ...arrows.attributes,
          fill: color,
        })
        .scale(arrows.scale)
    }

    const firstPath = group.get(0) as Path
    firstPath.marker('mid', 10, 10, marker => createArrow(marker, this.colors[0]))

    const lastPath = group.get(1) as Path
    lastPath.marker('mid', 10, 10, marker => createArrow(marker, this.colors[1]))

    const circle = group.get(2) as Path
    circle.marker('start', 10, 10, marker => createArrow(marker, this.colors[2]))
    circle.marker('mid', 10, 10, marker => createArrow(marker, this.colors[2]))
  }

  private drawPoints(group: G) {
    const { stepLabels } = this.props
    // Draw entry point
    const entryLeaf = group.get(0) as Path
    const entryPoint = entryLeaf.pointAt(0)
    this.drawPoint(group, {
      label: stepLabels[0],
      color: this.colors[0],
      position: entryPoint,
      textOffset: { x: 0, y: -1 },
    })

    // Draw exit point
    const exitLeaf = group.get(1) as Path
    const exitLeafLength = exitLeaf.length()
    const exitPoint = exitLeaf.pointAt(exitLeafLength)
    this.drawPoint(group, {
      label: stepLabels[stepLabels.length - 1],
      color: this.colors[1],
      position: exitPoint,
      textOffset: { x: 0, y: 1 },
    })

    // Generate positions on the circle loop
    const circlePath = group.get(2) as Path
    const length = circlePath.length()
    const countPoints = Math.max(stepLabels.length - 2, 0)
    const points = Array.from({ length: countPoints }).fill(0).map((_, i) => {
      const segment = length / countPoints
      return circlePath.pointAt(i * segment)
    })

    // Draw loop points
    const centerPoint = this.getCenterPoint(points)
    points.forEach((point, i) => {
      const textOffset = this.getNormalizedVector(point, centerPoint)
      this.drawPoint(group, {
        label: stepLabels[i + 1],
        color: this.colors[2],
        position: point,
        textOffset,
      })
    })
  }

  private drawPoint(
    group: G,
    options: {
      label: string
      color: string
      position: Point
      textOffset: Point
    },
  ) {
    const { label, color, position, textOffset } = options
    const { isDesktopDisplay } = this.state
    const { points } = this.params
    const { attributes: textAttributes } = points.text
    const { size: circleSize, attributes: circleAttributes } = points.circle
    const { size: dotSize, attributes: dotAttributes } = points.dot

    const pointOffset = -circleSize / 2
    const pointGroup = group.group()
    const circleElement = pointGroup
      .circle(circleSize)
      .move(pointOffset, pointOffset)
      .attr({ ...circleAttributes, stroke: color })

    const dotOffset = pointOffset + circleSize / 2 - dotSize / 2
    const dotElement = pointGroup.circle(dotSize).move(dotOffset, dotOffset).fill(dotAttributes.fill)

    const { x, y } = position
    const { x: tX, y: tY } = textOffset

    const isVShifted = tX === 0
    const offsetFactor = isVShifted ? 2 : 1.75
    const textAnchor = isVShifted ? 'middle' : tX > 0 ? 'start' : 'end'
    const textX = tX * offsetFactor
    const textY = tY * offsetFactor
    const textElement = pointGroup.text(label).attr({
      ...textAttributes,
      'text-anchor': textAnchor,
      'font-size': isDesktopDisplay ? fontSizeOnDesktop : 1,
      'x': textX,
      'y': textY,
    })

    pointGroup.remember('pos', { x, y })
    pointGroup.id(`point-${label}`)
    pointGroup.attr('data-color', color)
    pointGroup.attr('data-label', label)
    pointGroup.translate(x, y)
    pointGroup.css({ cursor: 'pointer' })

    circleElement.remember('size', circleSize)
    dotElement.remember('size', dotSize)
    textElement.remember('pos', { x: textX, y: textY })

    this.setupPointAnimation(pointGroup)

    this.addMouseHoverEvent(pointGroup, (isHovered) => {
      if (this.activeStepPoint === label) {
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      pointGroup.remember(isHovered ? 'runAnimation' : 'reverseAnimation')()
    })

    pointGroup.click(() => {
      this.selectPoint(label)
    })
  }

  public selectPoint = (label: string) => {
    if (this.activeStepPoint === label) {
      return
    }

    const group = this.getPointGroup(label)
    if (!group) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.activeStepPointGroup?.remember('reverseAnimation')?.()

    this.activeStepPointGroup = group
    this.activeStepPoint = label

    const { onActiveStepChanged } = this.props
    onActiveStepChanged?.(this.activeStepPoint)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.activeStepPointGroup.remember('runAnimation')()
  }

  private createLinkToCard(label: string) {
    const cardElement = document.getElementById(label)
    const pointGroup = this.getPointGroup(label)
    if (!cardElement || !pointGroup) {
      return
    }

    const { link } = this.params.points
    const color = pointGroup.attr('data-color') as string
    const group = this.activeStepPointLinkGroup
    const path = this.getPathForLink(pointGroup, cardElement)
    const pathElement = this.getPath(group)?.plot(path) ?? group.path(path)
    pathElement.attr({ ...link.attributes, stroke: color })
    this.animate(pathElement).attr({ 'stroke-opacity': 1.0 })
  }

  private hideLinkToCard() {
    const pathElement = this.getPath(this.activeStepPointLinkGroup)
    this.animate(pathElement)?.attr({ 'stroke-opacity': 0.0 })
  }

  private getPathForLink(from: G, to: HTMLElement) {
    const { current: container } = this.ref
    const { x: containerX, y: containerY, height } = container!.getBoundingClientRect()
    const { width, x: cardX, y: cardY } = to.getBoundingClientRect()
    const centerX = cardX - containerX + width / 2

    const isOnBottom = cardY > containerY
    const point = new SVGPoint(centerX, isOnBottom ? height : 0)

    const pointPosition = from.remember('pos') as Point
    const cardPosition = point.transform(this.wrapperGroup.ctm().inverse())

    const startX = isOnBottom ? cardPosition.x : pointPosition.x
    const startY = isOnBottom ? cardPosition.y : pointPosition.y
    const endX = isOnBottom ? pointPosition.x : cardPosition.x
    const endY = isOnBottom ? pointPosition.y : cardPosition.y

    const diffY = isOnBottom ? -1 : 1
    const fY = startY + diffY

    const step = Math.min(Math.abs(endX - startX) / 2, 1)

    let path: string[] = []

    if (endX < startX) {
      path = [
        `M ${startX} ${startY}`,
        `V ${fY}`,
        `A 1 1 0 0 0 ${startX - step} ${fY - step}`,
        `H ${endX + step}`,
        `A 1 1 0 0 1 ${endX} ${fY - step * 2}`,
        `L ${endX} ${endY}`,
      ]
    }
    else if (endX === startX) {
      path = [`M ${startX} ${startY} V ${endY}`]
    }
    else {
      path = [
        `M ${startX} ${startY}`,
        `V ${fY}`,
        `A 1 1 0 0 1 ${startX + step} ${fY - step}`,
        `H ${endX - step}`,
        `A 1 1 0 0 0 ${endX} ${fY - step * 2}`,
        `L ${endX} ${endY}`,
      ]
    }
    return path
  }

  private setupPointAnimation(pointGroup: G) {
    const circleElement = pointGroup.get(0) as Circle
    const dotElement = pointGroup.get(1) as Circle
    const textElement = pointGroup.get(2) as Text

    const circleSize = circleElement.remember('size') as number
    const dotSize = dotElement.remember('size') as number
    const { x, y } = textElement.remember('pos') as Point

    const timeline = new Timeline()
    circleElement.timeline(timeline)
    dotElement.timeline(timeline)
    textElement.timeline(timeline)

    pointGroup.remember('runAnimation', () => {
      this.animate(dotElement).size(dotSize * 1.5)
      this.animate(circleElement).size(circleSize * 1.5)
      this.animate(textElement).attr({ x: x * 1.25, y: y * 1.25 })
    })

    pointGroup.remember('reverseAnimation', () => {
      this.animate(dotElement).size(dotSize)
      this.animate(circleElement).size(circleSize)
      this.animate(textElement).attr({ x, y })
    })
  }

  private resetSVG() {
    this.svg.clear()
    this.svg.remove()
  }

  private focusViewBoxTo(group: G, margin: Point) {
    const box = this.resizeBox(group.node.getBBox(), margin)
    this.svg.viewbox(box)
  }

  private resizeBox({ x, y, width, height }: DOMRect, margin: Point): DOMRect {
    return new DOMRect(x - margin.x / 2, y - margin.y / 2, width + margin.x, height + margin.y)
  }

  private iteratePaths(group: G, callback: (path: Path) => void) {
    const paths = group.children()
    for (const path of paths) {
      if (path.type !== 'path') {
        continue
      }

      callback(path as Path)
    }
  }

  private getCenterPoint(points: Point[]): Point {
    const point = points.reduce(
      (result, point) => ({
        x: result.x + point.x,
        y: result.y + point.y,
      }),
      { x: 0, y: 0 } as Point,
    )
    return { x: point.x / points.length, y: point.y / points.length }
  }

  private getNormalizedVector({ x, y }: Point, { x: cx, y: cy }: Point) {
    const vector = { x: x - cx, y: y - cy }
    const vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    vector.x /= vectorLength
    vector.y /= vectorLength
    return vector
  }

  private addMouseHoverEvent(group: G, callback: (hover: boolean) => void) {
    group.css({ 'pointer-events': 'bounding-box' } as any)
    const handler = (event: MouseEvent) => {
      const isEnter = event.type === 'mouseenter'
      callback(isEnter)
    }
    group.mouseenter(handler)
    group.mouseleave(handler)
  }

  private getPointGroup(label: string): G {
    return this.svg.findOne(`g[data-label="${label}"]`) as G
  }

  private animate = <T extends Element | null>(
    element: T | null,
    duration = HIW_ANIMATION_DURATION,
    delay = 0,
  ): T & Runner => element?.animate(duration, delay, 'absolute') as unknown as T & Runner

  private getPath(group: G): Path | null {
    const element = group.get(0)
    if (element?.type === 'path') {
      return element as Path
    }

    return null
  }
}
