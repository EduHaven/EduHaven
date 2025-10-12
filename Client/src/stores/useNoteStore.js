import { create } from 'zustand';

export const useNoteStore = create((set, get) => ({
  // State
  status: 'active', // active, archive, trash
  searchTerm: '',
  selectedNote: null,
  showColorPicker: null,
  
  // Actions
  setStatus: (status) => set({ status }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedNote: (selectedNote) => set({ selectedNote }),
  setShowColorPicker: (showColorPicker) => set({ showColorPicker }),
  
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