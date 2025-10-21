import {
  archiveNote,
  createNote,
  deleteNote,
  getAllArchivedNotes,
  getAllNotes,
  getAllTrashedNotes,
  getNoteById,
  restoreTrashedNote,
  trashNote,
  updateNote,
  removeCollaborator,
  generateShareLink,
} from "@/api/NoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const handleError = (error, defaultMsg) => {
  if (error?.response?.status === 403) {
    toast.error(
      "Unauthorized: You do not have permission to perform this action."
    );
  } else {
    toast.error(`${defaultMsg}: ${error.message}`);
  }
};

export const useNotes = () =>
  useQuery({
    queryKey: ["notes"],
    queryFn: getAllNotes,
  });

export const useNote = (id) =>
  useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });

export const useArchivedNotes = () =>
  useQuery({
    queryKey: ["archivedNotes"],
    queryFn: getAllArchivedNotes,
  });

export const useTrashedNotes = () =>
  useQuery({
    queryKey: ["trashedNotes"],
    queryFn: getAllTrashedNotes,
  });

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.setQueryData(["notes"], (old = []) => [...old, newNote]);
    },
    onError: (error) => handleError(error, "Failed to create note"),
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["notes"], (old = []) =>
        old.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
      queryClient.setQueryData(["archivedNotes"], (old = []) =>
        old.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
      queryClient.setQueryData(["notes", updatedNote._id], updatedNote);
    },
    onError: (error) => handleError(error, "Failed to update note"),
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notes"], (old = []) =>
        old.filter((note) => note._id !== id)
      );
      queryClient.setQueryData(["archivedNotes"], (old = []) =>
        old.filter((note) => note._id !== id)
      );
      queryClient.setQueryData(["trashedNotes"], (old = []) =>
        old.filter((note) => note._id !== id)
      );
    },
    onError: (error) => handleError(error, "Failed to delete note"),
  });
};

export const useArchiveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveNote,
    onSuccess: (updatedNote) => {
      // Invalidate and refetch both queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["archivedNotes"] });

      // Also update the individual note cache
      queryClient.setQueryData(["notes", updatedNote._id], updatedNote);
    },
    onError: (error) => handleError(error, "Failed to archive/unarchive note"),
  });
};

export const useTrashNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trashNote,
    onSuccess: (trashedNote) => {
      queryClient.setQueryData(["notes"], (old = []) =>
        old.filter((note) => note._id !== trashedNote._id)
      );
      queryClient.setQueryData(["archivedNotes"], (old = []) =>
        old.filter((note) => note._id !== trashedNote._id)
      );
      queryClient.setQueryData(["trashedNotes"], (old = []) => [
        ...old,
        trashedNote,
      ]);
    },
    onError: (error) => handleError(error, "Failed to trash note"),
  });
};

export const useRestoreTrashedNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreTrashedNote,
    onSuccess: (restoredNote) => {
      queryClient.setQueryData(["notes"], (old = []) => [...old, restoredNote]);
      queryClient.setQueryData(["trashedNotes"], (old = []) =>
        old.filter((note) => note._id !== restoredNote._id)
      );
    },
    onError: (error) => handleError(error, "Failed to restore note"),
  });
};

export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCollaborator,
    onSuccess: (_, { noteId, collaboratorId }) => {
      toast.success("Collaborator removed successfully!");
    },
    onError: (error) => handleError(error, "Failed to remove collaborator"),
  });
};

export const useGenerateShareLink = () =>
  useMutation({
    mutationFn: (noteId) => generateShareLink(noteId),
    onSuccess: (data) => {
      toast.success("Share link generated successfully");
    },
    onError: (error) => {
      console.error("Error generating share link:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate share link"
      );
    },
  });
