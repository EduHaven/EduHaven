import Calender from "@/components/home/calenderComponent/CalendarComponent.jsx";
import TimerComponent from "@/components/home/timerComponent/TimerComponent.jsx";
import StudyStats from "@/components/home/timerComponent/TimerStats";
import NotesComponent from "@/components/home/notes/NotesComponent.jsx";
import GoalsComponent from "@/components/home/goals/GoalsComponent.jsx";
import NavBar from "@/components/home/navBar/NavBar";
import PinnedRooms from "@/components/home/PinnedRooms";
import LandingPage from "./LandingPage";

function StudyRoom() {
  const token = localStorage.getItem("token");

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
              <StudyStats />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 2xl:gap-6 flex-1 notes-goals-grid">
              <NotesComponent />
              <GoalsComponent />
            </div>
          </div>
          <Calender />
        </div>
        <PinnedRooms />
      </div>
    </>
  );
}

export default StudyRoom;
