"use client";
import React, { useEffect } from "react";

interface Props {
  width: number;
  height: number;
  color?: string;
  lineWidth?: number;
  numberOfPoints?: number;
}

const lemnisacte = (t: number, a: number = 10): [x: number, y: number] => {
  const dx = (a * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
  const dy = (a * Math.cos(t) * Math.sin(t)) / (1 + Math.pow(Math.sin(t), 2));
  return [dx, dy];
};

const EonianLogo: React.FC<Props> = ({
  width,
  height,
  color = "#fff",
  numberOfPoints = 128,
  lineWidth = 2,
}) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.translate(0.5, 0.5);

    const centerX = width / 2;
    const centerY = height / 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    const points = new Array(numberOfPoints).fill(0).map((_, index) => {
      const step = index / 20;
      const point = lemnisacte(step, (width / 2) * 0.9);
      const x = point[0] + centerX;
      const y = point[1] + centerY;

      const range = 0.035;
      const sin = 1 + Math.sin(step);
      return { x, y, ignore: sin <= range };
    });

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i != points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      if (p1.ignore) {
        ctx.moveTo(cp2x, cp2y);
      } else {
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    }
    ctx.stroke();
  }, [width, height, color, numberOfPoints, lineWidth]);

  return <canvas ref={ref} width={width} height={height} />;
};

export default EonianLogo;
