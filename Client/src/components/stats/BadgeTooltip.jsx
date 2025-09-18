import { Award } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BadgeTooltip = ({ badge, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative origin-bottom"
            >
              <div className="bg-[var(--bg-ter)] rounded-2xl shadow-lg p-5 min-w-[280px] max-w-[250px]">
                <div className="text-center">
                  <h4 className="text-[var(--txt)] p-1.5 px-4 bg-sec w-fit mx-auto rounded-full flex items-center gap-1">
                    <Award size={17} />
                    {badge.name}
                  </h4>
                  <p className="text-md text-[var(--txt)] mt-3 mb-1">
                    {badge.description}
                  </p>
                </div>

                {/* Tooltip triangle (below the card) */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[15px] border-transparent border-t-[var(--bg-ter)] drop-shadow-md" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeTooltip;
