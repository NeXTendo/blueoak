import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'ZMW' | 'USD' | 'ZAR' | 'KES' | 'BWP' | 'NGN' | 'GHS' | 'EUR' | 'GBP'

interface CurrencyState {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'ZMW', // default strictly to Zambian Kwacha
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'blueoak-currency-storage',
    }
  )
)
