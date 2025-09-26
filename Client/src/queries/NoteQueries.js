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
} from "@/api/NoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
      queryClient.setQueryData(["archivedNotes"], (old = []) => [
        ...old,
        newNote,
      ]);
    },
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
  });
};

export const useArchiveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveNote,
    onSuccess: (updatedNote) => {
      if (updatedNote.status === "archived") {
        queryClient.setQueryData(["notes"], (old = []) =>
          old.filter((note) => note._id !== updatedNote._id)
        );
        queryClient.setQueryData(["archivedNotes"], (old = []) => [
          ...old,
          updatedNote,
        ]);
      } else if (updatedNote.status === "active") {
        queryClient.setQueryData(["archivedNotes"], (old = []) =>
          old.filter((note) => note._id !== updatedNote._id)
        );
        queryClient.setQueryData(["notes"], (old = []) => [
          ...old,
          updatedNote,
        ]);
      }

      queryClient.setQueryData(["notes", updatedNote._id], updatedNote);
    },
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
  });
};
