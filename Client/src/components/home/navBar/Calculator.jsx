import { CalculatorIcon, X, Sigma, Equal, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ScientificCalculator from "../popupTools/ScientificCalculator";
import GraphPlotter from "../popupTools/GraphPlotter";
import UnitConverter from "../popupTools/UnitConverter";
import { Button } from "@/components/ui/button";

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
      <Button
        size="icon"
        variant="secondary"
        className="bg-[var(--bg-sec)] hover:bg-[var(--bg-ter)] rounded-lg"
        onClick={() => {
          const modal = document.getElementById("Calc_Modal");
          modal && modal.showModal();
        }}
      >
        <CalculatorIcon />
      </Button>
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
          width: isCalcOpen ? "400px" : "0px",
          height: isCalcOpen ? "565px" : "0px",
        }}
      >
        <div className="bg-[var(--bg-primary)] p-4 rounded-3xl w-full h-full txt flex flex-col overflow-hidden relative shadow-2xl border border-[var(--bg-ter)]">
          {/* Nav-bar */}
          <div className="flex justify-between flex-wrap mb-4">
            <div className="flex gap-4">
              {["calculator", "graph", "unitconverter"].map((tool) => (
                <button
                  key={tool}
                  onClick={() => setActiveTool(tool)}
                  className={`txt-dim font-semibold transition border-b-2 p-1 pt-0
                      ${activeTool === tool
                      ? "border-[var(--btn)] text-[var(--txt)]"
                      : "border-transparent hover:txt"
                    }`}
                >
                  {tool === "calculator" ? (
                    <div className="flex gap-2 items-center text-sm">
                      <Equal size={20} /> Calculator
                    </div>
                  ) : tool === "graph" ? (
                    <div className="flex gap-2 items-center text-sm">
                      <LineChart size={20} />
                      Graph
                    </div>
                  ) : tool === "unitconverter" ? (
                    <div className="flex gap-2 items-center text-sm">
                      <Sigma size={20} />
                      Converter
                    </div>
                  ) : (
                    ""
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={closeModal}
              variant="transparent"
              size="icon"
              className="hover:txt transition txt-dim"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="flex-1 overflow-auto rounded-md min-h-[60vh]">
            {activeTool === "calculator" && <ScientificCalculator />}
            {activeTool === "graph" && <GraphPlotter />}
            {activeTool === "unitconverter" && <UnitConverter />}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Calculator;
