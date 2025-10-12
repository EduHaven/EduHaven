import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Search, User, Link, Copy, Shield, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";

const SharePopup = ({ note, onClose, onShare }) => {
  const [visibility, setVisibility] = useState(note?.visibility || "private");
  const [shareLink, setShareLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accessLevel, setAccessLevel] = useState("view");
  const [loading, setLoading] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [collaborators, setCollaborators] = useState(note?.collaborators || []);

  /* 🩵 NEW: Fetch collaborators from backend when popup mounts */
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await axiosInstance.get(`/note/${note._id}`);
        if (response.data?.collaborators) {
          setCollaborators(response.data.collaborators);
        }
      } catch (error) {
        console.error("Failed to fetch collaborators:", error);
        toast.error("Failed to fetch collaborators");
      }
    };
    fetchCollaborators();
  }, [note._id]);
  /* ------------------------------ */

  const generateShareLink = async () => {
    setGeneratingLink(true);
    try {
      const response = await axiosInstance.post(`/note/${note._id}/generate-share-link`);
      const { shareLink } = response.data;
      setShareLink(shareLink);
      toast.success("Share link generated!");
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error(error.response?.data?.error || "Failed to generate share link");
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/user/find-user?search=${encodeURIComponent(query)}`);
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (visibility === "public" && !shareLink) {
      generateShareLink();
    }
  }, [visibility]);

  const handleVisibilityChange = async (newVisibility) => {
    setVisibility(newVisibility);
    try {
      await axiosInstance.put(`/note/${note._id}`, { visibility: newVisibility });
      if (newVisibility === "public" && !shareLink) {
        await generateShareLink();
      }
    } catch (error) {
      console.error("Error updating note visibility:", error);
      toast.error(error.response?.data?.error || "Failed to update note visibility");
    }
  };

  const handleAddCollaborator = async () => {
    if (!selectedUser) return;
    try {
      await onShare(note._id, selectedUser._id, accessLevel);
      toast.success(
        `Note shared with ${selectedUser.FirstName} ${selectedUser.LastName} (${selectedUser.Username})`
      );
      setCollaborators((prev) => [...prev, { user: selectedUser, access: accessLevel }]);
      setSelectedUser(null);
      setSearchTerm("");
      setUsers([]);
    } catch (error) {
      console.error("Error sharing note:", error);
      toast.error(error.message || "Failed to share note");
    }
  };

  const handleDeleteCollaborator = async (collaborator) => {
    try {
      await axiosInstance.delete(`/note/${note._id}/collaborators/${collaborator._id}`);
      setCollaborators((prev) =>
        prev.filter((c) => c.user._id !== collaborator.user._id)
      );
      toast.success("Collaborator removed successfully");
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast.error(error.response?.data?.error || "Failed to remove collaborator");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[var(--bg-primary)] rounded-lg p-6 w-96 max-w-[90vw] shadow-xl border border-[var(--bg-ter)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[var(--txt)]">
            Share "{note?.title}"
          </h3>
          <Button
            variant="transparent"
            size="icon"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--bg-ter)]"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          {/* ---- Add People Section ---- */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-[var(--txt)]">Add people</h4>

            <div className="relative mb-3">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--bg-ter)] bg-[var(--bg-secondary)] text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)]"
              />
            </div>

            {loading && (
              <div className="text-center py-2 rounded text-[var(--txt-dim)] bg-[var(--bg-ter)] text-sm">
                Searching users...
              </div>
            )}

            {!loading && users.length > 0 && (
              <div className="max-h-32 overflow-y-auto border border-[var(--bg-ter)] rounded-lg mb-3">
                {users.map((user, index) => (
                  <div
                    key={user._id || index}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedUser?._id === user._id
                        ? "bg-[var(--btn)]/20"
                        : "hover:bg-[var(--bg-ter)]"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--btn)] flex items-center justify-center">
                        <User size={16} className="text-[var(--btn-txt)]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[var(--txt)] text-sm">
                          {user.FirstName + " " + user.LastName || user.Username || "Unknown User"}
                        </div>
                        <div className="text-xs text-[var(--txt-dim)]">{user.Email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchTerm && users.length === 0 && (
              <div className="text-center py-2 rounded text-[var(--txt-dim)] bg-[var(--bg-ter)] text-sm mb-3">
                No users found for "{searchTerm}"
              </div>
            )}

            {selectedUser && (
              <div className="flex gap-2 items-center">
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-[var(--bg-ter)] bg-[var(--bg-secondary)] text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] text-sm"
                >
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                </select>
                <Button onClick={handleAddCollaborator} className="text-sm">
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* ---- People with Access ---- */}
          {collaborators && collaborators.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-[var(--txt)]">
                People with access
              </h4>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-ter)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--btn)] flex items-center justify-center">
                        <User size={16} className="text-[var(--btn-txt)]" />
                      </div>
                      <div className="text-[var(--txt)] text-sm">
                        {collaborator.user.FirstName + " " + collaborator.user.LastName}
                      </div>
                      <div className="text-xs text-[var(--txt-dim)]">
                        {collaborator.user.Email} • {collaborator.access}
                      </div>
                    </div>
                    <Button
                      variant="transparent"
                      size="icon"
                      onClick={() => handleDeleteCollaborator(collaborator)}
                      className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--txt-dim)] hover:text-[var(--txt)]"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- Visibility Section ---- */}
          <div className="border-t border-[var(--bg-ter)] pt-4">
            <h4 className="text-sm font-medium mb-3 text-[var(--txt)]">General access</h4>
            <div className="space-y-2">
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  visibility === "private"
                    ? "border-[var(--btn)] bg-[var(--btn)]/10"
                    : "border-[var(--bg-ter)] hover:border-[var(--btn)]/50"
                }`}
                onClick={() => handleVisibilityChange("private")}
              >
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[var(--btn)]" />
                  <div className="flex-1">
                    <div className="font-medium text-[var(--txt)]">Private</div>
                    <div className="text-xs text-[var(--txt-dim)]">
                      Only people with access can open with the link
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  visibility === "public"
                    ? "border-[var(--btn)] bg-[var(--btn)]/10"
                    : "border-[var(--bg-ter)] hover:border-[var(--btn)]/50"
                }`}
                onClick={() => handleVisibilityChange("public")}
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[var(--btn)]" />
                  <div className="flex-1">
                    <div className="font-medium text-[var(--txt)]">Public on the web</div>
                    <div className="text-xs text-[var(--txt-dim)]">
                      Anyone on the internet can find and view
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {visibility === "public" && shareLink && (
              <div className="mt-4 p-3 rounded-lg bg-[var(--bg-ter)] border border-[var(--bg-secondary)]">
                <div className="flex items-center gap-2 mb-2">
                  <Link size={16} className="text-[var(--txt-dim)]" />
                  <span className="text-sm font-medium text-[var(--txt)]">Shareable Link</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 text-xs p-2 rounded border border-[var(--bg-secondary)] bg-[var(--bg-primary)] text-[var(--txt)]"
                  />
                  <Button onClick={copyToClipboard} size="sm" variant="secondary" className="flex items-center gap-1">
                    <Copy size={14} />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-[var(--txt-dim)] mt-2">
                  Anyone with this link can view this note
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="secondary">
              Done
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SharePopup;
