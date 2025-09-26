import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import axiosInstance from "@/utils/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventPopup from "./eventPopup";
import AllEventsPopup from "./AllEventsPopup";
import { motion } from "framer-motion";
import { format } from "date-fns";
import CalendarDayTooltip from "./CalendarDayTooltip";
import { Button } from "@/components/ui/button";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [eventsByDate, setEventsByDate] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [cardPosition, setCardPosition] = useState({
    top: 0,
    left: 0,
  });

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
  const [showAllEvents, setShowAllEvents] = useState(false);
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
      const response = await axiosInstance.get(`/events`);

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
        setUpcomingEvents(futureEvents.slice(0, 10)); // Limit to ten events
      } else {
        console.error("Failed to fetch events:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error.message);
      // Handle unauthorized access
      if (error.response?.status === 401) {
        console.error("Unauthorized: Please log in again");
        // You might want to redirect to login page here
      }
    }
  };

  useEffect(() => {
    const eventsMap = events.reduce((acc, event) => {
      const formattedDateKey = format(parseISO(event.date), "yyyy-MM-dd");
      if (!acc[formattedDateKey]) {
        acc[formattedDateKey] = [];
      }
      acc[formattedDateKey].push(event);
      return acc;
    }, {});
    setEventsByDate(eventsMap);
  }, [events]);

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
    setSelectedEvent(event || { date });
  };

  const handleClosePopup = () => {
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const blankDays = Array(firstDayOfMonth).fill(null);

  const formattedTime =
    localStorage.getItem("clock-format") === "24-hour"
      ? time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      : time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

  const [timePart, period] = formattedTime.split(" ");

  const getFormattedDate = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    return `${year}-${month}-${paddedDay}`;
  };

  const setCalendarDayTooltipPosition = (dayRect, containerRect) => {
    const maxCalendarDayTooltipWidth = 240;
    const maxCalendarDayTooltipHeight = 200;

    // initial centered position below the day
    let left =
      dayRect.left -
      containerRect.left +
      dayRect.width / 2 -
      maxCalendarDayTooltipWidth / 2;
    let top = dayRect.bottom - containerRect.top - 12;

    // clamp horizontally inside container
    if (left < 0) left = 0;
    if (left + maxCalendarDayTooltipWidth > containerRect.width)
      left = containerRect.width - maxCalendarDayTooltipWidth;

    // clamp vertically inside container
    if (top + maxCalendarDayTooltipHeight > containerRect.height)
      top = containerRect.height - maxCalendarDayTooltipHeight;

    setCardPosition({ top, left });
  };

  const convertTo12HourFormat = (timeString) => {
    const [hourString, minutes] = timeString.split(":");

    let hour = parseInt(hourString);

    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) {
      hour = 12; //12 AM
    } else if (hour > 12) {
      hour = hour - 12;
    }

    return `${hour}:${minutes} ${ampm}`;
  };
  return (
    <>
      <div className="bg-sec pt-6 w-[25%] min-w-fit rounded-3xl shadow flex flex-col max-h-[750px] relative calendar-container">
        {/* Header: Time and Day */}
        <div className="px-6">
          <h1 className="text-5xl font-thin txt mb-2">
            {timePart} <span className="text-xl">{period}</span>
          </h1>
          <h2 className="text-md txt-dim">
            Today&apos;s{" "}
            {
              "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
                " "
              )[currentDate.getDay()]
            }
          </h2>
        </div>
        <hr className="my-4 opacity-10" />
        {/* Calendar View */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-3">
              <Button
                onClick={handlePrevMonth}
                variant="transparent"
                size="icon"
                className="p-1.5 rounded-full hover:bg-ter"
              >
                <ChevronLeft />
              </Button>
              <Button
                onClick={handleNextMonth}
                variant="transparent"
                size="icon"
                className="p-1.5 rounded-full hover:bg-ter"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[0.4rem]">
            {"Su Mo Tu We Th Fr Sa".split(" ").map((day) => (
              <div key={day} className="text-center text-xs font-md txt-dim">
                {day}
              </div>
            ))}
            {blankDays.map((_, index) => (
              <div key={`blank-${index}`} className="p-3"></div>
            ))}
            {daysArray.map((day) => {
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              const formattedDate = getFormattedDate(day);

              const dayEvents = eventsByDate[formattedDate] || [];
              const hasEvent = dayEvents.length > 0;

              return (
                <div key={day} className="relative group">
                  <div
                    onClick={() => handleDayClick(day)}
                    className={`calendar-day-cell relative flex items-center justify-center p-2.5 text-sm rounded-full txt cursor-pointer transition-all duration-200 ease-in-out h-9 
                      ${isToday ? "bg-[var(--btn)] text-white" : ""}
                      ${hasEvent && !isToday ? "bg-ter hover:bg-ter" : ""}
                      ${!isToday && !hasEvent ? "hover:bg-ter" : ""}`}
                    onMouseEnter={(e) => {
                      if (hasEvent) {
                        setHoveredDate(formattedDate);

                        const dayRect = e.currentTarget.getBoundingClientRect();
                        const containerRect = e.currentTarget
                          .closest(".calendar-container")
                          .getBoundingClientRect();
                        setCalendarDayTooltipPosition(dayRect, containerRect);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredDate(null);
                    }}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
            {hoveredDate && (
              <CalendarDayTooltip
                className="calendar-tooltip"
                date={hoveredDate}
                events={eventsByDate[hoveredDate] || []}
                position={cardPosition}
                onMouseEnter={() => {
                  const formattedDate = getFormattedDate(
                    new Date(hoveredDate).getDate()
                  );
                  setHoveredDate(formattedDate);
                }}
                onMouseLeave={() => {
                  setHoveredDate(null);
                }}
              />
            )}
          </div>
        </div>
        {/* Upcoming Events Section with subtle animations */}
        <div className="p-6 rounded-3xl bg-ter flex-1 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold txt">Upcoming Events:</h3>
            <Button
              onClick={() => setShowAllEvents(true)}
              variant="link"
              size="default"
              className="text-sm txt-dim flex items-center gap-1 transition-colors hover:txt"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          {upcomingEvents.length > 0 ? (
            <motion.ul
              className="txt space-y-6 pl-2 pr-3 overflow-x-scroll max-h-[120px]"
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
                const eventTime = convertTo12HourFormat(event.time);
                const eventDate = new Date(event.date);
                return (
                  <motion.li
                    key={event._id}
                    className="pl-3 border-l-4 border-[var(--btn)]"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm txt-dim">
                        {eventDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs txt-dim">{eventTime}</div>
                    </div>
                    <span className="block mt-1">{event.title}</span>
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

      {selectedDay && (
        <EventPopup
          date={selectedDay}
          onClose={handleClosePopup}
          refreshEvents={fetchEvents}
        />
      )}

      {showAllEvents && (
        <AllEventsPopup
          events={events}
          onClose={() => setShowAllEvents(false)}
          refreshEvents={fetchEvents}
        />
      )}
    </>
  );
}

export default Calendar;
