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
} from "lucide-react";
import AdCard from "@/components/AdCard";

const GITHUB_API_URL = "https://api.github.com/repos/amandollar/EduHaven";

export default function Info() {
  const [repoData, SetRepoData] = useState(null);
  const [contributors, SetContributors] = useState([]);

  useEffect(() => {
    async function fetchRepoData() {
      try {
        const repoResponse = await fetch(GITHUB_API_URL);
        console.log(repoResponse);
        const repoJson = await repoResponse.json();
        console.log(repoJson);
        SetRepoData(repoJson);

        const ContributorsResopnse = await fetch(
          `${GITHUB_API_URL}/contributors`
        );
        const contributorsJson = await ContributorsResopnse.json();
        SetContributors(contributorsJson);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchRepoData();
  }, []);
  if (!repoData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl txt">
        Loading...
      </div>
    );
  }
  return (
    <div className="m-6 min-h-screen txt px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <nav className="flex items-center justify-between">
        <h1 className="text-3xl font-bold txt">Our Open-Source Work</h1>
        <a
          href={repoData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl hover:bg-sec flex gap-3 items-center px-4 py-3 bg-ter"
        >
          <Github className="w-6 h-6" />
          Open on Github
        </a>
      </nav>
      <h2 className="text-l sm:text-2xl mb-4 txt-dim">
        {repoData.description || "No description available."}
      </h2>

      <div className="flex justify-center gap-10 mt-8">
        {/* left section */}
        <div className="max-w-5xl p-4 sm:p-6 flex flex-col gap-10">
          {/* Overview */}
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
            <p className="text-sm sm:text-base txt-dim mt-5">
              Explore the full details of this project in the{" "}
              <a
                href={`${repoData.html_url}/blob/main/README.md`}
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                README file
              </a>
            </p>
          </div>

          <hr className="opacity-40" />

          {/* key-features | why it stands-out*/}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 flex items-center txt">
                Key Features
              </h2>
              <ul className="txt-dim space-y-2">
                <li>
                  ✅ Add notes, Set goals, Add Events for organised learning
                </li>
                <li>
                  📊 Analytics Productivity tracking with real-time insights.
                </li>
                <li>🎮 Gamification Badges & streaks to boost motivation.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 flex items-center txt">
                Real-Time Collaboration
              </h2>
              <ul className="list-none list-inside txt-dim space-y-2">
                <li>💬 Study Rooms Live chat, audio/video calls via WebRTC.</li>
                <li>🤖 AI Chatbot Study assistance & productivity guidance.</li>
                <li>👥 Social Features Add friends, track, and collaborate.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 gap-2 flex items-center txt">
              <SmilePlus /> Why It Stands Out?
            </h3>
            <p className="txt-dim">
              EduHaven is more than just a study app—it’s a community-driven,
              data-backed platform that fosters productivity, teamwork, and
              personalized learning. By leveraging real-time features and
              gamification, it ensures students stay engaged and on track.
            </p>
          </div>

          <hr className="opacity-40" />

          {/* team-members */}
          <div>
            <h2 className="text-lg lg:text-2xl font-semibold mb-4 flex items-center txt">
              <Users className="mr-2" /> Team members
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
              {contributors.map((contributor) => (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 hover:bg-sec rounded-3xl text-center text-xs sm:text-sm"
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
                </a>
              ))}
            </div>
          </div>
          <hr className="opacity-40" />
        </div>

        {/* right-section */}
        <div className="flex-shrink-0">
          {/* about */}
          <div>
            <h2 className="semi-bold text-xl txt">About</h2>
            <div className="text-sm sm:text-base txt-dim">
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Star /> {repoData.stargazers_count} Stars
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <GitFork /> {repoData.forks_count} Forks
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Code /> {repoData.language}
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Calendar /> Created:{" "}
                {new Date(repoData.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 p-2 txt-dim">
                <Calendar /> Updated:{" "}
                {new Date(repoData.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-9">
            <h2 className="semi-bold text-xl txt">Additional Details</h2>
            <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-base txt-dim mx-2">
              <li className="p-2">Default Branch: {repoData.default_branch}</li>
              <li className="p-2">
                License:{" "}
                {repoData.license
                  ? repoData.license.name
                  : "No license specified"}
              </li>
              <li className="p-2">Watchers: {repoData.watchers_count}</li>
              <li className="p-2">Size: {repoData.size} KB</li>
            </ul>
          </div>
          <div className="w-72 mt-8 space-y-4">
            <AdCard />
          </div>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
}
