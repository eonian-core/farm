import React from "react";

const Curves = () => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = React.useState<number>();
  const [height, setHeight] = React.useState<number>();

  React.useEffect(() => {
    const handleResize = () => {
      const { current: canvas } = ref;
      setWidth(canvas?.offsetWidth);
      setHeight(canvas?.offsetHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const { current: canvas } = ref;
    if (!canvas || !width || !height) {
      return;
    }

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, width, height);

    const vertices = 4;
    const step = vertices * 2;

    ctx.beginPath();

    for (let x = width; x >= 0; x--) {
      const offset = x * step + width / 2;
      const y = Math.sin((offset * Math.PI) / width);
      ctx.lineTo(x, height / 2 + y * 32);
    }

    ctx.strokeStyle = "red";
    ctx.stroke();
  }, [width, height]);

  return (
    <canvas ref={ref} width={width} height={height} className="h-full w-full" />
  );
};

export default Curves;
