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
import PopupContainer from "../ui/Popup";

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
      const result = await generateShareLinkMutate(note._id);
      if (result?.shareLink) {
        setShareLink(result.shareLink);
      }
    } catch (error) {
      console.error("Error generating share link:", error);
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
      const response = await axiosInstance.get(`/user/find-user?search=${encodeURIComponent(query)}`);
      setUsers(response.data?.users || []);
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
      await axiosInstance.put(`/note/${note._id}`, { visibility: newVisibility });
      if (newVisibility === "public" && !shareLink) {
        handleGenerateShareLink();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update note visibility");
    }
  };

  const handleAddCollaborator = async () => {
    if (!selectedUser) return;
    try {
      await onShare(note._id, selectedUser._id, accessLevel);
      toast.success(`Note shared with ${selectedUser.FirstName} ${selectedUser.LastName}`);
      setCollaborators((prev) => [...prev, { user: selectedUser, access: accessLevel }]);
      setSelectedUser(null);
      setSearchTerm("");
      setUsers([]);
    } catch (error) {
      toast.error(error.message || "Failed to share note");
    }
  };

  const handleDeleteCollaborator = async (collaborator) => {
    try {
      await removeCollaboratorMutate({
        noteId: note._id,
        collaboratorId: collaborator.user._id
      });
      setCollaborators((prev) =>
        prev.filter((c) => c.user._id !== collaborator.user._id)
      );
      toast.success("Collaborator removed");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove collaborator");
    }
  };

  return (
    <PopupContainer title={`Share ${note?.title}`} onClose={onClose}>
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
                      <div>
                        <div className="text-sm text-[var(--txt)]">{user.FirstName + " " + user.LastName}</div>
                        <div className="text-xs text-[var(--txt-dim)]">{user.Email}</div>
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
                <Button onClick={handleAddCollaborator} className="text-sm">Add</Button>
              </div>
            )}
          </div>

          {/* Visibility */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-[var(--txt)]">Visibility</h4>
            <div className="flex gap-2">
              <button
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
                <Globe size={16} /> Public
              </button>
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
            <Button onClick={onClose} variant="secondary">Done</Button>
          </div>
        </div>

    </PopupContainer>
  );
};

export default SharePopup;
