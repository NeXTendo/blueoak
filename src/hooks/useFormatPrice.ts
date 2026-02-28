import { useCurrencyStore, CurrencyCode } from '@/stores/currencyStore'
import type { Property } from '@/types/property'

export function useFormatPrice() {
  const globalCurrency = useCurrencyStore((s) => s.currency)

  const format = (property: Partial<Property>, isNightly = false) => {
    let value = 0
    let symbol = ''
    let activeCurrency = globalCurrency

    // Helper to get currency symbol
    const getSymbol = (c: string) => {
      switch (c) {
        case 'ZMW': return 'ZK'
        case 'USD': return '$'
        case 'ZAR': return 'R'
        case 'KES': return 'KSh'
        case 'BWP': return 'P'
        case 'NGN': return '₦'
        case 'GHS': return 'GH₵'
        case 'EUR': return '€'
        case 'GBP': return '£'
        default: return c
      }
    }

    // Determine value based on global currency
    switch (globalCurrency) {
      case 'ZMW': value = property.price_zmw || 0; break;
      case 'USD': value = property.price_usd || 0; break;
      case 'ZAR': value = property.price_zar || 0; break;
      case 'KES': value = property.price_kes || 0; break;
      case 'BWP': value = property.price_bwp || 0; break;
      case 'NGN': value = property.price_ngn || 0; break;
      case 'GHS': value = property.price_ghs || 0; break;
      case 'EUR': value = property.price_eur || 0; break;
      case 'GBP': value = property.price_gbp || 0; break;
    }

    // If the explicit price doesn't exist for the selected global currency,
    // fallback to the original listing currency and asking_price.
    if (!value && property.asking_price) {
      value = property.asking_price
      activeCurrency = (property.currency as CurrencyCode) || 'ZMW'
    }

    symbol = getSymbol(activeCurrency)

    // Special rental/nightly fallbacks
    if (!value && isNightly) {
       value = property.nightly_rate || 0
    } else if (!value && property.listing_type === 'rent') {
       value = property.monthly_rent || 0
    }

    if (!value) return 'Contact for Price'

    // Format the number 
    const formattedNum = value >= 1_000_000 
       ? `${(value / 1_000_000).toFixed(1)}M` 
       : value.toLocaleString()

    return `${symbol} ${formattedNum}`
  }

  // Pure value extractor
  const getRawValue = (property: Partial<Property>) => {
    switch (globalCurrency) {
      case 'ZMW': return property.price_zmw || property.asking_price || 0
      case 'USD': return property.price_usd || property.asking_price || 0
      case 'ZAR': return property.price_zar || property.asking_price || 0
      case 'KES': return property.price_kes || property.asking_price || 0
      case 'BWP': return property.price_bwp || property.asking_price || 0
      case 'NGN': return property.price_ngn || property.asking_price || 0
      case 'GHS': return property.price_ghs || property.asking_price || 0
      case 'EUR': return property.price_eur || property.asking_price || 0
      case 'GBP': return property.price_gbp || property.asking_price || 0
      default: return property.asking_price || 0
    }
  }

  // Large format (e.g. $1.2M)
  const formatBig = (value: number, currency: CurrencyCode = globalCurrency) => {
    const symbols: Record<string, string> = {
      ZMW: 'ZK', USD: '$', ZAR: 'R', KES: 'KSh', BWP: 'P',
      NGN: '₦', GHS: 'GH₵', EUR: '€', GBP: '£'
    }
    const symbol = symbols[currency] || currency
    const formattedNum = value >= 1_000_000_000
      ? `${(value / 1_000_000_000).toFixed(1)}B`
      : value >= 1_000_000
        ? `${(value / 1_000_000).toFixed(1)}M`
        : value.toLocaleString()
    
    return `${symbol}${formattedNum}`
  }

  return { format, getRawValue, formatBig, currentCurrency: globalCurrency }
}
