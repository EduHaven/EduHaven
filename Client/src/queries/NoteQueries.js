// src/queries/noteQuery.js
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "@/api/NoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch all notes
export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: getAllNotes,
  });
};

// Fetch single note
export const useNote = (id) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNoteById(id),
    enabled: !!id, // only run if id exists
  });
};

// Create note
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    // Optimistic update: insert placeholder at top
    onMutate: async (newNoteInput) => {
      await queryClient.cancelQueries(["notes"]);
      const previous = queryClient.getQueryData(["notes"]);

      // Generate optimistic ID and ensure it appears at the very top
      const optimisticNote = {
        _id: "optimistic-" + Date.now(),
        title: newNoteInput.title,
        content: newNoteInput.content,
        color: newNoteInput.color || "default",
        isPinned: newNoteInput.isPinned || false,
        visibility: newNoteInput.visibility || "private",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add optimistic flag to distinguish from real notes
        __optimistic: true,
      };

      if (previous && previous.length > 0) {
        // Insert at the very beginning (top) of the list
        queryClient.setQueryData(["notes"], [optimisticNote, ...previous]);
      } else {
        queryClient.setQueryData(["notes"], [optimisticNote]);
      }

      return { previous, optimisticNote };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notes"], context.previous);
      }
    },
    onSuccess: (created, _variables, _context) => {
      // Replace optimistic note with real note at the top
      queryClient.setQueryData(["notes"], (current) => {
        if (!current) return [created];

        // Remove any optimistic notes and insert the real note at the top
        const filtered = current.filter(
          (n) => !String(n._id).startsWith("optimistic-")
        );
        return [created, ...filtered];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });
};

// Update note
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNote,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["notes"]);
      queryClient.invalidateQueries(["notes", data._id]);
    },
  });
};

// Delete note
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });
};
