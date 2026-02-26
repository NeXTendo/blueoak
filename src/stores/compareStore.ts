import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface CompareItem {
  id: string
  title: string
  cover_image_url: string | null
  asking_price: number
  currency: string
  slug: string
}

interface CompareState {
  compareList: CompareItem[]
  addToCompare:      (item: CompareItem) => boolean   // returns false if full
  removeFromCompare: (id: string) => void
  clearCompare:      () => void
  isInCompare:       (id: string) => boolean
}

export const useCompareStore = create<CompareState>()(
  immer((set, get) => ({
    compareList: [],

    addToCompare: (item) => {
      if (get().compareList.length >= 4) return false
      if (get().compareList.some((x) => x.id === item.id)) return true
      set((s) => { s.compareList.push(item) })
      return true
    },
    removeFromCompare: (id) => set((s) => {
      s.compareList = s.compareList.filter((x) => x.id !== id)
    }),
    clearCompare: () => set((s) => { s.compareList = [] }),
    isInCompare:  (id) => get().compareList.some((x) => x.id === id),
  }))
)
