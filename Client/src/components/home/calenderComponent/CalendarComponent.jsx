import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventPopup from "./eventPopup";
import { motion } from "framer-motion";
const backendUrl = import.meta.env.VITE_API_URL;

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysArray = [...Array(daysInMonth).keys()].map((day) => day + 1);
  const [selectedDay, setSelectedDay] = useState(null);
  // (Assuming selectedEvent is handled in EventPopup or elsewhere)
  const [time, setTime] = useState(new Date());
  const [, setSelectedEvent] = useState(null);

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/events`);
      if (response.data.success) {
        setEvents(response.data.data);

        // Process upcoming events
        const today = new Date();
        const futureEvents = response.data.data.filter(
          (event) => new Date(event.date) >= today
        );
        futureEvents.sort(
          (a, b) => new Date(a.date) - new Date(b.date) // Sort by date
        );
        setUpcomingEvents(futureEvents.slice(0, 2)); // Limit to two events
      } else {
        console.error("Failed to fetch events:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDayClick = (day) => {
    const date = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const event = events.find((e) => e.date === date);
    setSelectedDay(date);
    // Assuming selectedEvent is defined elsewhere or in the EventPopup component
    setSelectedEvent(event || { date });
  };

  const handleClosePopup = () => {
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const blankDays = Array(firstDayOfMonth).fill(null);

  const formattedTime = localStorage.getItem("clock-format") === "24-hour"
    ? (time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }))
    : (time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }));

  const [timePart, period] = formattedTime.split(" ");

  return (
    <>
      <div className="bg-sec pt-4 sm:pt-6 w-full xl:w-[25%] xl:min-w-fit rounded-2xl sm:rounded-3xl shadow flex flex-col max-h-[600px] sm:max-h-[700px] lg:max-h-[750px]">
        {/* Header: Time and Day */}
        <div className="px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-thin txt mb-2">
            {timePart} <span className="text-base sm:text-lg lg:text-xl">{period}</span>
          </h1>
          <h2 className="text-sm sm:text-md txt-dim">
            Today&apos;s{" "}
            {
              "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
                " "
              )[currentDate.getDay()]
            }
          </h2>
        </div>
        <hr className="my-3 sm:my-4 opacity-10" />
        {/* Calendar View */}
        <div className="px-3 sm:px-4">
          <div className="flex justify-between items-center mb-4 sm:mb-6 px-1 sm:px-2">
            <h2 className="text-base sm:text-lg font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-1 sm:p-1.5 rounded-full hover:bg-ter"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 sm:p-1.5 rounded-full hover:bg-ter"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[0.2rem] sm:gap-[0.4rem]">
            {"Su Mo Tu We Th Fr Sa".split(" ").map((day) => (
              <div
                key={day}
                className="text-center text-xs font-md txt-dim"
              >
                {day}
              </div>
            ))}
            {blankDays.map((_, index) => (
              <div key={`blank-${index}`} className="p-2 sm:p-3"></div>
            ))}
            {daysArray.map((day) => {
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              const hasEvent = Object.values(events).some((event) => {
                const eventDate = parseISO(event.date);
                return (
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === currentDate.getMonth() &&
                  eventDate.getFullYear() === currentDate.getFullYear()
                );
              });
              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`flex items-center justify-center p-1.5 sm:p-2.5 text-xs sm:text-sm rounded-full txt cursor-pointer transition-all duration-200 ease-in-out h-7 sm:h-9 
                  ${isToday ? "bg-purple-600 hover:bg-purple-700" : ""}
                  ${hasEvent && !isToday ? "bg-ter hover:bg-ter" : ""}
                  ${!isToday && !hasEvent ? "hover:bg-ter" : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Section with subtle animations */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-ter flex-1 mt-4 sm:mt-6 min-h-0 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold txt mb-3 sm:mb-4">
            Upcoming Events:
          </h3>
          <div className="overflow-y-auto max-h-full">
            {upcomingEvents.length > 0 ? (
              <motion.ul
                className="txt space-y-4 sm:space-y-6 pl-1 sm:pl-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <motion.li
                      key={event.id}
                      className="pl-2 sm:pl-3 border-l-2 sm:border-l-4 border-purple-500"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm txt-dim">
                          {eventDate.toLocaleDateString()}
                        </div>
                        <div className="text-xs txt-dim">
                          {eventDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                      <span className="block mt-1 text-sm sm:text-base">{event.title}</span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="txt-dim text-sm"
              >
                No events.
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {selectedDay && (
        <EventPopup
          date={selectedDay}
          onClose={handleClosePopup}
          refreshEvents={fetchEvents}
        />
      )}
    </>
  );
}

export default Calendar;
