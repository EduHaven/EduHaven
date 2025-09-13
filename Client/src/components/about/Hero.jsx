import { GitFork, MessageSquare, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { delay, easeInOut, easeOut, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function Hero({ url, isLoading, stars, forks }) {
  // Hook for handling shuffle effect
  const useShuffleNumber = (isLoading, finalValue, speed = 50) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (isLoading) {
        const interval = setInterval(() => {
          setDisplayValue(Math.floor(Math.random() * 100));
        }, speed);

        return () => clearInterval(interval);
      } else if (finalValue !== undefined && finalValue !== null) {
        setDisplayValue(finalValue);
      }
    }, [isLoading, finalValue, speed]);

    return displayValue;
  };

  const forksDisplay = useShuffleNumber(isLoading, forks);
  const starsDisplay = useShuffleNumber(isLoading, stars);

  // paragraph text
  const paragraph =
    "EduHaven is a productivity platform designed to enhance student learning with real-time collaboration, task management, note-making, and social connectivity. Built to optimize study efficiency, it offers seamless interactions through WebRTC-powered study rooms, analytics-driven insights, and gamification.";

  // Split into words
  const words = paragraph.split(" ");

  // Motion variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.01, easeOut },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="relative h-[calc(100vh-110px)] flex flex-col items-start justify-center pb-12">
      <div className="hover:bg-ter rounded-lg transition-opacity duration-300 size-28 md:size-32">
        <img
          src="./Logo.svg"
          alt="Logo"
          className={`w-full m-auto object-contain p-4 logo-filter`}
        />
      </div>
      <motion.p
        className="text-[5vw] md:text-[3.5vw] lg:text-[2.5vw] txt font-light md:w-[77%] p-4 flex flex-wrap"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={child} className="inline-block mr-2">
            {word}
          </motion.span>
        ))}
      </motion.p>
      <a
        href="https://forms.gle/SKL45KczPnVBkY276"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          variant="secondary"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sec hover:bg-[var(--bg-ter)] ml-4"
        >
          <MessageSquare size={18} />
          share your feedback
        </Button>
      </a>

      <div className="text-sm sm:text-base txt-dim mt-5 md:absolute bottom-4 opacity-80">
        Explore full details in{" "}
        <a
          href={url}
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          README file
        </a>
      </div>

      <div className="absolute right-0 bottom-0 m-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <div className="text-sm sm:text-base txt-dim flex gap-4">
            <div className="flex items-center gap-3 p-2 txt-dim flex-col">
              <p className="text-7xl">{forksDisplay}</p>
              <span className="flex gap-2">
                <GitFork /> Forks
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 txt-dim flex-col">
              <p className="text-7xl">{starsDisplay}</p>
              <span className="flex gap-2">
                <Star /> Stars
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
