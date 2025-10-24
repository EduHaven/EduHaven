import { fetchUserDetails } from "@/api/userApi";
import { create } from "zustand";

export const useNoteStore = create((set, get) => ({
  // State
  status: "active", // active, archive, trash
  searchTerm: "",
  selectedNote: null,
  showColorPicker: null,
  owners: {},
  collaborators: {},

  // Actions
  setStatus: (status) => set({ status }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedNote: (selectedNote) => set({ selectedNote }),
  setShowColorPicker: (showColorPicker) => set({ showColorPicker }),

  setOwner: async (userId) => {
    const data = await fetchUserDetails(userId);
    set((state) => ({ owners: { ...state.owners, [userId]: data } }));
  },

  setCollaborators: async (note) => {
    if (!note?.collaborators?.length) return;
    const data = await Promise.all(
      note.collaborators.map(async (collab) => {
        const res = await fetchUserDetails(collab.user._id);
        return res;
      })
    );
    set((state) => ({
      collaborators: { ...state.collaborators, [note._id]: data },
    }));
  },

  // Note actions
  updateNote: (id, updates) => {
    const { selectedNote } = get();
    if (selectedNote && selectedNote._id === id) {
      set({ selectedNote: { ...selectedNote, ...updates } });
    }
    return { id, updates };
  },

  togglePin: (id, pinnedAt) => {
    const { selectedNote } = get();
    if (selectedNote && selectedNote._id === id) {
      set({ selectedNote: { ...selectedNote, pinnedAt: !pinnedAt } });
    }
    return { id, updates: { pinnedAt: !pinnedAt } };
  },

  changeColor: (id, color) => {
    const { selectedNote } = get();
    if (selectedNote && selectedNote._id === id) {
      set({ selectedNote: { ...selectedNote, color } });
    }
    set({ showColorPicker: null });
    return { id, updates: { color } };
  },
}));
