import Calender from "@/components/home/calenderComponent/CalendarComponent.jsx";
import TimerComponent from "@/components/home/timerComponent/TimerComponent.jsx";
import StatsSummary from "@/components/home/timerComponent/StatsSummary";
import NotesComponent from "@/components/home/notes/NotesComponent.jsx";
import GoalsComponent from "@/components/home/goals/GoalsComponent.jsx";
import NavBar from "@/components/home/navBar/NavBar";
import PinnedRooms from "@/components/home/PinnedRooms";
import LandingPage from "./LandingPage";
import { useUserProfile } from "../contexts/UserProfileContext.jsx";
import { Link } from "react-router-dom";

function StudyRoom() {
  const { token } = useUserProfile();
  const { isProfileComplete } = useUserProfile();

  if (!token) {
    return <LandingPage />;
  }
  return (
    <>
      <style>
        {`
          @media (max-width: 1200px) {
            .notes-goals-grid {
              grid-template-columns: repeat(1, 1fr);
            }
          }
        `}
      </style>
      <div className="m-3 2xl:m-6 space-y-4">
        <NavBar />
        <div className="flex gap-3 2xl:gap-6 w-full h-auto flex-col [min-width:700px]:flex-col lg:flex-row z-0">
          <div className="flex-1 h-100 flex flex-col gap-4 2xl:gap-6">
            <div className="flex bg-sec rounded-3xl shadow">
              <TimerComponent />
              <StatsSummary />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 2xl:gap-6 flex-1 notes-goals-grid">
              <NotesComponent />
              <GoalsComponent />
            </div>
          </div>
          <Calender />
        </div>
        <PinnedRooms />
        {!isProfileComplete() && (
          <div
            className="bg-[var(--bg-ter)] border-2 border-red-500 text-[var(--txt)] px-6 py-5 rounded-2xl shadow-lg mt-6 text-center"
            style={{ backgroundColor: "rgba(255,0,0,0.08)" }}
          >
            <p className="font-bold text-xl text-red-500 mb-2">
              🚨 Your profile isn’t complete!
            </p>
            <p className="text-sm text-[var(--txt-dim)] mb-3">
              Complete your Basic Info and Education & Skills to earn a badge.
            </p>
            <Link
              to="/settings"
              className="inline-block px-5 py-2 rounded-xl font-semibold
                 bg-gradient-to-r from-red-600 to-pink-600 text-white
                 hover:from-red-500 hover:to-pink-500
                 transition shadow-[0_0_18px_rgba(255,0,0,0.8)]"
            >
              Complete Now →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default StudyRoom;
