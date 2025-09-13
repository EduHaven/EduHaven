import { Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4 p-4">
      <div className="relative flex items-center justify-center text-lg font-semibold txt text-center h-20 border border-[var(--bg-ter)] rounded-md">
        <h1 className="absolute top-1 left-2 txt-disabled text-lg">Result:</h1>
        {result !== "" && (
          <span className="text-xl">
            {result} {outputUnit}
          </span>
        )}
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 rounded bg-[var(--bg-sec)] txt"
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
            className="w-full p-2 rounded bg-[var(--bg-sec)] txt"
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
        <Button
          onClick={() => {
            const temp = inputUnit;
            setInputUnit(outputUnit);
            setOutputUnit(temp);
          }}
          variant="secondary"
          size="default"
          className="px-3 py-2 rounded txt hover:bg-[var(--bg-ter)] transition"
        >
          ⇄
        </Button>
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-[var(--txt)]">
            To
          </label>
          <select
            value={outputUnit}
            onChange={(e) => setOutputUnit(e.target.value)}
            className="w-full p-2 rounded bg-[var(--bg-sec)] txt"
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
      <div className="flex gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter value in ${inputUnit}`}
          className="w-full p-2 rounded bg-[var(--bg-sec)] txt"
        />
        <Button
          onClick={() => {
            setInputValue("");
            setResult("");
          }}
          variant="destructive"
          size="default"
          className="flex items-center gap-2 font-semibold p-2 rounded bg-sec txt hover:text-white hover:bg-red-700 transition"
        >
          <Delete /> Clear
        </Button>
      </div>
    </div>
  );
}
export default UnitConverter;
