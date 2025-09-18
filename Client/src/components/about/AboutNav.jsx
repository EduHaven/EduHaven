import { Github } from "lucide-react";

import { motion } from "framer-motion";

function AboutNav() {
  return (
    <nav className="flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-semibold txt">
        Our Open-Source Work
      </h1>
      <motion.a
        href={"https://github.com/EduHaven/EduHaven"}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-xl bg-sec flex gap-3 items-center px-4 py-3 hover:bg-ter"
      >
        <Github className="w-6 h-6" />
        <p className="hidden md:block">Open on Github</p>
      </motion.a>
    </nav>
  );
}

export default AboutNav;
