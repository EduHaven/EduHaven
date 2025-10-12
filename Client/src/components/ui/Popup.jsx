import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const PopupContainer = ({ title, onClose, children, width = "w-96" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1],
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className={`relative ${width} bg-sec rounded-3xl p-6 shadow-2xl shadow-black/40 border ${
              isShaking
                ? "border-2 border-[var(--txt-dim)] "
                : "border-[var(--bg-ter)]"
            } transition-colors`}
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 60,
              rotateX: -15,
            }}
            animate={{
              scale: isShaking ? 1.05 : 1,
              opacity: 1,
              y: 0,
              rotateX: 0,
              x: isShaking ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            exit={{
              scale: 0.93,
              opacity: 0,
              y: 30,
              rotateX: 10,
              transition: {
                duration: 0.15,
                ease: "easeIn",
              },
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8,
              x: isShaking
                ? {
                    duration: 0.3,
                    ease: "easeInOut",
                  }
                : undefined,
              scale: isShaking
                ? {
                    duration: 0.3,
                    ease: "easeOut",
                  }
                : undefined,
            }}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="flex items-center justify-between mb-6 bg- red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                delay: 0.1,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <h2 className="text-2xl font-semibold txt">{title}</h2>
              <motion.div
                className="hover:bg-[var(--bg-ter)] p-1 rounded-full"
                whileHover={{
                  scale: 1.1,
                  rotate: 10,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                }}
                onClick={handleClose}
              >
                <X size={24} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                delay: 0.15,
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupContainer;
