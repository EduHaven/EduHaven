import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useNoteStore = create(
  devtools((set, get) => ({
    // State
    status: 'active', // active, archive, trash
    searchTerm: '',
    selectedNote: null,
    showColorPicker: null,
    sharePopup: {
      isOpen: false,
      note: null,
      shareLink: '',
      searchTerm: '',
      users: [],
      selectedUser: null,
      accessLevel: 'view',
      loading: false,
      generatingLink: false,
    },
    
    // Actions
    setStatus: (status) => set({ status }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setSelectedNote: (selectedNote) => set({ selectedNote }),
    setShowColorPicker: (showColorPicker) => set({ showColorPicker }),
    
    // Share Popup Actions
    openSharePopup: (note) => set({ 
      sharePopup: { 
        ...get().sharePopup, 
        isOpen: true, 
        note: { ...note }, // Create a copy to avoid mutations
        shareLink: '',
        searchTerm: '',
        users: [],
        selectedUser: null,
        accessLevel: 'view',
        loading: false,
        generatingLink: false,
      }
    }),
    
    closeSharePopup: () => set({ 
      sharePopup: { 
        ...get().sharePopup, 
        isOpen: false,
        note: null,
      }
    }),
    
    setSharePopupState: (updates) => set({ 
      sharePopup: { ...get().sharePopup, ...updates } 
    }),
    
    // Reset state when needed
    resetNoteState: () => set({
      status: 'active',
      searchTerm: '',
      selectedNote: null,
      showColorPicker: null,
      sharePopup: {
        isOpen: false,
        note: null,
        shareLink: '',
        searchTerm: '',
        users: [],
        selectedUser: null,
        accessLevel: 'view',
        loading: false,
        generatingLink: false,
      }
    })
  }))
);

export default useNoteStore;