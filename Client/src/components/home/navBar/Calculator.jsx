import { CalculatorIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const Calculator = () => {
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };
  useEffect(() => {
    const modal = document.getElementById("Calc_Modal");
    if (modal) {
      modal.showModal = () => setIsCalcOpen(true);
      modal.close = () => {
        setIsCalcOpen(false);
      };
    }
  }, []);
  const closeModal = () => {
    setIsCalcOpen(false);
  };
  const [activeTool, setActiveTool] = useState("calculator");
  return (
    <>
      <button
        className="flex gap-3 btn shadow-[0_4px_100px_rgba(176,71,255,0.7)] px-5 py-2.5 font-semibold transition duration-200 transform hover:scale-105 hover:shadow-[0_4px_100px_rgba(176,71,255,1)]"
        onClick={() => {
          const modal = document.getElementById("Calc_Modal");
          modal && modal.showModal();
        }}
      >
        <CalculatorIcon />
      </button>
      <motion.div
        id="Calc_Modal"
        variants={panelVariants}
        initial="hidden"
        animate={isCalcOpen ? "visible" : "hidden"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 50,
          // pointerEvents: isChatOpen ? "auto" : "none",
          width: "500px",
          height: "600px",
        }}
      >
        <div className="bg-[var(--bg-primary)] p-2 rounded-3xl w-full h-full txt flex flex-col overflow-hidden relative shadow-2xl">
          {/* Resizer handle using the Spline icon */}

          {/* Nav-bar */}
          <nav className="flex gap-1 flex-wrap m-2">
            {["calculator", "graph", "unitconverter"].map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`px-2 py-0  rounded-lg h-9 font-semibold tracking-wide transition
                      ${
                        activeTool === tool
                          ? "bg-[var(--btn)] text-[var(--txt)] "
                          : "bg-[var(--bg-sec)] hover:bg-[var(--btn-hover)] "
                      }`}
              >
                {tool === "calculator"
                  ? "Scientific Calculator"
                  : tool === "graph"
                    ? "Graph Plotter"
                    : tool === "unitconverter"
                      ? "Unit Converter"
                      : ""}
              </button>
            ))}
            <button
              onClick={closeModal}
              className="hover:txt transition pb-2 txt-dim"
            >
              <X className="h-6 w-6" />
            </button>
          </nav>
          <div className="flex-1 overflow-auto rounded-md p-5  min-h-[60vh]">
            {activeTool === "calculator" && <ScientificCalculator />}
            {activeTool === "graph" && <GraphPlotter />}
            {activeTool === "unitconverter" && <UnitConverter />}
          </div>

          {/* Chat area */}

          {/* Input area */}
        </div>
      </motion.div>
    </>
  );
};
// --- Scientific Calculator ---
function ScientificCalculator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const appendInput = (val) => setInput((prev) => prev + val);

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const backspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const evaluateExpression = (expr) => {
    let expression = expr.replace(/\^/g, "**");

    expression = expression.replace(/π/g, "Math.PI").replace(/e/g, "Math.E");
    expression = expression
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/log/g, "Math.log10")
      .replace(/ln/g, "Math.log")
      .replace(/sqrt/g, "Math.sqrt")
      .replace(/exp/g, "Math.exp");
    expression = expression.replace(/(\d+)!/g, "factorial($1)");

    return expression;
  };

  const factorial = (n) => {
    n = Number(n);
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const calculate = () => {
    try {
      if (/^[0-9+\-*/().^!eπ\sA-Za-z]+$/.test(input)) {
        const exp = evaluateExpression(input);

        const func = new Function("factorial", "return " + exp);
        const result = func(factorial);

        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          setOutput(result.toString());
        } else {
          setOutput("Math Error");
        }
      } else {
        setOutput("Invalid expression");
      }
    } catch (error) {
      setOutput("Error");
    }
  };

  const buttons = [
    ["sin(", "cos(", "tan(", "log(", "ln("],
    ["sqrt(", "exp(", "π", "e", "^"],
    ["7", "8", "9", "/", "Clear"],
    ["4", "5", "6", "*", "Del"],
    ["1", "2", "3", "-", "("],
    ["0", ".", "!", "+", ")"],
    ["=", "", "", "", ""],
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-[var(--bg-sec)] rounded-xl shadow-lg select-none text-white font-mono border border-white">
      <div className="bg-[var(--bg-ter)] rounded-lg p-4 mb-6 min-h-[70px] flex flex-col justify-center border border-black">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter expression"
          className="bg-transparent outline-none w-full text-2xl font-semibold text-[var(--txt)] placeholder-[var(--txt-dim)]"
        />
        <div className="text-right mt-2 text-lg text-[var(--txt)] select-text">
          = {output || "0"}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {buttons.flat().map((btn, idx) => {
          if (btn === "") {
            return <div key={idx} />;
          }

          const isOperator = ["/", "*", "-", "+", "^", "(", ")"].includes(btn);
          const isClear = btn === "Clear";
          const isDel = btn === "Del";
          const isEqual = btn === "=";
          const isFunc = [
            "sin(",
            "cos(",
            "tan(",
            "log(",
            "ln(",
            "sqrt(",
            "exp(",
            "!",
            "π",
            "e",
          ].includes(btn);

          const baseClass =
            "rounded-lg font-semibold  text-lg transition-colors select-none";

          const className = isClear
            ? baseClass + " bg-red-600 hover:bg-red-700"
            : isDel
              ? baseClass + " bg-yellow-600 hover:bg-yellow-700"
              : isEqual
                ? baseClass + " col-span-5 bg-cyan-500 hover:bg-cyan-600"
                : isOperator
                  ? baseClass + " bg-cyan-700 hover:bg-cyan-500"
                  : isFunc
                    ? baseClass + " bg-purple-700 hover:bg-purple-600"
                    : baseClass + " bg-cyan-900 hover:bg-cyan-700";

          const handleClick = () => {
            if (isClear) clearAll();
            else if (isDel) backspace();
            else if (isEqual) calculate();
            else appendInput(btn);
          };

          return (
            <button
              key={idx}
              onClick={handleClick}
              className={className + " py-3"}
              aria-label={btn === "Del" ? "Delete last character" : btn}
              type="button"
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
  }, [category]);

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
    } catch (e) {
      setError(
        "Invalid function. Please use valid JavaScript Math syntax (e.g., Math.sin(x))."
      );
    }
  }, [func]);

  return (
    <div className="max-w-md mx-auto flex flex-col space-y-2 text-white p-4">
      <h3 className="text-xl font-bold text-[var(--txt)] text-center">
        Graph Plotter
      </h3>
      <p className="text-sm text-center text-[var(--txt-dim)] mb-4">
        Select a function from the dropdowns below, or type your own.
      </p>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white outline-none"
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
        className="p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white outline-none"
      >
        {Object.entries(functionLibrary[category]).map(([name, expression]) => (
          <option key={name} value={expression}>
            {name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={func}
        onChange={(e) => setFunc(e.target.value)}
        placeholder="Enter your custom function, e.g. Math.sin(x) * x"
        className="p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white placeholder-[var(--txt)] outline-none"
      />
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border h-80 w-160 border-[var(--bg-sec)] rounded bg-[var(--bg-ter)]"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {/* <p className="text-sm text-cyan-400 mt-1">
        Use JavaScript `Math` functions, e.g., `Math.sin(x)`, `Math.pow(x, 2)`,
        etc.
      </p>*/}
    </div>
  );
};

// --- Unit Converter ---

function UnitConverter() {
  const units = {
    length: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Inch: 0.0254,
      Foot: 0.3048,
      Yard: 0.9144,
      Mile: 1609.34,
    },
    weight: {
      Gram: 1,
      Kilogram: 1000,
      Milligram: 0.001,
      Pound: 453.592,
      Ounce: 28.3495,
    },
    time: { Second: 1, Minute: 60, Hour: 3600, Day: 86400 },
    speed: { "m/s": 1, "km/h": 0.277778, mph: 0.44704 },
    area: {
      "m²": 1,
      "km²": 1_000_000,
      "cm²": 0.0001,
      "mm²": 0.000001,
      Acre: 4046.86,
      Hectare: 10000,
    },
    volume: { "m³": 1, Liter: 0.001, Milliliter: 0.000001, Gallon: 0.00378541 },
    temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  };

  const [category, setCategory] = useState("length");
  const [inputUnit, setInputUnit] = useState("Meter");
  const [outputUnit, setOutputUnit] = useState("Kilometer");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (category === "temperature") {
      setInputUnit(units.temperature[0]);
      setOutputUnit(units.temperature[1] || units.temperature[0]);
    } else {
      const categoryUnits = Object.keys(units[category]);
      setInputUnit(categoryUnits[0]);
      setOutputUnit(categoryUnits[1] || categoryUnits[0]);
    }
  }, [category]);

  const convertTemperature = (value, from, to) => {
    if (from === to) return value;
    if (from === "Celsius" && to === "Fahrenheit") return value * 1.8 + 32;
    if (from === "Fahrenheit" && to === "Celsius") return (value - 32) / 1.8;
    if (from === "Celsius" && to === "Kelvin") return value + 273.15;
    if (from === "Kelvin" && to === "Celsius") return value - 273.15;
    if (from === "Fahrenheit" && to === "Kelvin")
      return (value - 32) / 1.8 + 273.15;
    if (from === "Kelvin" && to === "Fahrenheit")
      return (value - 273.15) * 1.8 + 32;
    return "Unsupported";
  };

  const handleConvert = (val) => {
    if (val === "") {
      setResult("");
      return;
    }
    const number = parseFloat(val);
    if (isNaN(number)) {
      setResult("Invalid input");
      return;
    }
    let res;
    if (category === "temperature") {
      res = convertTemperature(number, inputUnit, outputUnit);
    } else {
      const baseValue = number * units[category][inputUnit];
      res = baseValue / units[category][outputUnit];
    }
    setResult(Number.isNaN(res) ? "Error" : parseFloat(res.toFixed(6)));
  };

  useEffect(() => {
    handleConvert(inputValue);
  }, [inputValue, inputUnit, outputUnit, category]);

  return (
    <div className="max-w-md mx-auto space-y-5 bg-[var(--bg-sec)] p-6 rounded-xl shadow-lg border border-[var(--bg-ter)]">
      <h2 className="text-2xl font-bold text-[var(--txt)] text-center">
        Unit Converter
      </h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white"
      >
        {Object.keys(units).map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-[var(--txt)]">
            From
          </label>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="w-full p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white"
          >
            {category === "temperature"
              ? units.temperature.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))
              : Object.keys(units[category]).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
          </select>
        </div>
        <button
          onClick={() => {
            const temp = inputUnit;
            setInputUnit(outputUnit);
            setOutputUnit(temp);
          }}
          className="px-3 py-2 rounded bg-[var(--bg-primary)] text-white hover:bg-[var(--bg-ter)] transition"
        >
          ⇄
        </button>
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-[var(--txt)]">
            To
          </label>
          <select
            value={outputUnit}
            onChange={(e) => setOutputUnit(e.target.value)}
            className="w-full p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white"
          >
            {category === "temperature"
              ? units.temperature.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))
              : Object.keys(units[category]).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
          </select>
        </div>
      </div>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Enter value in ${inputUnit}`}
        className="w-full p-2 rounded bg-[var(--bg-sec)] border border-[var(--bg-ter)] text-white"
      />
      <button
        onClick={() => {
          setInputValue("");
          setResult("");
        }}
        className="w-full py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
      >
        {" "}
        Clear
      </button>
      <div className="text-lg font-semibold text-cyan-400 text-center">
        {result !== "" && (
          <>
            Result: <span className="text-white">{result}</span> {outputUnit}
          </>
        )}
      </div>
    </div>
  );
}

export default Calculator;
