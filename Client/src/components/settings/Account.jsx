import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import UpdateButton from "./UpdateButton";

const Account = () => {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // EMAIL UPDATE
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newEmail.includes("@")) {
      toast.error("Please enter a valid email.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setEmailVerificationSent(true);
      toast.success("Verification link sent to new email.");
      setIsLoading(false);
    }, 1000);
  };

  // PASSWORD CHANGE
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword.length < 8 || !/[!@#$%^&*]/.test(newPassword)) {
      toast.error("Password must be at least 8 characters and include a special character.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Password change failed.");
      } else {
        toast.success("Password updated. Email sent.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  // DELETE ACCOUNT
  const handleDelete = () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm deletion.");
      return;
    }

    const confirmed = window.confirm("Are you sure? This action cannot be undone.");
    if (!confirmed) return;

    setIsLoading(true);
    setTimeout(() => {
      toast.warn("Account deleted. You will be logged out.");
      setIsLoading(false);
      // Redirect or reset auth state
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--txt)] mb-6">Account Settings</h1>

      {/* EMAIL UPDATE FORM */}
      <form onSubmit={handleEmailUpdate} className="space-y-4 mb-10">
        <h2 className="text-lg font-semibold text-[var(--txt)]">Update Email</h2>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="New email"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)] placeholder-[var(--txt-dim)]"
          disabled={isLoading}
        />
        <UpdateButton label="Send Verification" isLoading={isLoading} isDisabled={!newEmail} />
        {emailVerificationSent && (
          <p className="text-green-500 text-sm">Verification email sent to {newEmail}</p>
        )}
      </form>

      {/* PASSWORD CHANGE FORM */}
      <form onSubmit={handlePasswordChange} className="space-y-4 mb-10">
        <h2 className="text-lg font-semibold text-[var(--txt)]">Change Password</h2>

        {/* Current Password */}
        <div className="relative">
          <input
            type={showPasswords.current ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)]"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePassword("current")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[var(--txt)]"
          >
            {showPasswords.current ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showPasswords.new ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)]"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePassword("new")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[var(--txt)]"
          >
            {showPasswords.new ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <input
            type={showPasswords.confirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)]"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePassword("confirm")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[var(--txt)]"
          >
            {showPasswords.confirm ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <UpdateButton
          label="Change Password"
          isLoading={isLoading}
          isDisabled={!currentPassword || !newPassword || !confirmPassword}
        />
      </form>

      {/* DELETE ACCOUNT */}
      <div className="mt-8 border-t border-gray-400/40 pt-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h2>
        <div className="relative">
          <input
            type={showPasswords.delete ? "text" : "password"}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter password to confirm"
            className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)] mb-4"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePassword("delete")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[var(--txt)]"
          >
            {showPasswords.delete ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="px-6 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md"
          disabled={isLoading}
        >
          Delete Account
        </button>
        <p className="text-sm text-[var(--txt-dim)] mt-2">
          Your data will be permanently deleted. Recovery available for 30 days.
        </p>
      </div>
    </div>
  );
};

export default Account;
