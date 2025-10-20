import { useState } from "react";
import { Clock } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import PopupContainer from "@/components/ui/Popup";

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
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSave = () => {
    // Validate future date
    const now = new Date();
    const deadline = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    deadline.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (deadline <= now) {
      toast.warning("Please select a future date and time");
      return;
    }

    onSave(deadline);
    onClose();
  };

  return (
    <PopupContainer title="Set Deadline" onClose={onClose}>
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
          minDate={new Date()}
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
          onClick={handleSave}
          variant="default"
          size="default"
          className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
        >
          Set Deadline
        </Button>
      </div>
    </PopupContainer>
  );
};

export default DeadlinePickerModal;