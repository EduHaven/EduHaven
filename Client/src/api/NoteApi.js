import axiosInstance from "@/utils/axios";

export const getAllNotes = async () => {
  const { data } = await axiosInstance.get("/note");
  return data.data;
};

export const getNoteById = async (id) => {
  const { data } = await axiosInstance.get(`/note/${id}`);
  return data.data;
};

export const createNote = async (noteData) => {
  const { data } = await axiosInstance.post("/note", noteData);
  return data.data;
};

export const updateNote = async ({ id, ...noteData }) => {
  const { data } = await axiosInstance.put(`/note/${id}`, noteData);
  return data.data;
};

export const deleteNote = async (id) => {
  const { data } = await axiosInstance.delete(`/note/${id}`);
  return data.message;
};

export const getAllArchivedNotes = async () => {
  const { data } = await axiosInstance.get("/note/archive");
  return data.data;
};

export const archiveNote = async (id) => {
  const { data } = await axiosInstance.post(`/note/archive/${id}`);
  return data.data;
};

export const getAllTrashedNotes = async () => {
  const { data } = await axiosInstance.get("/note/trash");
  return data.data;
};

export const trashNote = async (id) => {
  const { data } = await axiosInstance.post(`/note/trash/${id}`);
  return data.data;
};

export const restoreTrashedNote = async (id) => {
  const { data } = await axiosInstance.post(`/note/restore/${id}`);
  return data.data;
};

export const addCollaborator = async (noteId, collaboratorData) => {
  const { data } = await axiosInstance.post(`/note/${noteId}/collaborators`, collaboratorData);
  return data.data;
};

export const removeCollaborator = async (noteId, collaboratorId) => {
  const { data } = await axiosInstance.delete(`/note/${noteId}/collaborators/${collaboratorId}`);
  return data.data;
};

export const generateShareLink = async (noteId) => {
  const { data } = await axiosInstance.post(`/note/${noteId}/generate-share-link`);
  return data;
}