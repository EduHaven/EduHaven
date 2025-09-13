import { Lightbulb } from "lucide-react";
import React from "react";

function IdeaBehindEduhaven() {
  return (
    <div className="md:flex max-w-7xl mx-auto my-16 md:my-28 justify-evenly items-start gap-6">
      <div className="relative md:w-1/3">
        <Lightbulb
          size={200}
          strokeWidth={0.6}
          className="absolute opacity-10 left-[10%] top-8 hidden md:block"
        />
        <h1 className="text-xl lg:text-3xl font-light">Idea behind EduHaven</h1>
      </div>

      <div className="md:w-2/3 txt-dim leading-relaxed space-y-4 text-lg">
        <li>
          Back when we were studying, we relied on <strong>Discord</strong> to
          connect with friends and collaborate. It worked, but it wasn’t really
          built for learning lots of distractions and missing the structure
          students need.
        </li>
        <li>
          Other “study platforms” we tried were no better. Most just connected
          random people online to silently self-study with cameras on. There was
          no true collaboration, no community, and nothing to keep students
          motivated.
        </li>
        <li>
          That’s why we built <strong>EduHaven</strong>—a platform where
          students can actually <em>grow together</em>. With private study rooms
          for friends, collaborative notes, meaningful discussions, progress
          analytics, and even leaderboards with gamification, EduHaven makes
          studying both productive and engaging.
        </li>
      </div>
    </div>
  );
}

export default IdeaBehindEduhaven;
