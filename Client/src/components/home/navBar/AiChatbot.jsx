import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BotMessageSquare,
  X,
  ArrowUp,
  Loader,
  Spline,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const apikey = import.meta.env.VITE_GEMINI_KEY;

// Variants for the chat panel
const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Variants for each chat message
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const Ai = () => {
  const [question, setQuestion] = useState("");
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("edu_chat");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("edu_chat", JSON.stringify(messages));
  }, [messages]);

  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 350, height: 500 });
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 350, height: 500 });

  useEffect(() => {
    const modalEl = document.getElementById("my_modal_1");
    if (modalEl) {
      modalEl.showModal = () => setIsChatOpen(true);
      modalEl.close = () => {
        setIsChatOpen(false);
        setMessages([]);
      };
    }
  }, []);

  // scroll chat to end
  useEffect(() => {
    if (isChatOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [isChatOpen, messages]);

  const generateQuestion = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = { type: "user", text: question, time: currentTime };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: question }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data && data.candidates && data.candidates.length > 0) {
        const generatedResponse =
          data.candidates[0]?.content?.parts[0]?.text || "No response found";
        const aiMessage = {
          type: "ai",
          text: generatedResponse,
          time: currentTime,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      generateQuestion();
    }
  };

  const closeModal = () => {
    setIsChatOpen(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("edu_chat");
  };

  // --- Resizable functionality from the top-left corner ---
  const handleMouseDown = (e) => {
    resizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizing.current) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    const newWidth = Math.min(
      Math.max(startDimensions.current.width - deltaX, 300),
      window.innerWidth * 0.96
    );
    const newHeight = Math.min(
      Math.max(startDimensions.current.height - deltaY, 400),
      window.innerHeight * 0.94
    );
    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  // --- End resizable functionality ---

  return (
    <div id="manishai">
      {/* Ask AI Button */}
      <Button
        size="lg"
        variant="default"
        className="shadow-[0_4px_100px_rgba(176,71,255,0.7)] font-semibold hover:shadow-[0_4px_100px_rgba(176,71,255,1)]"
        onClick={() => {
          const modalEl = document.getElementById("my_modal_1");
          modalEl && modalEl.showModal();
        }}
      >
        <BotMessageSquare />
        Ask AI
      </Button>

      {/* Chat Panel: render into document.body via portal so close is reliable */}
      {ReactDOM.createPortal(
        <div
          // overlay container
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            pointerEvents: isChatOpen ? "auto" : "none",
          }}
        >
          {/* overlay: clicking outside closes */}
          <div
            onClick={() => setIsChatOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: isChatOpen ? "rgba(0,0,0,0.24)" : "transparent",
              transition: "background 120ms",
            }}
          />

          <motion.div
            id="my_modal_1"
            variants={panelVariants}
            initial="hidden"
            animate={isChatOpen ? "visible" : "hidden"}
            exit="hidden"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: dimensions.width,
              height: dimensions.height,
            }}
            onClick={(e) => e.stopPropagation()}
            key="ai-portal-panel"
          >
            <div
              className="bg-primary rounded-3xl w-full h-full txt flex flex-col overflow-hidden relative shadow-2xl"
              style={{ boxShadow: `0 0 1rem var(--btn)` }}
            >
              {/* Resizer handle using the Spline icon */}
              <div
                onMouseDown={handleMouseDown}
                className="absolute top-0 left-0 p-2 cursor-nw-resize z-50"
              >
                <Spline className="w-5 h-5 txt-dim" />
              </div>

              {/* Nav-bar */}
              <div
                className="flex justify-between items-center px-2 py-0.5 border-b"
                style={{ borderColor: "var(--bg-sec)" }}
              >
                <h3 className="text-lg txt-dim font-semibold pl-8">Ask AI</h3>
                <div className="flex items-center gap-2.5">
                  {messages.length > 0 && (
                    <Button
                      onClick={clearChat}
                      variant="destructive"
                      size="default"
                      className="flex items-center gap-1 my-auto px-2.5 py-1 rounded-full text-sm bg-gray-500/10 hover:bg-gray-500/20 txt-dim"
                      title="Clear Chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </Button>
                  )}
                  <Button
                    onClick={closeModal}
                    variant="transparent"
                    size="icon"
                    className="hover:txt transition p-2 txt-dim"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Chat area */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg font-medium text-center">
                      Hey! Welcome to{" "}
                      <span style={{ color: "var(--btn)" }}>EduHaven AI</span>
                      <br />
                      How can I help you today?
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"
                        }`}
                    >
                      <p
                        className={`py-2 px-4 rounded-lg ${msg.type === "user"
                          ? "bg-sec txt"
                          : "bg-transparent txt"
                          }`}
                      >
                        {msg.text}
                      </p>
                      <span className="text-sm txt-dim mt-1">{msg.time}</span>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input area */}
              <div
                className="p-1 border rounded-full flex"
                style={{ borderColor: "var(--bg-sec)" }}
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Eduhaven AI..."
                    className="w-full p-3 rounded-full outline-none bg-transparent focus:ring-2 focus:ring-transparent"
                  />
                </div>
                <Button
                  onClick={generateQuestion}
                  variant="default"
                  size="default"
                  className={`txt font-bold p-3 rounded-full transition-all shadow-[0_4px_20px_rgba(var(--shadow-rgb),0.3)] hover:shadow-[0_4px_70px_rgba(var(--shadow-rgb),0.4)] ${loading ? "bg-sec cursor-not-allowed" : "btn hover:bg-[var(--btn-hover)]"}`}
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : <ArrowUp />}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Ai;
