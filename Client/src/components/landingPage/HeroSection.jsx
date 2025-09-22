import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Sample profile data
const profiles = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar:
      "https://cdnapp.giz.ai/api/inference/images?baseModel=sdxl&prompt=Psychologist%20Dr.%20Sarah%20Chen%2C%20perfectly%20straight-on%20headshot%2C%20close-up%2C%20face%20filling%20frame%2C%20perfectly%20symmetrical%2C%20photorealistic&thumbnail&thumbnailWidth=512&thumbnailHeight=512",
    role: "UI Designer",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 2,
    name: "Alex Rivera",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: "Developer",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 3,
    name: "Maya Patel",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    role: "Product Manager",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: 4,
    name: "Jordan Kim",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "Marketing Lead",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 5,
    name: "Emma Watson",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    role: "Data Scientist",
    color: "from-indigo-400 to-purple-400",
  },
  {
    id: 6,
    name: "Carlos Santos",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    role: "Backend Dev",
    color: "from-teal-400 to-blue-400",
  },
];

function FloatingProfile({ profile, delay = 0, area = "bottom" }) {
  // Generate position based on fixed area
  const generatePositionByArea = () => {
    switch (area) {
      case "left":
        return { x: Math.random() * 15 + 5, y: Math.random() * 60 + 20 }; // Left edge
      case "right":
        return { x: Math.random() * 15 + 80, y: Math.random() * 60 + 20 }; // Right edge
      case "bottom":
      default:
        return { x: Math.random() * 70 + 15, y: Math.random() * 15 + 80 }; // Bottom edge
    }
  };

  const [basePosition] = useState(generatePositionByArea());
  const waveSpeed = 5000 + Math.random() * 3000; // 5-8 seconds per wave
  const waveAmplitude = 4 + Math.random() * 3; // 4-7% amplitude

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 50 }}
      animate={{ opacity: 0.7, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ opacity: 1, scale: 1.1 }}
      className="absolute cursor-pointer group hidden lg:block"
      style={{
        left: `${basePosition.x}%`,
        top: `${basePosition.y}%`,
        transform: "translate(-50%, -50%)",
        animation: `floatWave${profile.id} ${waveSpeed}ms ease-in-out infinite`,
      }}
    >
      <style>{`
        @keyframes floatWave${profile.id} {
          0% {
            transform: translate(-50%, -50%) translate(0px, 0px);
          }
          12.5% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.4}%, ${waveAmplitude * 0.9}%);
          }
          25% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.9}%, ${waveAmplitude * 0.7}%);
          }
          37.5% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude}%, ${waveAmplitude * 0.2}%);
          }
          50% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.8}%, -${waveAmplitude * 0.4}%);
          }
          62.5% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.3}%, -${waveAmplitude * 0.9}%);
          }
          75% {
            transform: translate(-50%, -50%)
              translate(-${waveAmplitude * 0.2}%, -${waveAmplitude * 0.8}%);
          }
          87.5% {
            transform: translate(-50%, -50%)
              translate(-${waveAmplitude * 0.6}%, -${waveAmplitude * 0.3}%);
          }
          100% {
            transform: translate(-50%, -50%) translate(0px, 0px);
          }
        }
      `}</style>
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
      >
        {/* Avatar with online indicator */}
        <motion.div
          className="relative w-12 h-12 mb-2"
          whileHover={{
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <motion.img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: delay + 0.5,
              duration: 0.6,
              type: "spring",
              bounce: 0.4,
            }}
          />
          {/* Online indicator */}
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: delay + 0.8,
              duration: 0.4,
              type: "spring",
              bounce: 0.6,
            }}
          >
            <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
          </motion.div>
        </motion.div>

        {/* Name */}
        <motion.p
          className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm bg-opacity-80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 1, duration: 0.4 }}
        >
          {profile.name}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative h-[calc(100vh-50px)] mx-auto overflow-hidden pt-[30px] sm:pt-5 px-4 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating profiles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {profiles.slice(0, 2).map((profile, index) => (
          <FloatingProfile
            key={profile.id}
            profile={profile}
            delay={0.5 + index * 0.3}
            area="left"
          />
        ))}
        {profiles.slice(2, 4).map((profile, index) => (
          <FloatingProfile
            key={profile.id}
            profile={profile}
            delay={0.8 + index * 0.3}
            area="right"
          />
        ))}
        {profiles.slice(4, 6).map((profile, index) => (
          <FloatingProfile
            key={profile.id}
            profile={profile}
            delay={1.1 + index * 0.3}
            area="bottom"
          />
        ))}
      </div>

      {/* Screenshot */}
      <motion.div
        className="w-fit mx-auto mb-8 sm:mb-12 lg:mb-16 relative overflow-hidden group"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="h-[33vh] sm:h-[40vh] lg:h-[50vh] aspect-[2/1] bg-cover bg-center rounded-lg sm:rounded-none lg:mt-0 mt-5"
          style={{ backgroundImage: "url('/Page1LightScreenshot.png')" }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[25vh] sm:h-[35vh] lg:h-[45vh] bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        className="absolute top-[35%] sm:top-[40%] left-0 z-20 w-full flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
      >
        <motion.h2
          className="text-[8vw] sm:text-[6vw] lg:text-[4vw] font-light txt bg-clip-text font-poppins"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Everything you need in one place
        </motion.h2>
        <motion.h2
          className="text-[5vw] sm:text-[4vw] lg:text-[2.5vw] font-light txt-dim bg-clip-text font-poppins  mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          learn, collaborate, & grow together.
        </motion.h2>
        <Button
          onClick={() => navigate("/auth/login")}
          variant="default"
          size="default"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all transform duration-300 shadow-lg hover:shadow-xl"
          style={{}}
        >
          Get started
        </Button>
      </motion.div>

      {/* Background ambient effects */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0 }}
      >
        <div className="absolute top-1/4 left-1/4 sm:w-32 h-24 sm:h-32 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-36 h-36 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </motion.div>
    </motion.div>
  );
}

export default HeroSection;
