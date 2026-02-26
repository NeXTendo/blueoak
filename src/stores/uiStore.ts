import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type ModalKey = 'contactSeller' | 'share' | 'report' | 'filters' | 'reservation' | 'pwaInstall' | 'compare'

interface UIState {
  modals: Record<ModalKey, boolean>
  modalData: Record<string, unknown>
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
}

interface UIActions {
  openModal:       (key: ModalKey, data?: unknown) => void
  closeModal:      (key: ModalKey) => void
  toggleSidebar:   () => void
  setTheme:        (theme: UIState['theme']) => void
}

const defaultModals = {} as Record<ModalKey, boolean>

export const useUIStore = create<UIState & UIActions>()(
  immer((set) => ({
    modals:           defaultModals,
    modalData:        {},
    sidebarCollapsed: false,
    theme:            'system',

    openModal:  (key, data) => set((s) => { s.modals[key] = true; if (data) s.modalData[key] = data }),
    closeModal: (key)       => set((s) => { s.modals[key] = false; delete s.modalData[key] }),
    toggleSidebar: () => set((s) => { s.sidebarCollapsed = !s.sidebarCollapsed }),
    setTheme:   (theme)     => set((s) => { s.theme = theme }),
  }))
)
