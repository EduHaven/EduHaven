import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import SharedNoteView from "@/components/notes/SharedNote";
import { toast } from "react-toastify";

const SharedNotePage = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [sharedNote, setSharedNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedNote = async () => {
      if (!shareToken) return;

      try {
        const response = await axiosInstance.get(`/note/shared/${shareToken}`);
        setSharedNote(response.data.data);
      } catch (error) {
        console.error("Error fetching shared note:", error);
        toast.error(
          error.response?.data?.error || "Failed to load shared note"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNote();
  }, [shareToken]);

  const handleClose = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="text-[var(--txt-dim)]">Loading shared note...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SharedNoteView sharedNote={sharedNote} onClose={handleClose} />
    </div>
  );
};

export default SharedNotePage;
