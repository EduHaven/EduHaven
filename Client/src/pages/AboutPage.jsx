import { useEffect, useState } from "react";
import Hero from "@/components/about/Hero";
import AboutNav from "@/components/about/AboutNav";
import IdeaBehindEduhaven from "@/components/about/IdeaBehind";
import OurContributors from "@/components/about/OurContributors";
import Footer from "@/components/about/Footer";
import AdCard from "@/components/AdCard";

const GITHUB_API_URL = "https://api.github.com/repos/amandollar/EduHaven";

export default function About() {
  const [repoData, setRepoData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRepoData() {
      try {
        setIsLoading(true);

        const headers = {};
        if (import.meta.env.VITE_GITHUB_TOKEN) {
          headers.Authorization = `token ${import.meta.env.VITE_GITHUB_TOKEN}`;
        }

        const [repoResponse, contributorsResponse] = await Promise.all([
          fetch(GITHUB_API_URL, { headers }),
          fetch(`${GITHUB_API_URL}/contributors`, { headers }),
        ]);

        const [repoJson, contributorsJson] = await Promise.all([
          repoResponse.json(),
          contributorsResponse.json(),
        ]);

        setRepoData(repoJson);

        // Guard against non-array responses
        if (Array.isArray(contributorsJson)) {
          setContributors(contributorsJson);
        } else {
          console.warn(
            "Contributors response is not an array:",
            contributorsJson
          );
          setContributors([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setContributors([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRepoData();
  }, []);

  return (
    <div className="p-6 min-h-screen txt px-4 sm:px-6 lg:px-8 w-[calc(100vw-80px)] overflow-hidden">
      <AboutNav />
      <Hero
        url={`${repoData?.html_url}/blob/main/README.md`}
        isLoading={isLoading}
        forks={repoData?.forks_count}
        stars={repoData?.stargazers_count}
      />
      <IdeaBehindEduhaven />
      <OurContributors isLoading={isLoading} contributors={contributors} />
      <div className="max-w-96 space-y-4">
        <h1 className="text-lg md:text-2xl my-5">More products from us:</h1>
        <AdCard />
      </div>
      <Footer isLoading={isLoading} repoData={repoData} />
      <div className="h-8"></div>
    </div>
  );
}
