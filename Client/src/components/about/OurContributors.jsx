import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function OurContributors({ isLoading, contributors }) {
  const ContributorSkeleton = () => (
    <div className="text-center text-xs sm:text-sm aspect-square overflow-hidden group">
      <div className="bg-sec relative w-full h-full animate-pulse"></div>
    </div>
  );
  return (
    <div className="mt-32 mb-14">
      <h1 className="text-3xl md:text-[4vw] xl:text-[3vw] font-light mb-12">
        Built Together by Amazing People
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2.5">
          {isLoading
            ? Array(15)
                .fill(0)
                .map((_, i) => <ContributorSkeleton key={i} />)
            : contributors.map((contributor, index) => (
                <motion.a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs sm:text-sm aspect-square overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ease-out"
                    />
                    <div className="absolute bottom-0 z-10 w-full h-fit pt-10 bg-gradient-to-t from-black to-transparent text-left p-3 pb-2 flex items-center justify-between">
                      <p className="text-xs md:text-lg xl:text-xl 2xl:text-2xl font-semibold text-white">
                        {contributor.login}
                      </p>
                    </div>
                    <p
                      className="absolute top-2 right-2 text-xs md:text-md xl:text-xl text-white -mb-1 bg-black/60 px-2 rounded-full"
                      title={`${contributor.contributions} contributions`}
                    >
                      {contributor.contributions}
                    </p>
                  </div>
                </motion.a>
              ))}
        </div>
      </motion.div>
      <div className="w-fit ml-auto my-4 ">
        <Button
          variant="secondary"
          className="p-2 pl-3 text-lg bg-transparent hover:bg-[var(--bg-sec)]"
        >
          <a
            href="https://github.com/eduHaven/EduHaven/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 items-center"
          >
            View all contributors on GitHub
            <ArrowUpRight size={20} />
          </a>
        </Button>
      </div>
    </div>
  );
}

export default OurContributors;
