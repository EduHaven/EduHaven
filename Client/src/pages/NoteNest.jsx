import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit3, Palette, Image, Map, Trash2, X, ArrowLeft, Save } from 'lucide-react';

// Main Notes App Component
export default function NotesApp() {
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Welcome to NoteNest',
      content: 'This is your first note. You can edit it, change its color, or create new ones!',
      color: '#ffffff',
      createdAt: new Date().toISOString(),
      images: [],
      drawings: [],
      mindMaps: []
    }
  ]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState('mindmap');

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: '#ffffff',
      createdAt: new Date().toISOString(),
      images: [],
      drawings: [],
      mindMaps: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const colors = [
    '#ffffff', '#fef3c7', '#fecaca', '#fed7d7', '#e9d5ff',
    '#ddd6fe', '#bfdbfe', '#a7f3d0', '#fed7aa', '#fde68a'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                NoteNest
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={(updates) => updateNote(selectedNote.id, updates)}
            onClose={() => setSelectedNote(null)}
            colors={colors}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Notes List */}
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Notes</h2>
                <button
                  onClick={createNewNote}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  New Note
                </button>
              </div>
              <NotesList
                notes={notes}
                onSelectNote={setSelectedNote}
                onDeleteNote={deleteNote}
                onUpdateNote={updateNote}
                colors={colors}
              />
            </div>

            {/* Right Column - Tools Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex bg-gray-100 dark:bg-gray-700">
                  <button
                    onClick={() => setActiveTab('mindmap')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'mindmap'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    MindMAP
                  </button>
                  <button
                    onClick={() => setActiveTab('drawing')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'drawing'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    Drawing Canvas
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  {activeTab === 'mindmap' && <MainMindMapEditor />}
                  {activeTab === 'drawing' && <MainDrawingCanvas />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Notes List Component
function NotesList({ notes, onSelectNote, onDeleteNote, onUpdateNote, colors }) {
  return (
    <div className="space-y-4">
      {notes.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Edit3 className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Create your first note to get started</p>
        </div>
      ) : (
        notes.map(note => (
          <NoteListItem
            key={note.id}
            note={note}
            onSelect={() => onSelectNote(note)}
            onDelete={() => onDeleteNote(note.id)}
            onUpdateColor={(color) => onUpdateNote(note.id, { color })}
            colors={colors}
          />
        ))
      )}
    </div>
  );
}

// Individual Note List Item
function NoteListItem({ note, onSelect, onDelete, onUpdateColor, colors }) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 180;
  };

  const textColorClass = isLightColor(note.color) ? 'text-gray-900' : 'text-white';
  const mutedTextColorClass = isLightColor(note.color) ? 'text-gray-700' : 'text-gray-200';

  return (
    <div
      className="group relative rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      style={{ backgroundColor: note.color }}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-medium truncate flex-1 pr-2 ${textColorClass}`}>
            {note.title || 'Untitled'}
          </h3>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className={`p-1 rounded-md hover:bg-black/10 transition-colors ${textColorClass}`}
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`p-1 rounded-md hover:bg-black/10 transition-colors ${textColorClass}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className={`text-sm line-clamp-3 mb-2 leading-relaxed ${mutedTextColorClass}`}>
          {note.content || 'No content yet...'}
        </p>

        <p className={`text-xs ${mutedTextColorClass}`}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="absolute top-12 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 z-20">
            <div className="grid grid-cols-5 gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateColor(color);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Mind Map Editor Component
function MainMindMapEditor() {
  const [nodes, setNodes] = useState([
    { id: '1', x: 300, y: 150, text: 'Root Node' }
  ]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState('1');

  const addNode = () => {
    if (!selectedNode) return;

    const newId = Date.now().toString();
    const parentNode = nodes.find(n => n.id === selectedNode);
    const angle = Math.random() * 2 * Math.PI;
    const distance = 120;

    const newNode = {
      id: newId,
      x: Math.max(50, Math.min(450, parentNode.x + Math.cos(angle) * distance)),
      y: Math.max(50, Math.min(200, parentNode.y + Math.sin(angle) * distance)),
      text: 'New Node'
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, { from: selectedNode, to: newId }]);
  };

  const deleteNode = () => {
    if (!selectedNode || selectedNode === '1') return;

    setNodes(nodes.filter(n => n.id !== selectedNode));
    setEdges(edges.filter(e => e.from !== selectedNode && e.to !== selectedNode));
    setSelectedNode('1');
  };

  const updateNodeText = (id, text) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, text } : n));
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button
          onClick={addNode}
          disabled={!selectedNode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          + Add Node
        </button>
        <button
          onClick={deleteNode}
          disabled={!selectedNode || selectedNode === '1'}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          × Delete Node
        </button>
      </div>

      {/* Mind Map Canvas */}
      <div className="relative w-full h-80 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromNode.x + 60}
                y1={fromNode.y + 20}
                x2={toNode.x + 60}
                y2={toNode.y + 20}
                stroke="#3b82f6"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute w-32 h-10 rounded border-2 cursor-pointer flex items-center justify-center text-sm font-medium transition-all hover:shadow-md ${selectedNode === node.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-200 dark:ring-blue-800'
                : 'border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-500 dark:hover:border-gray-400'
              }`}
            style={{
              left: Math.max(0, Math.min(node.x, 400)),
              top: Math.max(0, Math.min(node.y, 280))
            }}
            onClick={() => setSelectedNode(node.id)}
          >
            <input
              type="text"
              value={node.text}
              onChange={(e) => updateNodeText(node.id, e.target.value)}
              className={`w-full text-center text-xs bg-transparent border-none outline-none px-2 ${selectedNode === node.id ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Drawing Canvas Component
function MainDrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 600;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = thickness;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      <div className="flex items-center gap-4 flex-wrap p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
            disabled={tool === 'eraser'}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            className="w-20"
          />
          <span className="text-sm w-6 text-gray-900 dark:text-white">{thickness}px</span>
        </div>

        <button
          onClick={clearCanvas}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm ml-auto"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair bg-white dark:bg-gray-900 shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

// Note Editor Component
function NoteEditor({ note, onUpdate, onClose, colors }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleTitleChange = (e) => {
    onUpdate({ title: e.target.value });
  };

  const handleContentChange = (e) => {
    onUpdate({ content: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [...(note.images || []), reader.result];
      onUpdate({ images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const newImages = note.images.filter((_, i) => i !== index);
    onUpdate({ images: newImages });
  };

  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 180;
  };

  const textColorClass = isLightColor(note.color) ? 'text-gray-900' : 'text-white';
  const placeholderColorClass = isLightColor(note.color) ? 'placeholder-gray-500' : 'placeholder-gray-300';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
            >
              <Palette className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {showColorPicker && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-3 z-20">
                <div className="grid grid-cols-5 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        onUpdate({ color });
                        setShowColorPicker(false);
                      }}
                      className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div
        className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
        style={{ backgroundColor: note.color }}
      >
        <div className="p-8">
          {/* Title */}
          <input
            type="text"
            value={note.title}
            onChange={handleTitleChange}
            placeholder="Note title..."
            className={`w-full text-3xl font-bold bg-transparent border-none outline-none resize-none mb-6 ${textColorClass} ${placeholderColorClass}`}
          />

          {/* Content Tools */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Image className="w-4 h-4 mr-2" />
              Add Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Text Content */}
          <div className="mb-8">
            <textarea
              value={note.content}
              onChange={handleContentChange}
              placeholder="Start writing your note..."
              className={`w-full h-80 bg-transparent border-none outline-none resize-none text-lg leading-relaxed ${textColorClass} ${placeholderColorClass}`}
            />
          </div>

          {/* Images */}
          {note.images?.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-xl font-semibold mb-4 ${textColorClass}`}>Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {note.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt=""
                      className="w-full h-48 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}