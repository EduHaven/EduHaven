import axiosInstance from "@/utils/axios";

// Fetch all note
export const getAllNotes = async () => {
  const { data } = await axiosInstance.get("/note");
  return data.data;
};

// Fetch single note by ID
export const getNoteById = async (id) => {
  const { data } = await axiosInstance.get(`/note/${id}`);
  return data.data;
};

// Create a note
export const createNote = async (noteData) => {
  const { data } = await axiosInstance.post("/note", noteData);
  return data.data;
};

// Update a note
export const updateNote = async ({ id, ...noteData }) => {
  console.log("note data is", noteData);
  const { data } = await axiosInstance.put(`/note/${id}`, noteData);

  return data.data;
};

// Delete a note
export const deleteNote = async (id) => {
  const { data } = await axiosInstance.delete(`/note/${id}`);
  return data.message;
};
