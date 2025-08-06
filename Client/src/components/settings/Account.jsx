import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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

  // EMAIL UPDATE
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newEmail.includes("@")) {
      toast.error("Please enter a valid email.");
      setIsLoading(false);
      return;
    }

    // Simulate API request and email verification
    setTimeout(() => {
      setEmailVerificationSent(true);
      toast.success("Verification link sent to new email.");
      setIsLoading(false);
    }, 1000);
  };

  // PASSWORD CHANGE
  const handlePasswordChange = (e) => {
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

    // Simulate API call
    setTimeout(() => {
      toast.success("Password updated. Email sent.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    }, 1000);
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
      // Simulate logout
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
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)]"
          disabled={isLoading}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)]"
          disabled={isLoading}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)]"
          disabled={isLoading}
        />
        <UpdateButton
          label="Change Password"
          isLoading={isLoading}
          isDisabled={!currentPassword || !newPassword || !confirmPassword}
        />
      </form>

      {/* DELETE ACCOUNT */}
      <div className="mt-8 border-t border-gray-400/40 pt-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h2>
        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          placeholder="Enter password to confirm"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-sec)] text-[var(--txt)] mb-4"
          disabled={isLoading}
        />
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
