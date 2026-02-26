import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { PropertyFilters, SortOption, ViewMode } from '@/types/property'

interface PropertyState {
  filters:     PropertyFilters
  searchQuery: string
  sortBy:      SortOption
  viewMode:    ViewMode
  compareList: string[]
}

interface PropertyActions {
  setFilters:      (filters: Partial<PropertyFilters>) => void
  resetFilters:    () => void
  setSearchQuery:  (query: string) => void
  setSortBy:       (sort: SortOption) => void
  setViewMode:     (mode: ViewMode) => void
  addToCompare:    (id: string) => void
  removeFromCompare: (id: string) => void
  clearCompare:    () => void
}

const defaultFilters: PropertyFilters = {}

export const usePropertyStore = create<PropertyState & PropertyActions>()(
  immer((set) => ({
    filters:     defaultFilters,
    searchQuery: '',
    sortBy:      'newest',
    viewMode:    'grid',
    compareList: [],

    setFilters:     (filters) => set((s) => { Object.assign(s.filters, filters) }),
    resetFilters:   ()        => set((s) => { s.filters = defaultFilters }),
    setSearchQuery: (query)   => set((s) => { s.searchQuery = query }),
    setSortBy:      (sort)    => set((s) => { s.sortBy = sort }),
    setViewMode:    (mode)    => set((s) => { s.viewMode = mode }),
    addToCompare:   (id) => set((s) => {
      if (s.compareList.length < 4 && !s.compareList.includes(id)) s.compareList.push(id)
    }),
    removeFromCompare: (id) => set((s) => {
      s.compareList = s.compareList.filter((i) => i !== id)
    }),
    clearCompare: () => set((s) => { s.compareList = [] }),
  }))
)
