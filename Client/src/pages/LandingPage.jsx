import NavBar from "@/components/landingPage/NavBar.jsx";
import HeroSection from "@/components/landingPage/HeroSection";
import StudyRoom from "@/components/landingPage/StudyRoom";
import MakeFriends from "@/components/landingPage/MakeFriends";
import GoalsAndEvents from "@/components/landingPage/GoalsAndEvents";
import CTASection from "@/components/landingPage/CTASection";
import Footer from "@/components/landingPage/Footer";

const EduHavenLanding = () => {
  return (
    <div
      className="transition-all duration-300 overflow-x-hidden w-[calc(100vw-80px)]"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--txt)" }}
    >
      <NavBar />
      <HeroSection />
      <StudyRoom />
      <MakeFriends />
      <GoalsAndEvents />
      <CTASection />
      <Footer />
    </div>
  );
};

export default EduHavenLanding;
