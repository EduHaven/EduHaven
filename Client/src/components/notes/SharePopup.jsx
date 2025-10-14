import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Search,
  User,
  Link,
  Copy,
  Shield,
  Globe,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRemoveCollaborator, useGenerateShareLink } from "@/queries/NoteQueries";
import axiosInstance from "@/utils/axios";

const SharePopup = ({ note, onClose, onShare }) => {
  const [visibility, setVisibility] = useState(note?.visibility || "private");
  const [shareLink, setShareLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accessLevel, setAccessLevel] = useState("view");
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState(note?.collaborators || []);

  const { mutateAsync: generateShareLinkMutate } = useGenerateShareLink();
  const { mutate: removeCollaboratorMutate } = useRemoveCollaborator();

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await axiosInstance.get(`/note/${note._id}`);
        if (response.data.data?.collaborators) {
          setCollaborators(response.data.data.collaborators);
        }
      } catch (error) {
        toast.error("Failed to fetch collaborators");
      }
    };
    fetchCollaborators();
  }, [note._id]);

  const handleGenerateShareLink = async () => {
    try {
<<<<<<< HEAD
      const result = await generateShareLinkMutate(note._id);
      if (result?.shareLink) {
        setShareLink(result.shareLink);
      }
    } catch (error) {
      console.error("Error generating share link:", error);
=======
      const response = await axiosInstance.post(
        `/note/${note._id}/generate-share-link`
      );
      const { shareLink } = response.data;
      setShareLink(shareLink);
      toast.success("Share link generated!");
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error(
        error.response?.data?.error || "Failed to generate share link"
      );
    } finally {
      setGeneratingLink(false);
>>>>>>> main
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
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
<<<<<<< HEAD
      const response = await axiosInstance.get(`/user/find-user?search=${encodeURIComponent(query)}`);
      setUsers(response.data?.users || []);
=======
      const response = await axiosInstance.get(
        `/user/find-user?search=${encodeURIComponent(query)}`
      );
      const data = response.data;

      if (data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
>>>>>>> main
    } catch (error) {
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
      handleGenerateShareLink();
    }
  }, [visibility]);

  const handleVisibilityChange = async (newVisibility) => {
    setVisibility(newVisibility);
    try {
<<<<<<< HEAD
      await axiosInstance.put(`/note/${note._id}`, { visibility: newVisibility });
=======
      await axiosInstance.put(`/note/${note._id}`, {
        visibility: newVisibility,
      });

>>>>>>> main
      if (newVisibility === "public" && !shareLink) {
        handleGenerateShareLink();
      }
    } catch (error) {
<<<<<<< HEAD
      toast.error(error.response?.data?.error || "Failed to update note visibility");
=======
      console.error("Error updating note visibility:", error);
      toast.error(
        error.response?.data?.error || "Failed to update note visibility"
      );
>>>>>>> main
    }
  };

  const handleAddCollaborator = async () => {
    if (!selectedUser) return;
    try {
      await onShare(note._id, selectedUser._id, accessLevel);
<<<<<<< HEAD
      toast.success(`Note shared with ${selectedUser.FirstName} ${selectedUser.LastName}`);
      setCollaborators((prev) => [...prev, { user: selectedUser, access: accessLevel }]);
=======
      toast.success(
        `Note shared successfully with ${selectedUser.FirstName + " " + selectedUser.LastName + "(" + selectedUser.Username + ")"}!`
      );
      setCollaborators((prev) => [
        ...prev,
        { user: selectedUser, access: accessLevel },
      ]);
>>>>>>> main
      setSelectedUser(null);
      setSearchTerm("");
      setUsers([]);
    } catch (error) {
      toast.error(error.message || "Failed to share note");
    }
  };

  const handleDeleteCollaborator = async (collaborator) => {
    try {
<<<<<<< HEAD
      await removeCollaboratorMutate({
        noteId: note._id,
        collaboratorId: collaborator.user._id
      });
=======
      // console.log(collaborators)
      await axiosInstance.delete(
        `/note/${note._id}/collaborators/${collaborator._id}`
      );
>>>>>>> main
      setCollaborators((prev) =>
        prev.filter((c) => c.user._id !== collaborator.user._id)
      );
      toast.success("Collaborator removed");
    } catch (error) {
<<<<<<< HEAD
      toast.error(error.response?.data?.error || "Failed to remove collaborator");
=======
      console.error("Error removing collaborator:", error);
      toast.error(
        error.response?.data?.error || "Failed to remove collaborator"
      );
>>>>>>> main
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-[var(--bg-primary)] rounded-lg p-6 w-96 max-w-[90vw] shadow-xl border border-[var(--bg-ter)]"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[var(--txt)]">Share "{note?.title}"</h3>
          <Button variant="transparent" size="icon" onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-ter)]">
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Add People */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-[var(--txt)]">Add people</h4>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-dim)]" size={16} />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--bg-ter)] bg-[var(--bg-secondary)] text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)]"
              />
            </div>

            {loading && (
              <div className="text-center py-2 text-sm text-[var(--txt-dim)]">Searching users...</div>
            )}

            {!loading && users.length > 0 && (
              <div className="max-h-32 overflow-y-auto border border-[var(--bg-ter)] rounded-lg mb-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`p-3 cursor-pointer transition-colors ${selectedUser?._id === user._id
                      ? "bg-[var(--btn)]/20"
                      : "hover:bg-[var(--bg-ter)]"
                      }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--btn)] flex items-center justify-center">
                        <User size={16} className="text-[var(--btn-txt)]" />
                      </div>
<<<<<<< HEAD
                      <div>
                        <div className="text-sm text-[var(--txt)]">{user.FirstName + " " + user.LastName}</div>
                        <div className="text-xs text-[var(--txt-dim)]">{user.Email}</div>
=======
                      <div className="flex-1">
                        <div className="text-[var(--txt)] text-sm">
                          {user.FirstName + " " + user.LastName ||
                            user.Username ||
                            "Unknown User"}
                        </div>
                        <div className="text-xs text-[var(--txt-dim)]">
                          {user.Email}
                        </div>
>>>>>>> main
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedUser && (
              <div className="flex gap-2 items-center">
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-[var(--bg-ter)] bg-[var(--bg-secondary)] text-[var(--txt)] text-sm"
                >
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                </select>
<<<<<<< HEAD
                <Button onClick={handleAddCollaborator} className="text-sm">Add</Button>
=======
                <Button onClick={handleAddCollaborator} className="text-sm">
                  Add
                </Button>
>>>>>>> main
              </div>
            )}
          </div>

<<<<<<< HEAD
          {/* Visibility */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-[var(--txt)]">Visibility</h4>
            <div className="flex gap-2">
              <button
=======
          {/* Section 2: Current Collaborators */}
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
                        {collaborator.user.FirstName +
                          " " +
                          collaborator.user.LastName}
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

          {/* Section 3: General Access */}
          <div className="border-t border-[var(--bg-ter)] pt-4">
            <h4 className="text-sm font-medium mb-3 text-[var(--txt)]">
              General access
            </h4>

            <div className="space-y-2">
              {/* Private Option */}
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  visibility === "private"
                    ? "border-[var(--btn)] bg-[var(--btn)]/10"
                    : "border-[var(--bg-ter)] hover:border-[var(--btn)]/50"
                }`}
>>>>>>> main
                onClick={() => handleVisibilityChange("private")}
                className={`flex-1 py-2 rounded-full border text-sm font-medium flex items-center justify-center gap-2 transition-all
                  ${visibility === "private"
                    ? "bg-[var(--btn)] text-white"
                    : "border-[var(--bg-ter)] text-[var(--txt-dim)] hover:border-[var(--btn)] hover:text-[var(--txt)]"
                  }`}
              >
                <Shield size={16} /> Private
              </button>
              <button
                onClick={() => handleVisibilityChange("public")}
                className={`flex-1 py-2 rounded-full border text-sm font-medium flex items-center justify-center gap-2 transition-all
                  ${visibility === "public"
                    ? "bg-[var(--btn)] text-white"
                    : "border-[var(--bg-ter)] text-[var(--txt-dim)] hover:border-[var(--btn)] hover:text-[var(--txt)]"
                  }`}
              >
<<<<<<< HEAD
                <Globe size={16} /> Public
              </button>
=======
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[var(--btn)]" />
                  <div className="flex-1">
                    <div className="font-medium text-[var(--txt)]">
                      Public on the web
                    </div>
                    <div className="text-xs text-[var(--txt-dim)]">
                      Anyone on the internet can find and view
                    </div>
                  </div>
                </div>
              </div>
>>>>>>> main
            </div>

            {visibility === "public" && shareLink && (
              <div className="mt-4 p-3 rounded-lg bg-[var(--bg-ter)] border border-[var(--bg-secondary)]">
                <div className="flex items-center gap-2 mb-2">
                  <Link size={16} className="text-[var(--txt-dim)]" />
                  <span className="text-sm font-medium text-[var(--txt)]">
                    Shareable Link
                  </span>
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

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-[var(--txt)]">Collaborators</h4>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.user._id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-secondary)]">
                    <div>
                      <div className="text-sm text-[var(--txt)]">{collaborator.user.FirstName + " " + collaborator.user.LastName}</div>
                      <div className="text-xs text-[var(--txt-dim)]">{collaborator.user.Email} • {collaborator.access}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCollaborator(collaborator)}
                      className="text-[var(--txt-dim)] hover:text-[var(--txt)]"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}


          <div className="flex justify-end pt-2">
<<<<<<< HEAD
            <Button onClick={onClose} variant="secondary">Done</Button>
=======
            <Button onClick={onClose} variant="secondary">
              Done
            </Button>
>>>>>>> main
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SharePopup;
