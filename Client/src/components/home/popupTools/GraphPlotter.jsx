import { useEffect, useRef, useState } from "react";

const GraphPlotter = () => {
  const functionLibrary = {
    Trigonometry: {
      Sine: "Math.sin(x)",
      Cosine: "Math.cos(x)",
      Tangent: "Math.tan(x)",
      Secant: "1 / Math.cos(x)",
      Cosecant: "1 / Math.sin(x)",
      Cotangent: "1 / Math.tan(x)",
    },
    Polynomial: {
      "Linear (x)": "x",
      "Parabola (x^2)": "Math.pow(x, 2)",
      "Cubic (x^3)": "Math.pow(x, 3)",
    },
    Exponential: {
      "e^x": "Math.exp(x)",
      "2^x": "Math.pow(2, x)",
      "10^x": "Math.pow(10, x)",
    },
    Logarithmic: {
      "ln(x)": "Math.log(x)",
      "log10(x)": "Math.log10(x)",
    },
    Miscellaneous: {
      "Absolute Value |x|": "Math.abs(x)",
      Floor: "Math.floor(x)",
      Ceiling: "Math.ceil(x)",
      Step: "Math.floor(x * 10)",
    },
  };

  const [category, setCategory] = useState(Object.keys(functionLibrary)[0]);
  const [func, setFunc] = useState(
    functionLibrary[Object.keys(functionLibrary)[0]][
      Object.keys(functionLibrary[Object.keys(functionLibrary)[0]])[0]
    ]
  );
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const newFunction = Object.values(functionLibrary[category])[0];
    setFunc(newFunction);
  }, [category, functionLibrary]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    setError(null);

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    try {
      const plotFunction = new Function("x", "Math", `return ${func}`);

      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = 0; px < width; px++) {
        const x = (px - width / 2) / 20;
        const yVal = plotFunction(x, Math);
        const py = height / 2 - yVal * 20;
        if (px === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    } catch {
      setError(
        "Invalid function. Please use valid JavaScript Math syntax (e.g., Math.sin(x))."
      );
    }
  }, [func]);

  return (
    <div className="flex flex-col space-y-2 txt p-3">
      <div className="flex gap-2 items-center justify-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-[var(--bg-sec)] txt outline-none flex-1"
        >
          {Object.keys(functionLibrary).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={func}
          onChange={(e) => setFunc(e.target.value)}
          className="p-2 rounded bg-[var(--bg-sec)] txt outline-none flex-1"
        >
          {Object.entries(functionLibrary[category]).map(
            ([name, expression]) => (
              <option key={name} value={expression}>
                {name}
              </option>
            )
          )}
        </select>
      </div>

      <input
        type="text"
        value={func}
        onChange={(e) => setFunc(e.target.value)}
        placeholder="Enter your custom function, e.g. Math.sin(x) * x"
        className="p-2 rounded bg-[var(--bg-sec)] txt placeholder-[var(--txt)] outline-none"
      />
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className=" h-80 w-160"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-sm txt-disabled mt-1">
        Use JavaScript `Math` functions, e.g., `Math.sin(x)`, `Math.pow(x, 2)`,
        etc.
      </p>
    </div>
  );
};
export default GraphPlotter;
