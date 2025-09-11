import React, { useRef, useEffect, useState } from "react";

function NotesSection() {
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [handwritten, setHandwritten] = useState(false);
  const noteRef = useRef(null);
  const fileInputRef = useRef(null);

  const applyHighlight = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.style.color = "black";
    const extractedContents = range.extractContents();
    span.appendChild(extractedContents);
    range.insertNode(span);
    selection.removeAllRanges();
  };

  const toggleHandwritten = () => setHandwritten((v) => !v);
  const handleBold = () => document.execCommand("bold");

  const clearNotes = () => {
    if (noteRef.current) noteRef.current.innerHTML = "";
  };

  const handleImageInsert = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      img.style.maxWidth = "100%";
      if (noteRef.current) noteRef.current.appendChild(img);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-1/2 relative flex flex-col border min-w-[300px] border-gray-300 rounded-md p-6 bg-amber-50 shadow-md select-text mb-3 md:mb-0">
      {/* Handwritten toggle top-right */}
      <div className="absolute top-4 right-6 flex items-center space-x-2">
        <label
          htmlFor="handwrittenToggle"
          className="font-semibold text-amber-900 select-none"
        >
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
          {["yellow", "red", "pink", "limegreen"].map((color) => (
            <button
              key={color}
              onClick={() => {
                const selection = window.getSelection();
                if (!selection.rangeCount || selection.isCollapsed) return;
                document.execCommand("hiliteColor", false, color);
              }}
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: color }}
              title={`Highlight ${
                color.charAt(0).toUpperCase() + color.slice(1)
              }`}
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
          handwritten ? "italic font-handwriting" : "not-italic font-sans"
        }`}
        style={{
          backgroundImage:
            // Line placed 4px below the bottom of each 32px line-height block
            "repeating-linear-gradient(to bottom, transparent 0, transparent 28px, #3b82f6 29px, transparent 30px)",
          backgroundSize: "100% 32px", // Matches line height
          fontFamily: handwritten
            ? "'Comic Sans MS', cursive, sans-serif"
            : "system-ui, sans-serif",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          outline: "none",
          boxSizing: "border-box", // Important for padding inside width/height
        }}
        onMouseUp={() => {
          const selection = window.getSelection();
          if (highlightMode && selection && !selection.isCollapsed)
            handleHighlight();
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
  const [activeTool, setActiveTool] = useState("MindMap");

  return (
    <>
      <h2 className="text-center font-bold text-5xl mb-2 text-red-400">
        NoteNest
      </h2>
      <div className="md:flex w-full h-[calc(100vh)] rounded-lg bg-transparent p-4 gap-6">
        {/* LEFT SIDE */}

        <NotesSection />

        {/* RIGHT SIDE - Tools */}
        <div className="w-1/2 flex flex-col rounded-md p-4 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-lg text-white border text-center min-w-[300px]">
          <h2 className="text-2xl font-bold mb-5 text-cyan-400 tracking-wide">
            NoteNest
          </h2>
          <nav className="flex gap-3 flex-wrap mb-6">
            {["MindMap", "canvas"].map(
              (tool) => (
                <button
                  key={tool}
                  onClick={() => setActiveTool(tool)}
                  className={`px-4 py-2 rounded-lg font-semibold tracking-wide transition
            ${
              activeTool === tool
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/70"
                : "bg-cyan-900/40 hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/50"
            }`}
                >
                  {tool === "MindMap"
                    ? "MindMAP"
                    : tool === "canvas"
                    ? "Drawing Canvas"
                    : ""}
                </button>
              )
            )}
          </nav>

          <div className="flex-1 overflow-auto rounded-md bg-[#182635] p-5 shadow-inner shadow-cyan-800 min-h-[60vh]">
            {activeTool === "MindMap" && <MindMap />}
            {activeTool === "canvas" && <DrawingCanvas />}
          </div>
        </div>
      </div>
    </>
  );
}

// --- ToDo List ---

function MindMap() {
  const [nodes, setNodes] = useState([
    { id: "1", x: 150, y: 150, text: "Root Node" },
  ]);
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
    const directChildren = edges
      .filter((e) => e.from === nodeId)
      .map((e) => e.to);
    descendants.push(...directChildren);
    directChildren.forEach((childId) => {
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
      edges.filter(
        (edge) =>
          !allToDelete.includes(edge.from) && !allToDelete.includes(edge.to)
      )
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
      <div
        className="absolute top-2 left-2 z-20 flex gap-2 bg-[#1e293b] rounded border border-cyan-600 p-2 shadow-lg "
        style={{ userSelect: "none" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            addChildNode();
          }}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedNodeId}
        >
          + Add Node
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNode();
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedNodeId}
        >
          &times; Delete Node
        </button>
      </div>

      <div
        ref={containerRef}
        className="bg-[#1e293b] rounded border border-cyan-600 text-black select-none overflow-auto bg-amber-50"
        style={{
          height: "100%",
          position: "relative",
          userSelect: draggingNode ? "none" : "auto",
        }}
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
              ${
                selectedNodeId === id
                  ? "ring-4 ring-cyan-400 ring-opacity-75 shadow-lg"
                  : ""
              }
            `}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              className="text-white text-center outline-none"
              onBlur={(e) => updateNodeText(id, e.target.innerText)}
              onClick={(e) => e.stopPropagation()}
              style={{
                minHeight: "24px",
                userSelect: "text",
                cursor: "text",
                width: "100%",
              }}
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
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
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
