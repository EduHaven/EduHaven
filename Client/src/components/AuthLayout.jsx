import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import bgImg from "../assets/LoginBackground.jpg";

const containerVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const backgroundVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
};

// Same form variants you had before
const formVariants = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AuthLayout() {
  const location = useLocation(); // Track current route for AnimatePresence

  return (
    <motion.div
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <motion.div
        layout
        variants={containerVariants}
        initial="initial"
        animate="animate"
        transition={{
          layout: {
            type: "spring",
            stiffness: 400,
            damping: 40,
            duration: 0.4,
          },
        }}
        className="relative w-full max-w-md p-8 bg-white/80 dark:bg-black/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10"
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex w-full items-center gap-2 mb-10 dark:invert">
            <img src="/Logo.svg" alt="Logo" className="size-8" />
            <h3 className="text-black font-semibold text-xl">Eduhaven</h3>
          </div>

          {/* Animated route outlet */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname} // route-based animation
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
