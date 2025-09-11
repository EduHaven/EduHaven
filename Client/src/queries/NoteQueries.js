// src/queries/noteQuery.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "@/api/NoteApi";

// Fetch all notes
export const useNotes = () => {
  return useQuery({
    // queryKey: ["notes"],
    queryFn: getAllNotes,
  });
};

// Fetch single note
export const useNote = (id) => {
  return useQuery({
    // queryKey: ["notes", id],
    queryFn: () => getNoteById(id),
    enabled: !!id, // only run if id exists
  });
};

// Create note
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // queryClient.invalidateQueries(["notes"]);
    },
  });
};

// Update note
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNote,
    onSuccess: (data) => {
      // queryClient.invalidateQueries(["notes"]);
      // queryClient.invalidateQueries(["notes", data._id]);
    },
  });
};

// Delete note
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // queryClient.invalidateQueries(["notes"]);
    },
  });
};
