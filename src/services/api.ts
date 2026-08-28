import { MandiPrice, ProduceListing, BuyerOffer, OrderTransaction } from '../types'
import { initialMandiPrices, initialProduceListings, initialBuyerOffers, initialOrders } from '../data/mockData'

const API_BASE = 'http://localhost:4000/api'

export async function fetchDashboardData() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, { signal: AbortSignal.timeout(1500) })
    if (!res.ok) throw new Error('API failed')
    return await res.json()
  } catch {
    return {
      stats: { activeListings: 3, offersReceived: 4, expectedEarnings: 124750, inProgress: 1 },
      prices: initialMandiPrices,
      listings: initialProduceListings,
      offers: initialBuyerOffers,
      orders: initialOrders,
    }
  }
}

export async function calculateNetPayout(params: {
  quantity: number
  sellingPrice: number
  distanceKm: number
  transportRatePerKm?: number
  mandiCessPercent?: number
  loadingPerQtl?: number
  baggingPerQtl?: number
  commissionPercent?: number
  moistureDiscountPercent?: number
}) {
  const {
    quantity,
    sellingPrice,
    distanceKm,
    transportRatePerKm = 35,
    mandiCessPercent = 1.05,
    loadingPerQtl = 15,
    baggingPerQtl = 20,
    commissionPercent = 0, // 0 for KisanSetu direct buyer sale vs 2% at traditional mandi
    moistureDiscountPercent = 0,
  } = params

  const grossIncome = quantity * sellingPrice
  const transportCost = Math.round(distanceKm * transportRatePerKm)
  const mandiCess = Math.round((grossIncome * mandiCessPercent) / 100)
  const loadingCost = Math.round(quantity * loadingPerQtl)
  const baggingCost = Math.round(quantity * baggingPerQtl)
  const commissionCost = Math.round((grossIncome * commissionPercent) / 100)
  const moistureDiscount = Math.round((grossIncome * moistureDiscountPercent) / 100)

  const totalDeductions = transportCost + mandiCess + loadingCost + baggingCost + commissionCost + moistureDiscount
  const netIncome = Math.max(0, grossIncome - totalDeductions)
  const netRatePerQtl = quantity > 0 ? Math.round(netIncome / quantity) : 0

  return {
    grossIncome,
    transportCost,
    mandiCess,
    loadingCost,
    baggingCost,
    commissionCost,
    moistureDiscount,
    totalDeductions,
    netIncome,
    netRatePerQtl,
  }
}
