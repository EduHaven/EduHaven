import { AnimatePresence, motion } from "framer-motion";

const CalendarDayTooltip = ({
  date,
  events,
  position,
  onMouseEnter,
  onMouseLeave,
}) => {
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
    <AnimatePresence>
      {date && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 p-4 rounded-lg"
          style={{
            top: position.top,
            left: position.left,
            width: "max-content",
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className=" max-h-[200px] max-w-[225px] relative bg-sec rounded-3xl pl-5 pr-2 py-5 border border-[var(--bg-ter)]">
            <h3 className="font-bold mb-4">Events on {date}</h3>
            <div className="overflow-y-scroll max-h-[120px] pr-2">
              <motion.ul className="txt space-y-6 pl-2 pr-3 overflow-x-scroll max-h-[120px]">
                {events.map((event) => {
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendarDayTooltip;
