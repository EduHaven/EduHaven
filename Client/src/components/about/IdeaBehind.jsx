import { Lightbulb } from "lucide-react";

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
          Back in our student days, we leaned on <strong>Discord</strong> to connect with friends and collaborate. It worked to some extent- but it wasn’t designed for learning. The constant distractions and lack of structure made it hard to stay focused.
        </li>
        <li>
          We also tried other “study platforms”, but most fell flat. They simply matched random people online to silently self-study with cameras on. No real collaboration. No sense of community. Nothing to keep students truly motivated.
        </li>
        <li>
          That’s why we created <strong>EduHaven</strong>- a platform built for students, by students. Here, learning is social, structured, and engaging. From private study rooms with friends, collaborative notes, and meaningful discussions to progress analytics, leaderboards, and gamified motivation, EduHaven transforms studying into something both productive and fun.
        </li>
      </div>
    </div>
  );
}

export default IdeaBehindEduhaven;
