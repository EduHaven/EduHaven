import Calender from "@/components/home/calenderComponent/CalendarComponent.jsx";
import TimerComponent from "@/components/home/timerComponent/TimerComponent.jsx";
import StudyStats from "@/components/home/timerComponent/TimerStats";
import NotesComponent from "@/components/home/goalsAndNotes/NotesComponent.jsx";
import GoalsComponent from "@/components/home/goalsAndNotes/GoalsComponent.jsx";
import NavBar from "@/components/home/navBar/NavBar";
import PinnedRooms from "@/components/home/PinnedRooms";

function StudyRoom() {
  return (
    <>
      <style>
        {`
          @media (max-width: 1280px) {
            .notes-goals-grid {
              grid-template-columns: repeat(1, 1fr);
            }
          }
          @media (max-width: 768px) {
            .timer-stats-container {
              flex-direction: column;
            }
            .main-grid {
              flex-direction: column;
            }
          }
          @media (max-width: 640px) {
            .home-container {
              margin: 0.5rem;
              gap: 0.75rem;
            }
            .timer-stats-container {
              padding: 0.75rem;
            }
          }
          @media (max-width: 480px) {
            .home-container {
              margin: 0.25rem;
              gap: 0.5rem;
            }
          }
          @media (min-width: 475px) {
            .xs\\:flex-row {
              flex-direction: row;
            }
            .xs\\:items-center {
              align-items: center;
            }
            .xs\\:gap-0 {
              gap: 0;
            }
          }
        `}
      </style>
      <div className="home-container m-2 sm:m-3 lg:m-4 2xl:m-6 space-y-3 sm:space-y-4 lg:space-y-6">
        <NavBar />
        <div className="main-grid flex gap-2 sm:gap-3 lg:gap-4 2xl:gap-6 w-full h-auto flex-col xl:flex-row z-0">
          <div className="flex-1 h-100 flex flex-col gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">
            <div className="flex flex-col md:flex-row bg-sec rounded-2xl sm:rounded-3xl shadow timer-stats-container">
              <TimerComponent />
              <StudyStats />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 2xl:gap-6 flex-1 notes-goals-grid">
              <NotesComponent />
              <GoalsComponent />
            </div>
          </div>
          <div className="xl:w-80 2xl:w-96">
            <Calender />
          </div>
        </div>
        <PinnedRooms />
      </div>
    </>
  );
}

export default StudyRoom;
