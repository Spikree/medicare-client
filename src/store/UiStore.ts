import { create } from "zustand";

interface UiState {
  isAddHealthInfoModalOpen: boolean;
}

interface UiActions {
  toggleAddHealthInfoModal: () => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  isAddHealthInfoModalOpen: false,

  toggleAddHealthInfoModal: () =>
    set((state) => ({
      isAddHealthInfoModalOpen: !state.isAddHealthInfoModalOpen,
    })),
}));
