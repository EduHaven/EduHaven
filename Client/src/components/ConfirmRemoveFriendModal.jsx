import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const ConfirmRemoveFriendModal = ({ onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 popup-overlay flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="bg-sec backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
        >
          <h2 className="text-xl text-[var(--txt)] font-semibold mb-2">
            Remove Friend
          </h2>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmRemoveFriendModal;
