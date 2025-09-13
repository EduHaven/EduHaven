import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className=" select-none txt">
      <div className="rounded-lg p-4 mb-2 min-h-[70px]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter expression"
          className="bg-transparent outline-none w-full text-2xl text-[var(--txt)] placeholder-[var(--txt-disabled)]"
        />
        <div className="text-right mt-2 text-lg text-[var(--txt)] select-text">
          = {output || "0"}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-0.5">
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
            "rounded-lg txt text-lg transition-colors select-none";

          const className = isClear
            ? baseClass + " bg-red-600 hover:bg-red-700"
            : isDel
              ? baseClass + " bg-yellow-600 hover:bg-yellow-700 "
              : isEqual
                ? baseClass + " col-span-5 btn hover:btn-hover"
                : isOperator
                  ? baseClass + " bg-ter hover:bg-sec"
                  : isFunc
                    ? baseClass + "bg-transparent hover:bg-sec"
                    : baseClass + " bg-sec hover:bg-ter";

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

export default ScientificCalculator;
