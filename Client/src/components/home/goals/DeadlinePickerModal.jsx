import { useState } from "react";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";

const DeadlinePickerModal = ({
  isOpen,
  onClose,
  onSave,
  currentDeadline,
  todoTitle,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    currentDeadline ? new Date(currentDeadline) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState("21:00");

  if (!isOpen) return null;

  const handleSave = () => {
    // Combine date and time
    const deadline = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    deadline.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    onSave(deadline);
    onClose();
  };

  const handleRemoveDeadline = () => {
    onSave(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-sec rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Set Deadline
          </h3>
          <Button
            onClick={onClose}
            variant="transparent"
            size="icon"
            className="txt-dim hover:txt transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Todo Title */}
        <div className="mb-4 p-3 bg-ter rounded-lg">
          <p className="txt-dim text-sm">Setting deadline for:</p>
          <p className="font-medium">{todoTitle}</p>
        </div>

        {/* Calendar */}
        <div className="mb-4 flex justify-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            next2Label={null}
            prev2Label={null}
            className="bg-ter rounded-lg"
          />
        </div>

        {/* Time Picker */}
        <div className="mb-6">
          <label
            htmlFor="timeSelect"
            className=" font-semibold mb-2 flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Time:
          </label>
          <select
            className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, "0");
              return [`${hour}:00`, `${hour}:30`];
            })
              .flat()
              .map((time) => (
                <option key={time} value={time} className="txt bg-sec">
                  {time}
                </option>
              ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleRemoveDeadline}
            variant="secondary"
            size="default"
            className="flex-1 px-4 py-2 rounded-lg txt-dim hover:bg-ter"
          >
            Remove Deadline
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
            size="default"
            className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
          >
            Set Deadline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeadlinePickerModal;
