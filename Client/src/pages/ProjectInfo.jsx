import { useEffect, useState } from "react";
import {
  Github,
  Users,
  Star,
  Code,
  GitFork,
  Calendar,
  FileText,
  SmilePlus,
  BookOpen,
  BarChart3,
  Trophy,
  MessageCircle,
  Bot,
  UserPlus,
  Video,
  Target,
} from "lucide-react";
import AdCard from "@/components/AdCard";
import { motion } from "framer-motion";

const GITHUB_API_URL = "https://api.github.com/repos/amandollar/EduHaven";

// Updated Skeleton components
const TextSkeleton = ({ width = "full", height = "4" }) => (
  <div className={`bg-sec rounded h-${height} w-${width} animate-pulse`}></div>
);

const AvatarSkeleton = () => (
  <div className="bg-sec rounded-full w-15 h-15 sm:w-24 sm:h-24 animate-pulse"></div>
);

const ContributorSkeleton = () => (
  <div className="flex flex-col items-center p-3 rounded-3xl text-center">
    <AvatarSkeleton />
    <TextSkeleton width="24" height="4" className="mt-2" />
    <TextSkeleton width="32" height="3" />
  </div>
);

// Feature item component with subtle animation
const FeatureItem = ({ icon: Icon, children }) => (
  <motion.li
    className="flex items-start gap-3 txt-dim"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      className="mt-1 flex-shrink-0"
    >
      <Icon className="w-5 h-5 text-blue-400" />
    </motion.div>
    <span>{children}</span>
  </motion.li>
);

export default function Info() {
  const [repoData, setRepoData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRepoData() {
      try {
        setIsLoading(true);
        const [repoResponse, contributorsResponse] = await Promise.all([
          fetch(GITHUB_API_URL),
          fetch(`${GITHUB_API_URL}/contributors`)
        ]);

        const [repoJson, contributorsJson] = await Promise.all([
          repoResponse.json(),
          contributorsResponse.json()
        ]);

        setRepoData(repoJson);
        setContributors(contributorsJson);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRepoData();
  }, []);

  return (
    <div className="m-6 min-h-screen txt px-4 sm:px-6 lg:px-8">
      {/* Navbar - Always visible */}
      <nav className="flex items-center justify-between">
        <h1 className="text-3xl font-bold txt">Our Open-Source Work</h1>
        <motion.a
          href={repoData?.html_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl hover:bg-sec flex gap-3 items-center px-4 py-3 bg-ter"
        >
          <Github className="w-6 h-6" />
          Open on Github
        </motion.a>
      </nav>

      {/* Description - Skeleton when loading */}
      <h2 className="text-l sm:text-2xl mb-4 txt-dim">
        {isLoading ? (
          <TextSkeleton width="3/4" height="6" />
        ) : (
          repoData?.description || "No description available."
        )}
      </h2>

      <div className="flex justify-center gap-10 mt-8">
        {/* Left section */}
        <div className="max-w-5xl p-4 sm:p-6 flex flex-col gap-10">
          {/* Overview - Static content remains, dynamic parts get skeleton */}
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold mb-4 flex items-center txt">
              <FileText className="mr-2" /> OVERVIEW
            </h2>
            <p className="text-lg txt-dim">
              EduHaven is a productivity platform designed to enhance student
              learning with real-time collaboration, task management,
              note-making, and social connectivity. Built to optimize study
              efficiency, it offers seamless interactions through WebRTC-powered
              study rooms, analytics-driven insights, and gamification.
            </p>
            <div className="text-sm sm:text-base txt-dim mt-5">
              {isLoading ? (
                <TextSkeleton width="1/2" height="4" />
              ) : (
                <>
                  Explore the full details of this project in the{" "}
                  <a
                    href={`${repoData?.html_url}/blob/main/README.md`}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    README file
                  </a>
                </>
              )}
            </div>
          </div>

          <hr className="opacity-40" />

          {/* Key features - Updated with professional icons */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 flex items-center txt">
                Key Features
              </h2>
              <ul className="space-y-3">
                <FeatureItem icon={BookOpen}>
                  Add notes, Set goals, Add Events for organised learning
                </FeatureItem>
                <FeatureItem icon={BarChart3}>
                  Analytics Productivity tracking with real-time insights
                </FeatureItem>
                <FeatureItem icon={Trophy}>
                  Gamification Badges & streaks to boost motivation
                </FeatureItem>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 flex items-center txt">
                Real-Time Collaboration
              </h2>
              <ul className="space-y-3">
                <FeatureItem icon={Video}>
                  Study Rooms Live chat, audio/video calls via WebRTC
                </FeatureItem>
                <FeatureItem icon={Bot}>
                  AI Chatbot Study assistance & productivity guidance
                </FeatureItem>
                <FeatureItem icon={UserPlus}>
                  Social Features Add friends, track, and collaborate
                </FeatureItem>
              </ul>
            </motion.div>
          </div>

          {/* Why it stands out - Static content */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 gap-2 flex items-center txt">
              <SmilePlus /> Why It Stands Out?
            </h3>
            <p className="txt-dim">
              EduHaven is more than just a study app—it's a community-driven,
              data-backed platform that fosters productivity, teamwork, and
              personalized learning. By leveraging real-time features and
              gamification, it ensures students stay engaged and on track.
            </p>
          </motion.div>

          <hr className="opacity-40" />

          {/* Team members - Skeleton when loading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg lg:text-2xl font-semibold mb-4 flex items-center txt">
              <Users className="mr-2" /> Team members
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
              {isLoading
                ? Array(8).fill(0).map((_, i) => <ContributorSkeleton key={i} />)
                : contributors.map((contributor, index) => (
                  <motion.a
                    key={contributor.id}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 hover:bg-sec rounded-3xl text-center text-xs sm:text-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="w-15 h-15 sm:w-24 sm:h-24 rounded-full mb-1"
                    />
                    <p className="mt-2 font-medium txt">{contributor.login}</p>
                    <p className="txt-dim">
                      Contributions: {contributor.contributions}
                    </p>
                  </motion.a>
                ))}
            </div>
          </motion.div>
          <hr className="opacity-40" />
        </div>

        {/* Right section - Skeleton for dynamic content */}
        <div className="flex-shrink-0">
          {/* About - Skeleton when loading */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="semi-bold text-xl txt">About</h2>
            <div className="text-sm sm:text-base txt-dim">
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Star /> {isLoading ? <TextSkeleton width="16" /> : `${repoData?.stargazers_count} Stars`}
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <GitFork /> {isLoading ? <TextSkeleton width="16" /> : `${repoData?.forks_count} Forks`}
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Code /> {isLoading ? <TextSkeleton width="16" /> : repoData?.language}
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Calendar /> Created:{" "}
                {isLoading ? <TextSkeleton width="24" /> : new Date(repoData?.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Calendar /> Updated:{" "}
                {isLoading ? <TextSkeleton width="24" /> : new Date(repoData?.updated_at).toLocaleDateString()}
              </div>
            </div>
          </motion.div>

          {/* Additional Details - Skeleton when loading */}
          <motion.div
            className="mt-9"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="semi-bold text-xl txt">Additional Details</h2>
            <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-base txt-dim mx-2">
              <li className="p-2">
                Default Branch: {isLoading ? <TextSkeleton width="16" /> : repoData?.default_branch}
              </li>
              <li className="p-2">
                License:{" "}
                {isLoading ? (
                  <TextSkeleton width="24" />
                ) : (
                  repoData?.license?.name || "No license specified"
                )}
              </li>
              <li className="p-2">
                Watchers: {isLoading ? <TextSkeleton width="16" /> : repoData?.watchers_count}
              </li>
              <li className="p-2">
                Size: {isLoading ? <TextSkeleton width="16" /> : `${repoData?.size} KB`}
              </li>
            </ul>

 <div className="mt-6 text-center space-y-2">
              <a
                href="/privacy"
                className="text-blue-400 hover:underline text-sm"
              >
                Privacy Policy
              </a>
              <p className="text-xs txt-dim">© 2025 EduHaven</p>
            </div>

          </motion.div>
          <motion.div
            className="w-72 mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <AdCard />
          </motion.div>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
}