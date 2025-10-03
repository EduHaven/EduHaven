// CreateRoomModal.jsx
import { useState } from "react";
import PopupContainer from "@/components/ui/Popup";
import { Button } from "@/components/ui/button";

function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [cateogery, setcateogery] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() === "" || cateogery === "" || description.trim() === "")
      return;
    onCreate({ name: roomName, description, cateogery, isPrivate });
    setRoomName("");
    setDescription("");
    setcateogery("");
    setIsPrivate(false);
    onClose();
  };

  const categories = [
    { value: "", label: "Select a cateogery" },
    { value: "study-room", label: "study-room" },
    { value: "general", label: "General" },
    { value: "Tech", label: "Tech" },
    { value: "Science", label: "Science" },
    { value: "Language-learning", label: "Language-learning" },
    { value: "Professional", label: " Professional" },
    { value: "Career-development", label: "Career-development" },
    { value: "Industry-Deep-dives", label: "Industry Deep-dives" },
    { value: "Entrepreneurship/startup", label: "Entrepreneurship/startup" },
    { value: "marketing", label: "Marketing" },
    { value: "Side-Hustles", label: "Side-Hustles" },
    { value: "Freelancing", label: "Freelancing" },
    { value: "Hobbies", label: "Hobbies" },
    { value: "fitness", label: "fitness" },
    { value: "Art/design", label: "Art/Design" },
  ];

  return (
    <>
      {isOpen && (
        <PopupContainer title="Create a New Room" onClose={onClose}>
          <form onSubmit={handleSubmit}>
            {/* Room Name */}
            <label htmlFor="room-name" className="block mb-2 font-medium txt">
              Room Name
            </label>
            <input
              id="room-name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt placeholder:txt-dim border border-gray-500/50 focus:outline-none"
            />

            {/* Category */}
            <label
              htmlFor="category-select"
              className="block mb-2 font-medium txt"
            >
              Category
            </label>
            <select
              id="category-select"
              value={cateogery}
              onChange={(e) => setcateogery(e.target.value)}
              className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt border border-gray-500/50 focus:outline-none"
            >
              {categories.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.value === ""}
                >
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Description */}
            <label
              htmlFor="room-description"
              className="block mb-2 font-medium txt"
            >
              Room Description
            </label>
            <input
              id="room-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A room for CS students"
              className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt placeholder:txt-dim border border-gray-500/50 focus:outline-none"
            />

            {/* Privacy */}
            <div className="flex items-center gap-3 mb-6">
              <input
                id="private-room"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="private-room" className="font-medium txt">
                Make this room private
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                variant="destructive"
                size="default"
                className="font-medium w-32"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="default"
                className="w-32"
              >
                Create
              </Button>
            </div>
          </form>
        </PopupContainer>
      )}
    </>
  );
}

export default CreateRoomModal;
