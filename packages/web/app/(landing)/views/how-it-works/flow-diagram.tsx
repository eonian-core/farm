import React, { PureComponent } from "react";
import { Svg, SVG, G, Path, Marker, create } from "@svgdotjs/svg.js";
import path from "path";

interface Point {
  x: number;
  y: number;
}

interface Props {
  width?: string;
  height?: string;

  /**
   * It is used for debugging purposes. If "true" - the frame path will be displayed.
   */
  displayFrame?: boolean;
}

export default class FlowDiagram extends PureComponent<Props> {
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
        fill: "#f06",
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
      dot: {
        fill: "#fff",
      },
      circle: {
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

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef();
    this.svg = SVG();
  }

  componentDidMount(): void {
    this.drawSVG();
  }

  componentDidUpdate(): void {
    this.drawSVG();
  }

  componentWillUnmount(): void {
    this.resetSVG();
  }

  render() {
    const { width, height } = this.props;
    return <div ref={this.ref} style={{ width, height }} />;
  }

  private drawSVG() {
    const { current: container } = this.ref;
    if (!container) {
      return;
    }

    this.resetSVG();

    this.svg.addTo(container).size("100%", "100%");

    const frameGroup = this.drawDiagramFrame();
    this.focusViewBoxTo(frameGroup, 7.5);

    const diagramGroup = this.drawDiagram();
    this.drawEntry(diagramGroup);
    this.drawExit(diagramGroup);
    this.drawArrows(diagramGroup);

    const points = this.drawPoints(diagramGroup);
    this.drawTextForPoints(diagramGroup, points);
  }

  private drawEntry(group: G) {
    const { edges } = this.params;
    const path = group.get(0) as Path;
    const { x, y } = path.pointAt(0);
    group.path(`M ${x} ${y} h -${edges.length}`).attr(edges.attributes);
  }

  private drawExit(group: G) {
    const { edges } = this.params;
    const path = group.get(1) as Path;
    const length = path.length();
    const { x, y } = path.pointAt(length);
    group.path(`M ${x} ${y} h ${edges.length}`).attr(edges.attributes);
  }

  private drawDiagramFrame(): G {
    const { displayFrame } = this.props;
    const group = this.svg.group();

    const attributes = {
      ...this.params.diagram.attributes,
      "stroke-dasharray": "0.5, 0.5",
    };

    this.drawDiagram(group, attributes);

    if (!displayFrame) {
      return group.hide();
    }

    this.iteratePaths(group, (path) => {
      for (const position of ["start", "end", "mid"]) {
        path.marker(position, 10, 10, (add) => {
          add.circle(10).fill("#f06");
        });
      }
    });

    return group;
  }

  private drawDiagram(
    group?: G,
    attributes = this.params.diagram.attributes
  ): G {
    const paths = [
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

  private drawPoints(group: G): Point[] {
    // Draw entry point
    const entryLeaf = group.get(0) as Path;
    const entryPoint = entryLeaf.pointAt(0);
    this.createPoint(group, this.colors[0]).translate(
      entryPoint.x,
      entryPoint.y
    );

    // Draw exit point
    const exitLeaf = group.get(1) as Path;
    const exitLeafLength = exitLeaf.length();
    const exitPoint = exitLeaf.pointAt(exitLeafLength);
    this.createPoint(group, this.colors[1]).translate(exitPoint.x, exitPoint.y);

    let points: Point[] = [];

    // Draw loop points
    const circlePath = group.get(2) as Path;
    const length = circlePath.length();
    const loopPoints = 6;
    for (let i = 0; i < loopPoints; i++) {
      const segment = loopPoints ? length / loopPoints : 0;
      const point = circlePath.pointAt(i * segment);
      this.createPoint(group, this.colors[2]).translate(point.x, point.y);
      points.push(point);
    }

    points.unshift(entryPoint);
    points.push(exitPoint);

    return points;
  }

  private drawTextForPoints(group: G, points: Point[]) {
    const { text } = this.params.points;
    const entryPoint = points.shift()!;
    group.text("Deposit").attr({
      ...text.attributes,
      x: entryPoint.x,
      y: entryPoint.y - 2,
    });

    const exitPoint = points.pop()!;
    group.text("Withdraw").attr({
      ...text.attributes,
      x: exitPoint.x,
      y: exitPoint.y + 2,
    });

    const texts = [
      "Find Options",
      "Allocation",
      "Investment",
      "Aggregation",
      "Reinvestment",
      "Monitoring",
    ];

    const { x: cx, y: cy } = this.getCenterPoint(points);
    for (let i = 0; i < texts.length; i++) {
      const { x, y } = points[i];

      const vector = { x: x - cx, y: y - cy };
      const vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      vector.x /= vectorLength;
      vector.y /= vectorLength;

      group.text(texts[i]).attr({
        ...text.attributes,
        "text-anchor": x > cx ? "start" : "end",
        x: x + vector.x * 1.75,
        y: y + vector.y * 1.75,
      });
    }
  }

  private createPoint(
    group: G,
    color: string,
    circleSize = 1.5,
    dotSize = this.lineWidth * 1.5
  ) {
    const { points } = this.params;

    const pointOffset = -circleSize / 2;
    const pointGroup = group.group();
    pointGroup
      .circle(circleSize)
      .move(pointOffset, pointOffset)
      .attr({ ...points.circle.attributes, stroke: color });

    const dotOffset = pointOffset + circleSize / 2 - dotSize / 2;
    const dot = pointGroup
      .circle(dotSize)
      .move(dotOffset, dotOffset)
      .fill(points.dot.fill);

    pointGroup.attr({ style: "cursor: pointer" });
    pointGroup.mouseenter(() => {
      dot.scale(2);
    });
    pointGroup.mouseleave(() => {
      dot.scale(0.5);
    });

    return pointGroup;
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
}

/**
 *     const gp = new GradientPath({
      path: path.node,
      segments: 30,
      samples: 3,
      precision: 2, // Optional
    });

    const gradients = [
      { color: "hsl(341, 67%, 50%)", pos: 0 },
      { color: "hsl(270, 35%, 50%)", pos: 0.5 },
      { color: "hsl(229, 80%, 66%)", pos: 1 }
    ];

    gp.render({
      type: "path",
      fill: gradients,
      stroke: gradients,
      width: 4,
      strokeWidth: 0.5,
    });

    ///
        var gradient = this.svg.gradient("radial", function (add) {
      add.stop({ offset: 0, color: "#fff" });
      add.stop({ offset: 1, color: "#555" });
    });
    gradient.radius(0.1);
    var ellipse = this.svg.circle(50).move(25, -20).fill(gradient);
    diagramGroup.maskWith(ellipse);
    ///

    m 0 0 Q 11 -2 14 -11 Q 17 -20 26 -21 t 15 7 A 1 1 0 0 1 28 -3 A 1 1 0 0 1 41 -14 M 28 -3 Q 35 5 43 3 q 7 -2 10 -8 Q 57 -13 65 -17
    m 0 0 Q 11 -2 14 -11 Q 17 -20 26 -21 T 41 -14 A 1 1 0 0 1 28 -3 A 1 1 0 0 1 41 -14
    m 0 10 Q 10 10 13 1 q 3 -9 12 -13 Q 35 -16 47 -7 M 47 -7 a 1 1 0 0 1 -12 15 A 1 1 0 0 1 47 -7 M 35 8 Q 46 16 56 12 Q 65 9 68 -1 Q 71 -10 81 -10
    M 0 -6 C 2 -6 3 -6 8 -7 Q 11 -8 12.937 -9.235 Q 16 -11 19 -11 A 1 1 0 0 1 19 11 Q 16 11 12.937 9.235 Q 11 8 8 7 C 3 6 2 6 0 6
    M 0 -3 C 2 -3 7 -3 9.205 -5.899 Q 11 -8 12.937 -9.235 Q 16 -11 19 -11 A 1 1 0 0 1 19 11 Q 16 11 12.937 9.235 Q 11 8 9.205 5.899 C 7 3 2 3 0 3
 */
