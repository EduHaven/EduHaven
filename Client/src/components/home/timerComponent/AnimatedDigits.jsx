import { motion, AnimatePresence } from "framer-motion";

// Splits a padded string (like "01") into individual digits
// and animates only the digit that changes.

function AnimatedDigits({ value }) {
  // value should be a string already padded (e.g. "01")
  return (
    <span className="flex">
      {value.split("").map((digit, index) => (
        <span
          key={index}
          className="relative inline-block h-16"
          style={{ minWidth: "1ch" }}
        >
          <AnimatePresence mode="wait">
            {/* Using a composite key so that when a digit changes, it remounts */}
            <motion.span
              key={`${index}-${digit}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
          {/* Invisible copy to maintain layout */}
          <span className="invisible">{digit}</span>
        </span>
      ))}
    </span>
  );
}

export default AnimatedDigits;
