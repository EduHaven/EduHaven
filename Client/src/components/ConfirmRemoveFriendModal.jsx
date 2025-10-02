import PopupContainer from "@/components/ui/Popup";
import { Button } from "@/components/ui/button";

const ConfirmRemoveFriendModal = ({ onConfirm, onCancel }) => {
  return (
    <PopupContainer title="Remove Friend" onClose={onCancel}>
      <p className="mb-6 text-[var(--txt-dim)] dark:text-gray-300">
        Are you sure you want to remove this friend?
      </p>
      <div className="flex justify-evenly gap-4">
        <Button
          onClick={onConfirm}
          variant="destructive"
          className="font-medium w-32"
        >
          Yes, Remove
        </Button>
        <Button
          onClick={onCancel}
          variant="secondary"
          className="font-medium w-32"
        >
          Cancel
        </Button>
      </div>
    </PopupContainer>
  );
};

export default ConfirmRemoveFriendModal;
