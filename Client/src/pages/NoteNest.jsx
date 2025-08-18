import React, { useRef,useEffect, useState } from 'react';

function NotesSection() {
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [handwritten, setHandwritten] = useState(false);
  const noteRef = useRef(null);
  const fileInputRef = useRef(null);

 const applyHighlight = (color) => {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);

  const span = document.createElement('span');
  span.style.backgroundColor = color;
  span.style.color = 'black'; 
  const extractedContents = range.extractContents();
  span.appendChild(extractedContents);
  range.insertNode(span);
  selection.removeAllRanges();
};

  const toggleHandwritten = () => setHandwritten((v) => !v);
  const handleBold = () => document.execCommand('bold');

  const clearNotes = () => {
    if (noteRef.current) noteRef.current.innerHTML = '';
  };

  const handleImageInsert = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.style.maxWidth = '100%';
      if (noteRef.current) noteRef.current.appendChild(img);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-1/2 relative flex flex-col border border-gray-300 rounded-md p-6 bg-amber-50 shadow-md select-text">
        
      {/* Handwritten toggle top-right */}
      <div className="absolute top-4 right-6 flex items-center space-x-2">
        <label htmlFor="handwrittenToggle" className="font-semibold text-amber-900 select-none">
          Handwritten
        </label>
        <input
          id="handwrittenToggle"
          type="checkbox"
          checked={handwritten}
          onChange={toggleHandwritten}
          className="cursor-pointer"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-5 text-amber-900">Notes</h2>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap mb-6">
        <button
          onClick={handleBold}
          className="px-4 py-2 rounded-md bg-amber-800 text-amber-50 hover:bg-amber-900 transition-shadow shadow-sm"
          title="Bold selected text"
        >
          Bold
        </button>

       {/* Highlight colors */}
       <div className="flex items-center space-x-2">
  {['yellow', 'red', 'pink', 'limegreen'].map((color) => (
    <button
      key={color}
      onClick={() => {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        document.execCommand('hiliteColor', false, color);
      }}
      className="w-8 h-8 rounded border"
      style={{ backgroundColor: color }}
      title={`Highlight ${color.charAt(0).toUpperCase() + color.slice(1)}`}
    />
  ))}
</div>


        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-shadow shadow-sm"
          title="Insert Image"
        >
          Insert Image
        </button>
        <button
          onClick={clearNotes}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-shadow shadow-sm"
          title="Clear all notes"
        >
          Clear Notes
        </button>
      </div>

      {/* Editable area */}
      <div
  ref={noteRef}
  contentEditable
  spellCheck={true}
  suppressContentEditableWarning={true}
  className={`flex-1 p-6 border border-gray-300 rounded-md overflow-auto outline-none min-h-[60vh] leading-[32px] bg-amber-50 text-amber-900 ${
    handwritten ? 'italic font-handwriting' : 'not-italic font-sans'
  }`}
  style={{
    backgroundImage:
      // Line placed 4px below the bottom of each 32px line-height block
      'repeating-linear-gradient(to bottom, transparent 0, transparent 28px, #3b82f6 29px, transparent 30px)',
    backgroundSize: '100% 32px', // Matches line height
    fontFamily: handwritten
      ? "'Comic Sans MS', cursive, sans-serif"
      : 'system-ui, sans-serif',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    outline: 'none',
    boxSizing: 'border-box', // Important for padding inside width/height
  }}
  onMouseUp={() => {
    const selection = window.getSelection();
    if (highlightMode && selection && !selection.isCollapsed) handleHighlight();
  }}
></div>



      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageInsert}
      />
    </div>
  );
}

export default function NoteNest() {
  const [activeTool, setActiveTool] = useState('calculator');

  return (
     <>
     <h2 className="text-center font-bold text-5xl mb-2 text-red-400">NoteNest</h2>
    <div className="flex w-full h-[calc(100vh)] rounded-lg   bg-transparent p-4 gap-6">
      {/* LEFT SIDE */}

      <NotesSection />
      
      {/* RIGHT SIDE - Tools */}
      <div className="w-1/2 flex flex-col rounded-md p-4 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-lg text-white border text-center">
        <h2 className="text-2xl font-bold mb-5 text-cyan-400 tracking-wide">NoteNest</h2>
        <nav className="flex gap-3 flex-wrap mb-6">
{['calculator', 'graph', 'unitconverter', 'MindMap', 'flashcard', 'tasktracker', 'canvas'].map((tool) => (
            <button key={tool} onClick={() => setActiveTool(tool)}  className={`px-4 py-2 rounded-lg font-semibold tracking-wide transition 
            ${
                  activeTool === tool
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/70'
                    : 'bg-cyan-900/40 hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/50'
                }`}
            >
              {tool === 'calculator'
                      ? 'Scientific Calculator'
                      : tool === 'graph'
                      ? 'Graph Plotter'
                      : tool === 'unitconverter'
                      ? 'Unit Converter'
                      : tool === 'MindMap'
                      ? 'MindMAP'
                      : tool === 'flashcard'
                      ? 'Flashcards'
                      : tool === 'tasktracker'
                      ? 'Task & Assignment Tracker'
                      : tool === 'canvas'
                      ? 'Drawing Canvas'
                      : ''}
                </button>
              ))}
             </nav>

        <div className="flex-1 overflow-auto rounded-md bg-[#182635] p-5 shadow-inner shadow-cyan-800 min-h-[60vh]">
          {activeTool === 'calculator' && <ScientificCalculator />}
          {activeTool === 'graph' && <GraphPlotter />}
          {activeTool === 'unitconverter' && <UnitConverter />}
          {activeTool === 'MindMap' && <MindMap />}
          {activeTool === 'flashcard' && <FlashcardMaker />}
          {activeTool === 'tasktracker' && <TaskAssignmentTracker />}
          {activeTool === 'canvas' && <DrawingCanvas />}
        </div>
      </div>
    </div>
   </>
  );
}

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

    expression = expression
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E");
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
    <div className="max-w-md mx-auto p-6 bg-black rounded-xl shadow-lg select-none text-white font-mono border border-white">

      <div className="bg-white rounded-lg p-4 mb-6 min-h-[80px] flex flex-col justify-center border border-black">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter expression" className="bg-transparent outline-none w-full text-2xl font-semibold text-cyan-400 placeholder-cyan-600" />
        <div className="text-right mt-2 text-lg text-cyan-300 select-text">
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
          const isFunc =
            ["sin(", "cos(", "tan(", "log(", "ln(", "sqrt(", "exp(", "!", "π", "e"].includes(
              btn
            );

          const baseClass =
            "rounded-lg font-semibold text-lg transition-colors select-none";

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
      'Sine': 'Math.sin(x)',
      'Cosine': 'Math.cos(x)',
      'Tangent': 'Math.tan(x)',
      'Secant': '1 / Math.cos(x)',
      'Cosecant': '1 / Math.sin(x)',
      'Cotangent': '1 / Math.tan(x)',
    },
    Polynomial: {
      'Linear (x)': 'x',
      'Parabola (x^2)': 'Math.pow(x, 2)',
      'Cubic (x^3)': 'Math.pow(x, 3)',
    },
    Exponential: {
      'e^x': 'Math.exp(x)',
      '2^x': 'Math.pow(2, x)',
      '10^x': 'Math.pow(10, x)',
    },
    Logarithmic: {
      'ln(x)': 'Math.log(x)',
      'log10(x)': 'Math.log10(x)',
    },
    Miscellaneous: {
      'Absolute Value |x|': 'Math.abs(x)',
      'Floor': 'Math.floor(x)',
      'Ceiling': 'Math.ceil(x)',
      'Step': 'Math.floor(x * 10)',
    },
  };

  const [category, setCategory] = useState(Object.keys(functionLibrary)[0]);
  const [func, setFunc] = useState(functionLibrary[Object.keys(functionLibrary)[0]][Object.keys(functionLibrary[Object.keys(functionLibrary)[0]])[0]]);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

   useEffect(() => {
    const newFunction = Object.values(functionLibrary[category])[0];
    setFunc(newFunction);
  }, [category]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; 
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    setError(null);

    ctx.strokeStyle = '#3b82f6'; 
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
      const plotFunction = new Function('x', 'Math', `return ${func}`);

      ctx.strokeStyle = '#06b6d4'; 
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
      setError("Invalid function. Please use valid JavaScript Math syntax (e.g., Math.sin(x)).");
    }
  }, [func]); 

  return (
    <div className="max-w-md mx-auto flex flex-col space-y-2 text-white p-4">
      <h3 className="text-xl font-bold text-cyan-400 text-center">Graph Plotter</h3>
      <p className="text-sm text-center text-cyan-400 mb-4">
        Select a function from the dropdowns below, or type your own.
      </p>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 rounded bg-slate-800 border border-cyan-600 text-white outline-none"
      >
        {Object.keys(functionLibrary).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select value={func} onChange={(e) => setFunc(e.target.value)} className="p-2 rounded bg-slate-800 border border-cyan-600 text-white outline-none">
        {Object.entries(functionLibrary[category]).map(([name, expression]) => (
          <option key={name} value={expression}>
            {name}
          </option>
        ))}
      </select>

      <input type="text" value={func}  onChange={(e) => setFunc(e.target.value)} placeholder="Enter your custom function, e.g. Math.sin(x) * x" className="p-2 rounded bg-slate-800 border border-cyan-600 text-white placeholder-cyan-400 outline-none"/>
      <canvas ref={canvasRef} width={400} height={200} className="border h-80 w-160 border-cyan-600 rounded bg-amber-50" />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-sm text-cyan-400 mt-1">Use JavaScript `Math` functions, e.g., `Math.sin(x)`, `Math.pow(x, 2)`, etc.</p>
    </div>
  );
};


// --- Unit Converter ---

          function UnitConverter() {
  const units = {
    length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Inch: 0.0254, Foot: 0.3048, Yard: 0.9144, Mile: 1609.34 },
    weight: { Gram: 1, Kilogram: 1000, Milligram: 0.001, Pound: 453.592, Ounce: 28.3495 },
    time: { Second: 1, Minute: 60, Hour: 3600, Day: 86400 },
    speed: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704 },
    area: { "m²": 1, "km²": 1_000_000, "cm²": 0.0001, "mm²": 0.000001, Acre: 4046.86, Hectare: 10000 },
    volume: { "m³": 1, Liter: 0.001, Milliliter: 0.000001, Gallon: 0.00378541 },
    temperature: ["Celsius", "Fahrenheit", "Kelvin"]
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
    if (from === "Fahrenheit" && to === "Kelvin") return (value - 32) / 1.8 + 273.15;
    if (from === "Kelvin" && to === "Fahrenheit") return (value - 273.15) * 1.8 + 32;
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
    <div className="max-w-md mx-auto space-y-5 bg-slate-900 p-6 rounded-xl shadow-lg border border-cyan-700">
      <h2 className="text-2xl font-bold text-cyan-400 text-center">Unit Converter</h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 border border-cyan-600 text-white"
      >
        {Object.keys(units).map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-cyan-300">From</label>
          <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-cyan-600 text-white">
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
        <button onClick={() => { const temp = inputUnit; setInputUnit(outputUnit); setOutputUnit(temp); }} className="px-3 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition">
          ⇄
        </button>
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-cyan-300">To</label>
          <select value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-cyan-600 text-white">
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
      <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={`Enter value in ${inputUnit}`} className="w-full p-2 rounded bg-slate-800 border border-cyan-600 text-white"/>
      <button onClick={() => { setInputValue(""); setResult("");}} className="w-full py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"> Clear</button>
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


// --- ToDo List ---

function MindMap() {
  const [nodes, setNodes] = useState([{ id: "1", x: 150, y: 150, text: "Root Node" }]);
  const [edges, setEdges] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const containerRef = useRef(null);

  const onMouseDown = (e, id) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDraggingNode(id);
    setSelectedNodeId(id);
  };

  const onMouseUp = () => setDraggingNode(null);

  const onMouseMove = (e) => {
    if (!draggingNode) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    setNodes((nodes) =>
      nodes.map((node) => (node.id === draggingNode ? { ...node, x, y } : node))
    );
  };

  const addChildNode = () => {
    if (!selectedNodeId) return alert("Please select a node first");
    const parentNode = nodes.find((n) => n.id === selectedNodeId);
    if (!parentNode) return;

    const newId = Date.now().toString();
    const newNode = {
      id: newId,
      x: parentNode.x,
      y: parentNode.y + 100,
      text: "New Node",
    };
    setNodes((nodes) => [...nodes, newNode]);
    setEdges((edges) => [...edges, { from: selectedNodeId, to: newId }]);
  };

  const getDescendants = (nodeId, edges) => {
    let descendants = [];
    const directChildren = edges.filter(e => e.from === nodeId).map(e => e.to);
    descendants.push(...directChildren);
    directChildren.forEach(childId => {
      descendants.push(...getDescendants(childId, edges));
    });
    return descendants;
  };

  const deleteNode = () => {
    if (!selectedNodeId) return;

    const descendants = getDescendants(selectedNodeId, edges);
    const allToDelete = [selectedNodeId, ...descendants];  
      setNodes((nodes) => nodes.filter((node) => !allToDelete.includes(node.id)));
    setEdges((edges) =>
      edges.filter((edge) => !allToDelete.includes(edge.from) && !allToDelete.includes(edge.to))
    );
    setSelectedNodeId(null);
  };

  const updateNodeText = (id, newText) => {
    setNodes((nodes) =>
      nodes.map((node) => (node.id === id ? { ...node, text: newText } : node))
    );
  };

  const onNodeClick = (e, id) => {
    e.stopPropagation();
    setSelectedNodeId(id);
  };

  const onContainerClick = () => setSelectedNodeId(null);

  const NODE_WIDTH = 140;
  const NODE_HEIGHT = 60;

  return (
    <div className=" mx-auto relative" style={{ height: 1000 }}>
      <div className="absolute top-2 left-2 z-20 flex gap-2 bg-[#1e293b] rounded border border-cyan-600 p-2 shadow-lg " style={{ userSelect: "none" }}>
        <button onClick={(e) => { e.stopPropagation(); addChildNode();}} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedNodeId}>
          + Add Node
        </button>

        <button onClick={(e) => {  e.stopPropagation(); deleteNode(); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedNodeId}>
          &times; Delete Node
        </button>
      </div>

      <div  ref={containerRef} className="bg-[#1e293b] rounded border border-cyan-600 text-black select-none overflow-auto bg-amber-50" style={{ height: "100%", position: "relative", userSelect: draggingNode ? "none" : "auto" }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={onContainerClick}
      >
        {nodes.map(({ id, x, y, text }) => (
          <div
            key={id}
            onMouseDown={(e) => onMouseDown(e, id)}
            onClick={(e) => onNodeClick(e, id)}
            style={{
              top: y,
              left: x,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              boxSizing: "border-box",
              position: "absolute",
            }}
            className={`bg-[#142337]/90 border border-red-400 rounded p-2 cursor-move flex flex-col items-center gap-2 box-border
              ${selectedNodeId === id ? "ring-4 ring-cyan-400 ring-opacity-75 shadow-lg" : ""}
            `}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              className="text-white text-center outline-none"
              onBlur={(e) => updateNodeText(id, e.target.innerText)}
              onClick={(e) => e.stopPropagation()}
              style={{ minHeight: "24px", userSelect: "text", cursor: "text", width: "100%" }}
            >
              {text}
            </div>
          </div>
        ))}

        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "visible",
            zIndex: 0,
          }}
        >
          {edges.map(({ from, to }) => {
            const fromNode = nodes.find((n) => n.id === from);
            const toNode = nodes.find((n) => n.id === to);

            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + NODE_WIDTH / 2;
            const fromY = fromNode.y + NODE_HEIGHT;

            const toX = toNode.x + NODE_WIDTH / 2;
            const toY = toNode.y;

            return (
              <line
                key={`${from}-${to}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}


// --- Flashcard Maker ---
function FlashcardMaker() {
  const [flashcards, setFlashcards] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flashcards');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [notes, setNotes] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [mode, setMode] = React.useState('qa'); // 'qa' or 'note'

  const [formQA, setFormQA] = React.useState({ question: '', answer: '' });
  const [formNote, setFormNote] = React.useState({ note: '' });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleChangeQA = (e) =>
    setFormQA((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleChangeNote = (e) =>
    setFormNote({ note: e.target.value });

  const addFlashcard = () => {
    if (!formQA.question.trim() || !formQA.answer.trim()) return;
    setFlashcards((prev) => [...prev, { id: Date.now(), ...formQA }]);
    setFormQA({ question: '', answer: '' });
  };

  const addNote = () => {
    if (!formNote.note.trim()) return;
    setNotes((prev) => [...prev, { id: Date.now(), note: formNote.note }]);
    setFormNote({ note: '' });
  };

  const deleteFlashcard = (id) => {
    setFlashcards((prev) => prev.filter((f) => f.id !== id));
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto h-[90vh] border border-black rounded-lg flex flex-col bg-gray-900 text-black">
      {/* Flashcards Scrollable Section */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {flashcards.length === 0 && notes.length === 0 && (
          <p className="col-span-full text-center text-gray-600 italic mt-12">
            No flashcards or notes created
          </p>
        )}

        {flashcards.map(({ id, question, answer }) => (
          <div
            key={id}
            className="bg-amber-50 border border-black rounded-md shadow-lg p-5 h-[320px] cursor-default flex flex-col relative"
          >
            <button
              onClick={() => deleteFlashcard(id)}
              className="absolute top-2 right-2 text-black hover:text-red-600 font-bold text-xl focus:outline-none"
              title="Delete flashcard"
              type="button"
            >
              ×
            </button>
            <p className="font-semibold text-lg mb-4">{question}</p>
            <hr className="border-black opacity-20 mb-4" />
            <p className="text-base leading-relaxed">{answer}</p>
          </div>
        ))}

        {notes.map(({ id, note }) => (
          <div
            key={id}
            className="bg-amber-50 border border-black rounded-md shadow-lg p-5 h-[320px] cursor-default relative"
          >
            <button
              onClick={() => deleteNote(id)}
              className="absolute top-2 right-2 text-black hover:text-red-600 font-bold text-xl focus:outline-none"
              title="Delete note"
              type="button"
            >
              ×
            </button>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{note}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === 'qa') addFlashcard();
          else addNote();
        }}
        className="border-t border-black p-6 bg-gray-100 flex flex-col space-y-9"
      >
        <div className="flex justify-center space-x-6 -mb-1">
          <button
            type="button"
            onClick={() => setMode('qa')}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              mode === 'qa'
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            Add Q/A Flashcard
          </button>
          <button
            type="button"
            onClick={() => setMode('note')}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              mode === 'note'
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            Add Note
          </button>
        </div>

        {mode === 'qa' ? (
          <>
            <input
              type="text"
              name="question"
              placeholder="Enter question"
              value={formQA.question}
              onChange={handleChangeQA}
              className="w-full p-3 rounded border border-black text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-black transition"
              required
              autoComplete="off"
            />
            <input
              type="text"
              name="answer"
              placeholder="Enter answer"
              value={formQA.answer}
              onChange={handleChangeQA}
              className="w-full p-3 rounded border border-black text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-black transition"
              required
              autoComplete="off"
            />
          </>
        ) : (
          <textarea
            name="note"
            placeholder="Write your note here..."
            value={formNote.note}
            onChange={handleChangeNote}
            className="w-full p-4 rounded border border-black text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-black transition resize-y min-h-[120px]"
            required
          />
        )}

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-gray-900 transition"
        >
          Add {mode === 'qa' ? 'Flashcard' : 'Note'}
        </button>
      </form>
    </div>
  );
}


//  Drawing Canvas
function DrawingCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); 
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(2);
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPos({ x: offsetX, y: offsetY });

    if (tool === "pen" || tool === "eraser") {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = ctxRef.current;

    ctx.strokeStyle = tool === "eraser" ? "#fffbeb" : color;
    ctx.lineWidth = thickness;

    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = ctxRef.current;
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rect" || tool === "circle" || tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;

      const w = offsetX - startPos.x;
      const h = offsetY - startPos.y;

      if (tool === "rect") ctx.strokeRect(startPos.x, startPos.y, w, h);
      if (tool === "circle") {
        ctx.beginPath();
        ctx.arc(
          startPos.x + w / 2,
          startPos.y + h / 2,
          Math.sqrt(w ** 2 + h ** 2) / 2,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    }
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center flex-wrap">
        <select
          className="bg-black text-white px-2 py-1 rounded"
          onChange={(e) => setTool(e.target.value)}
          value={tool}
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="line">Line</option>
        </select>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input
          type="range"
          min="1"
          max="10"
          value={thickness}
          onChange={(e) => setThickness(e.target.value)}
        />
        <button
          onClick={clearCanvas}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded bg-amber-50"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}



// --- Task & Assignment Tracker ---
function TaskAssignmentTracker() {
  const [tasks, setTasks] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasksAssignments');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [form, setForm] = React.useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasksAssignments', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addTask = () => {
    if (!form.title.trim() || !form.dueDate) return;
    const newTask = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
    });
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const sortTasksByDueDate = () => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
    setTasks(sorted);
  };

  const sortTasksByPriority = () => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    const sorted = [...tasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    setTasks(sorted);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col space-y-6 text-gray-900 dark:text-gray-100">
      <section className="flex flex-col space-y-3">
        <input type="text" name="title"  placeholder="Task / Assignment Title *" value={form.title} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-900 dark:placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-black" />
        <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-black"/>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label htmlFor="dueDate" className="mb-1 text-sm font-semibold text-black-700 dark:text-gray-300">
              Due Date *
            </label>
           <input type="date" name="dueDate" id="dueDate" value={form.dueDate} onChange={handleChange} className="p-2 border border-black dark:border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-black"/>
          </div>
          <div className="flex-1 flex flex-col">
            <label htmlFor="priority" className="mb-1 text-sm font-semibold  dark:text-gray-300">
              Priority
            </label>
            <select
                name="priority"
                id="priority"
                value={form.priority}
                onChange={handleChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-black"
>
  <option>High</option>
  <option>Medium</option>
  <option>Low</option>
</select>

          </div>
        </div>
        <button
          onClick={addTask}
          className="self-start px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition"
          type="button"
        >
          Add Task / Assignment
        </button>
      </section>
      {tasks.length > 0 && (
        <section className="flex gap-3 justify-end">
          <button
            onClick={sortTasksByDueDate}
            className="px-4 py-1 text-sm font-medium rounded-md border border-gray-400 dark:border-gray-600 hover:bg-cyan-600 hover:text-white transition"
            title="Sort by Due Date"
            type="button"
          >
            Sort by Due Date
          </button>
          <button
            onClick={sortTasksByPriority}
            className="px-4 py-1 text-sm font-medium rounded-md border border-gray-400 dark:border-gray-600 hover:bg-cyan-600 hover:text-white transition"
            title="Sort by Priority"
            type="button"
          >
            Sort by Priority
          </button>
        </section>
      )}
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 italic">
          No tasks added yet
        </p>
      ) : (
        <ul className="space-y-3 overflow-auto max-h-72">
          {tasks.map(
            ({
              id,
              title,
              description,
              dueDate,
              priority,
              completed,
            }) => (
              <li
                key={id}
                className={`p-4 rounded-lg border ${
                  completed
                    ? 'border-green-500 bg-green-100/30 line-through text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-700'
                } flex flex-col`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold truncate">{title}</h3>
                  <button
                    onClick={() => deleteTask(id)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold leading-none focus:outline-none"
                    aria-label="Delete task"
                    type="button"
                    title="Delete task"
                  >
                    &times;
                  </button>
                </div>

                {description && (
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                    {description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    <strong>Due:</strong>{' '}
                    {new Date(dueDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span>
                    <strong>Priority:</strong> {priority}
                  </span>
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() => toggleComplete(id)}
                      className="accent-cyan-600 dark:accent-cyan-400"
                    />
                    Completed
                  </label>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
