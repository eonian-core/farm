import React, { PureComponent } from "react";
import {
  Svg,
  SVG,
  G,
  Path,
  Marker,
  Element,
  Timeline,
  Circle,
  Text,
  Point as SVGPoint,
  Runner,
} from "@svgdotjs/svg.js";
import { LAPTOP_SCREEN } from "../../../components/resize-hooks/screens";
import styles from "./flow-diagram.module.scss";
import clsx from "clsx";

interface Point {
  x: number;
  y: number;
}

interface Props {
  stepLabels: string[];
  onActiveStepChanged?: (label: string) => void;
  className?: string;
}

interface State {
  isMobileDisplay: boolean;
}

export default class FlowDiagram extends PureComponent<Props, State> {
  private ref: React.RefObject<HTMLDivElement>;
  private svg: Svg;

  private lineWidth = 0.165;

  private colors = [
    "hsl(341, 67%, 50%)",
    "hsl(229, 80%, 66%)",
    "hsl(256, 77%, 60%)",
  ];

  private params = {
    diagram: {
      attributes: {
        "stroke-width": this.lineWidth,
        "stroke-linecap": "round",
        stroke: "#fff",
        fill: "transparent",
      },
    },
    arrows: {
      scale: 0.75,
      attributes: {
        fill: "#fff",
      },
    },
    edges: {
      length: 5,
      attributes: {
        "stroke-width": this.lineWidth,
        "stroke-dasharray": "0.25, 0.35",
        stroke: "#fff",
      },
    },
    points: {
      link: {
        attributes: {
          "stroke-width": this.lineWidth,
          "stroke-dasharray": "0.5, 0.85",
          "stroke-opacity": 0.0,
          opacity: 0.35,
          fill: "none",
          stroke: "var(--color-text-50)",
        },
      },
      dot: {
        size: this.lineWidth * 1.5,
        attributes: {
          fill: "#fff",
        },
      },
      circle: {
        size: 1.5,
        attributes: {
          fill: "var(--color-background-start)",
          stroke: "#f06",
          "stroke-width": this.lineWidth,
        },
      },
      text: {
        attributes: {
          fill: "var(--color-text-300)",
          style: "text-transform: uppercase",
          "font-size": 1,
          "font-weight": "var(--font-semibold)",
          "text-anchor": "middle",
          "dominant-baseline": "central",
        },
      },
    },
  };

  private selectedPoint: string | null;
  private selectedPointGroup: G | null;
  private selectedPointLinkGroup!: G;

  private sliderObserver: MutationObserver | null;

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef();
    this.svg = SVG();

    this.state = {
      isMobileDisplay: false,
    };

    this.selectedPoint = null;
    this.selectedPointGroup = null;

    this.sliderObserver = null;
  }

  componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    this.drawSVG();

    this.initSliderObserver();
  }

  componentDidUpdate(): void {
    this.drawSVG();
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
    this.resetSVG();

    this.sliderObserver?.disconnect();
  }

  render() {
    const { className } = this.props;
    return <div ref={this.ref} className={clsx(styles.wrapper, className)} />;
  }

  private initSliderObserver() {
    const sliderElement = document.getElementById("diagram-slider");
    if (!sliderElement) {
      return;
    }
    this.sliderObserver = new MutationObserver(() => {
      this.selectedPoint && this.createLinkToCard(this.selectedPoint);
    });
    this.sliderObserver.observe(sliderElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  private handleResize = () => {
    const { current: container } = this.ref;
    if (!container) {
      return;
    }
    const { width } = container.getBoundingClientRect();
    const { isMobileDisplay } = this.state;
    const toMobile = width <= LAPTOP_SCREEN;
    if (toMobile !== isMobileDisplay) {
      this.setState({ isMobileDisplay: toMobile });
    }
  };

  private drawSVG() {
    const { current: container } = this.ref;
    if (!container) {
      return;
    }

    this.resetSVG();

    this.svg.addTo(container).size("100%", "100%");

    this.selectedPointLinkGroup = this.svg.group();

    const diagramGroup = this.drawDiagram();

    const { isMobileDisplay } = this.state;
    if (!isMobileDisplay) {
      this.drawLineEntry(diagramGroup);
      this.drawLineExit(diagramGroup);
    }

    this.drawArrows(diagramGroup);
    this.drawPoints(diagramGroup);

    this.focusViewBoxTo(diagramGroup, 7.5);
  }

  private drawLineEntry(group: G) {
    const { edges } = this.params;
    const path = group.get(0) as Path;
    const { x, y } = path.pointAt(0);
    group.path(`M ${x} ${y} h -${edges.length}`).attr(edges.attributes);
  }

  private drawLineExit(group: G) {
    const { edges } = this.params;
    const path = group.get(1) as Path;
    const length = path.length();
    const { x, y } = path.pointAt(length);
    group.path(`M ${x} ${y} h ${edges.length}`).attr(edges.attributes);
  }

  private drawDiagram(
    group?: G,
    attributes = this.params.diagram.attributes
  ): G {
    const paths = this.state.isMobileDisplay
      ? [
          "M 0 -16 Q 4 -15 7 -12 q 5 6 1 15",
          "M -8 -3 Q -12 7 -7 12 Q -4 15 0 16",
          "M 8 3 A 1 1 60 0 1 -8 -3 A 1 1 60 0 1 8 3",
        ]
      : [
          "m 0 10 Q 10 10 13 1 q 3 -9 12 -13 Q 35 -16 47 -7",
          "M 35 8 Q 46 16 56 12 Q 65 9 68 -1 Q 71 -10 81 -10",
          "M 47 -7 a 1 1 0 0 1 -12 15 A 1 1 0 0 1 47 -7",
        ];

    const entryPath = paths[0];
    const exitPath = paths[1];
    const loopPath = paths[2];

    group = group ?? this.svg.group();

    const entryPathGradient = this.svg.gradient("linear", (add) => {
      add.stop(0.65, this.colors[0]);
      add.stop(0.85, this.colors[2]);
      add.stop(1, this.colors[2]);
    });
    group!.path(entryPath).attr({ ...attributes, stroke: entryPathGradient });
    const exitPathGradient = this.svg.gradient("linear", (add) => {
      add.stop(0.15, this.colors[2]);
      add.stop(0.35, this.colors[1]);
      add.stop(1, this.colors[1]);
    });
    group!.path(exitPath).attr({ ...attributes, stroke: exitPathGradient });
    group!.path(loopPath).attr({ ...attributes, stroke: this.colors[2] });

    return group;
  }

  private drawArrows(group: G) {
    const createArrow = (marker: Marker, color: string) => {
      const { arrows } = this.params;
      marker
        .path("M 0 1 L 8 5 L 0 9 L 1 5 L 0 1")
        .attr({
          ...arrows.attributes,
          fill: "var(--color-background-start)",
        })
        .scale(arrows.scale);
      marker
        .path("M 0 1 L 10 5 L 0 9 L 3 5 L 0 1")
        .attr({
          ...arrows.attributes,
          fill: color,
        })
        .scale(arrows.scale);
    };

    const firstPath = group.get(0) as Path;
    firstPath.marker("mid", 10, 10, (marker) =>
      createArrow(marker, this.colors[0])
    );

    const lastPath = group.get(1) as Path;
    lastPath.marker("mid", 10, 10, (marker) =>
      createArrow(marker, this.colors[1])
    );

    const circle = group.get(2) as Path;
    circle.marker("start", 10, 10, (marker) =>
      createArrow(marker, this.colors[2])
    );
    circle.marker("mid", 10, 10, (marker) =>
      createArrow(marker, this.colors[2])
    );
  }

  private drawPoints(group: G) {
    const { stepLabels } = this.props;
    // Draw entry point
    const entryLeaf = group.get(0) as Path;
    const entryPoint = entryLeaf.pointAt(0);
    this.drawPoint(group, {
      label: stepLabels[0],
      color: this.colors[0],
      position: entryPoint,
      textOffset: { x: 0, y: -1 },
    });

    // Draw exit point
    const exitLeaf = group.get(1) as Path;
    const exitLeafLength = exitLeaf.length();
    const exitPoint = exitLeaf.pointAt(exitLeafLength);
    this.drawPoint(group, {
      label: stepLabels[stepLabels.length - 1],
      color: this.colors[1],
      position: exitPoint,
      textOffset: { x: 0, y: 1 },
    });

    // Generate positions on the circle loop
    const circlePath = group.get(2) as Path;
    const length = circlePath.length();
    const countPoints = stepLabels.length - 2;
    const points = new Array(countPoints).fill(0).map((_, i) => {
      const segment = length / countPoints;
      return circlePath.pointAt(i * segment);
    });

    // Draw loop points
    const centerPoint = this.getCenterPoint(points);
    points.forEach((point, i) => {
      const textOffset = this.getNormalizedVector(point, centerPoint);
      this.drawPoint(group, {
        label: stepLabels[i + 1],
        color: this.colors[2],
        position: point,
        textOffset,
      });
    });
  }

  private drawPoint(
    group: G,
    options: {
      label: string;
      color: string;
      position: Point;
      textOffset: Point;
    }
  ) {
    const { label, color, position, textOffset } = options;
    const { points } = this.params;
    const { attributes: textAttributes } = points.text;
    const { size: circleSize, attributes: circleAttributes } = points.circle;
    const { size: dotSize, attributes: dotAttributes } = points.dot;

    const pointOffset = -circleSize / 2;
    const pointGroup = group.group();
    const circleElement = pointGroup
      .circle(circleSize)
      .move(pointOffset, pointOffset)
      .attr({ ...circleAttributes, stroke: color });

    const dotOffset = pointOffset + circleSize / 2 - dotSize / 2;
    const dotElement = pointGroup
      .circle(dotSize)
      .move(dotOffset, dotOffset)
      .fill(dotAttributes.fill);

    const { x, y } = position;
    const { x: tX, y: tY } = textOffset;

    const isVShifted = tX === 0;
    const offsetFactor = isVShifted ? 2 : 1.75;
    const textAnchor = isVShifted ? "middle" : tX > 0 ? "start" : "end";
    const textX = tX * offsetFactor;
    const textY = tY * offsetFactor;
    const textElement = pointGroup.text(label).attr({
      ...textAttributes,
      "text-anchor": textAnchor,
      x: textX,
      y: textY,
    });

    pointGroup.remember("pos", { x, y });
    pointGroup.id(`point-${label}`);
    pointGroup.attr("data-color", color);
    pointGroup.attr("data-label", label);
    pointGroup.translate(x, y);
    pointGroup.css({ cursor: "pointer" });

    circleElement.remember("size", circleSize);
    dotElement.remember("size", dotSize);
    textElement.remember("pos", { x: textX, y: textY });

    this.setupPointAnimation(pointGroup);

    this.addMouseHoverEvent(pointGroup, (isHovered) => {
      if (this.selectedPoint === label) {
        return;
      }
      pointGroup.remember(isHovered ? "runAnimation" : "reverseAnimation")();
    });

    pointGroup.click(() => {
      this.selectPoint(label);
    });
  }

  public selectPoint = (label: string) => {
    if (this.selectedPoint === label) {
      return;
    }

    const group = this.getPointGroup(label);
    if (!group) {
      return;
    }

    this.selectedPointGroup?.remember("reverseAnimation")?.();

    this.selectedPointGroup = group;
    this.selectedPoint = label;

    const { onActiveStepChanged } = this.props;
    onActiveStepChanged?.(this.selectedPoint!);
    this.selectedPointGroup.remember("runAnimation")();

    this.createLinkToCard(label);
  };

  private createLinkToCard(label: string) {
    const cardElement = document.getElementById(label);
    const pointGroup = this.getPointGroup(label);
    if (!cardElement || !pointGroup) {
      return;
    }

    const { link } = this.params.points;
    const group = this.selectedPointLinkGroup;

    let path = group.get(0) as Path;
    if (path) {
      this.animate(path)
        .attr({ "stroke-opacity": 0.0 })
        .after(() => {
          const stringPath = this.getPathForLink(pointGroup, cardElement);
          path?.plot(stringPath);
          this.animate(path).attr({ "stroke-opacity": 1.0 });
        });
      return;
    }

    const stringPath = this.getPathForLink(pointGroup, cardElement);
    path = group.path(stringPath).attr(link.attributes);
    this.animate(path).attr({ "stroke-opacity": 1.0 });
  }

  private getPathForLink(from: G, to: HTMLElement) {
    const { current: container } = this.ref;
    const { x: containerX } = container!.getBoundingClientRect();
    const { width, x: cardX } = to.getBoundingClientRect();
    const centerX = cardX - containerX + width / 2;

    const point = new SVGPoint(centerX, 0);

    const { x: startX, y: startY } = from.remember("pos");
    const { x: endX, y: endY } = point.transform(this.svg.ctm().inverse());

    const diffY = endY - startY;
    const halfDiffY = startY + diffY / 2;
    const fY = halfDiffY;

    const step = Math.min(Math.abs(endX - startX) / 2, 1);

    let path: string[] = [];

    if (endX < startX) {
      path = [
        `M ${startX} ${startY}`,
        `V ${fY}`,
        `A 1 1 0 0 0 ${startX - step} ${fY - step}`,
        `H ${endX}`,
        `A 1 1 0 0 1 ${endX - step} ${fY - step * 2}`,
        `V ${endY}`,
      ];
    } else if (endX === startX) {
      path = [`M ${startX} ${startY} V ${endY}`];
    } else {
      path = [
        `M ${startX} ${startY}`,
        `V ${fY}`,
        `A 1 1 0 0 1 ${startX + step} ${fY - step}`,
        `H ${endX - step}`,
        `A 1 1 0 0 0 ${endX} ${fY - step * 2}`,
        `V ${endY}`,
      ];
    }
    return path;
  }

  private setupPointAnimation(pointGroup: G) {
    const circleElement = pointGroup.get(0) as Circle;
    const dotElement = pointGroup.get(1) as Circle;
    const textElement = pointGroup.get(2) as Text;

    const circleSize = circleElement.remember("size");
    const dotSize = dotElement.remember("size");
    const { x, y } = textElement.remember("pos");

    const timeline = new Timeline();
    circleElement.timeline(timeline);
    dotElement.timeline(timeline);
    textElement.timeline(timeline);

    pointGroup.remember("runAnimation", () => {
      this.animate(dotElement).size(dotSize * 1.5);
      this.animate(circleElement).size(circleSize * 1.5);
      this.animate(textElement).attr({ x: x * 1.25, y: y * 1.25 });
    });

    pointGroup.remember("reverseAnimation", () => {
      this.animate(dotElement).size(dotSize);
      this.animate(circleElement).size(circleSize);
      this.animate(textElement).attr({ x, y });
    });
  }

  private resetSVG() {
    this.svg.clear();
    this.svg.remove();
  }

  private focusViewBoxTo(group: G, distance: number) {
    const box = this.resizeBox(group.node.getBBox(), distance);
    this.svg.viewbox(box);
  }

  private resizeBox({ x, y, width, height }: DOMRect, delta: number): DOMRect {
    return new DOMRect(
      x - delta / 2,
      y - delta / 2,
      width + delta,
      height + delta
    );
  }

  private iteratePaths(group: G, callback: (path: Path) => void) {
    const paths = group.children();
    for (const path of paths) {
      if (path.type !== "path") {
        continue;
      }
      callback(path as Path);
    }
  }

  private getCenterPoint(points: Point[]): Point {
    const point = points.reduce(
      (result, point) => ({
        x: result.x + point.x,
        y: result.y + point.y,
      }),
      { x: 0, y: 0 } as Point
    );
    return { x: point.x / points.length, y: point.y / points.length };
  }

  private getNormalizedVector({ x, y }: Point, { x: cx, y: cy }: Point) {
    const vector = { x: x - cx, y: y - cy };
    const vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    vector.x /= vectorLength;
    vector.y /= vectorLength;
    return vector;
  }

  private addMouseHoverEvent(group: G, callback: (hover: boolean) => void) {
    group.css({ "pointer-events": "bounding-box" } as any);
    const handler = (event: MouseEvent) => {
      const isEnter = event.type === "mouseenter";
      callback(isEnter);
    };
    group.mouseenter(handler);
    group.mouseleave(handler);
  }

  private getPointGroup(label: string): G {
    return this.svg.findOne(`g[data-label="${label}"]`) as G;
  }

  private animate = <T extends Element>(
    element: T,
    duration = 200,
    delay = 0
  ): T & Runner => {
    return element.animate(duration, delay, "absolute") as unknown as T &
      Runner;
  };
}
