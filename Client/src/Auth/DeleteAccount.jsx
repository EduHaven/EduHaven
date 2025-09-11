import axiosInstance from "@/utils/axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Delete = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmText !== "delete my account") {
      toast.error(`Please type exactly "delete my account" to continue`);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.delete("/auth/delete");

      let data = res.data;

      if (res.status !== 200)
        throw new Error(data.error || "Failed to delete account");

      toast.success(data.message || "Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmText("");
  };

  return (
    <div className="flex items-center justify-center relative bg-cover bg-center">
      {/* Card Container */}
      <motion.div
        className="w-full max-w-lg  rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
          Delete Your Account
        </h1>

        <p className="text-center text-black/90 mb-8 font-semibold text-lg">
          ⚠️ This action is permanent and cannot be undone.
        </p>

        <div className="bg-white/10 backdrop-blur-3xl rounded-xl p-6 text-black mb-6">
          <h3 className="font-semibold mb-3">What will happen:</h3>
          <ul className="space-y-2 text-sm">
            <li>• All your personal data will be permanently erased</li>
            <li>• Your profile, posts, and messages will be deleted</li>
            <li>• You will lose access to all premium features</li>
            <li>• This change cannot be reverted</li>
          </ul>
        </div>

        <p className="text-sm text-center text-black/80 mb-6">
          If you are facing issues, please contact support first before
          deleting.
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 px-6 py-3 rounded-lg font-medium bg-gray-200/70 text-gray-800 hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={handleProceed}
            className="w-1/2 px-6 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md transition-all"
          >
            Proceed to Delete
          </button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-9 max-w-md shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Final Confirmation
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Please type <strong>{"delete my account"}</strong> to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my account"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                         focus:outline-none focus:ring-2 focus:ring-red-500 mb-6 text-black"
                disabled={isLoading}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg font-medium text-black bg-blue-200 hover:bg-blue-300 transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={confirmText !== "delete my account" || isLoading}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Delete;
