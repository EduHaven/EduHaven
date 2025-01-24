import { useState } from "react";
import { toast } from "react-toastify";
import { BotMessageSquare, X, MessageCircleMore, ArrowUp, Loader } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const apikey = "AIzaSyC-zMJyRt8UuSutFmBLGW5Ou4hROtLxLrk";

const Ai = ({ onShowId }) => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(""); // Separate state for AI response
  const [loading, setLoading] = useState(false);

  const generateQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setLoading(true);
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
        setAiResponse(generatedResponse); // Store response separately
        toast.success("Question generated successfully!");
      } else {
        toast.error("No response from AI model");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      toast.error("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="manishai" className="cursor-pointer">
      <button
        className="flex gap-3 bg-purple-800 shadow-[0_4px_100px_rgba(176,71,255,0.7)] hover:bg-purple-900 px-5 py-2.5 rounded-xl text-white font-semibold transition duration-200 transform hover:scale-105 ml-9 hover:shadow-[0_4px_100px_rgba(176,71,255,1)]"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        <BotMessageSquare />
        Ask AI
      </button>

      <dialog
        id="my_modal_1"
        className="modal backdrop:bg-black/50 bg-transparent shadow-sm min-w-[380px] w-1/3 h-5/6 "
      >
        <div className="modal-box bg-gray-800 rounded-2xl w-full h-full text-white flex flex-col overflow-hidden">
          {/* nav-bar */}
          <div className="flex justify-between items-center ">
            <h3 className="text-xl font-semibold px-4 py-2">Ask AI</h3>
            <button
              onClick={() => document.getElementById("my_modal_1").close()}
              className=" hover:bg-red-600  py-2 px-4 "
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {/* AI chat response area */}
          <div className="m-6 flex-1 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-100">
              {" "}
              <MessageCircleMore />{" "}
            </h2>
            <p
              className=" py-2  leading-relaxed  "
              style={{
                fontStyle: aiResponse ? "normal" : "italic",
              }}
            >
              {aiResponse || "No response yet..."}
            </p>
          </div>

          {/* enter prompt area */}
          <div className="modal-action text-center flex mb-4 px-4 gap-2">
            <div className=" flex-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="type your prompt..."
                className="w-full p-3 rounded-full outline-none bg-gray-900 focus:ring-2 focus:ring-blue-900"
                style={{
                  borderColor: question ? "#60a5fa" : "#d1d5db",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <button
              onClick={generateQuestion}
              className={` text-white font-bold p-3 rounded-full transition-all shadow-[0_4px_20px_rgba(176,71,255,0.3)] hover:shadow-[0_4px_70px_rgba(176,71,255,0.4)] ${
                loading
                  ? "bg-gray-900 cursor-not-allowed"
                  : "bg-purple-800 hover:bg-purple-700"
              }`}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin"/> : <ArrowUp />}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Ai;
