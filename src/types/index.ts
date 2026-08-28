export type Language = 'मराठी' | 'हिन्दी' | 'English'

export type NavTab = 
  | 'Overview' 
  | 'My produce' 
  | 'Market prices' 
  | 'Buyer offers' 
  | 'Orders & payments' 
  | 'Help & support' 
  | 'Settings'

export interface ProduceListing {
  id: string
  crop: string
  variety?: string
  grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Premium'
  quantity: number
  unit: string
  available: string
  expectedPrice?: number
  bestOffer?: number
  offersCount: number
  status: 'active' | 'under_deal' | 'sold'
  moisturePercent?: number
  harvestDate?: string
  location?: string
  imageCode: 'soybean' | 'wheat' | 'cotton' | 'chana' | 'onion' | 'maize'
  notes?: string
}

export interface MandiPrice {
  id: string
  market: string
  crop: string
  modal: number
  min: number
  max: number
  arrivals: number
  distanceKm: number
  grade: string
  trend: 'up' | 'down' | 'stable'
  bestNet?: boolean
  trend7d: number[]
  state: string
  district: string
  updatedMinutesAgo: number
}

export interface BuyerOffer {
  id: string
  buyerName: string
  companyName: string
  initials: string
  avatarColor: string
  listingId: string
  crop: string
  quantity: number
  unit: string
  price: number
  originalListingPrice?: number
  verified: boolean
  rating: number
  dealsCount: number
  paymentTerms: string
  pickupLocation: string
  validUntil: string
  status: 'pending' | 'countered' | 'accepted' | 'declined'
  counterPrice?: number
  counterNote?: string
  messages?: ChatMessage[]
}

export interface ChatMessage {
  id: string
  sender: 'farmer' | 'buyer' | 'system'
  text: string
  time: string
  isAudio?: boolean
  audioDuration?: string
}

export interface OrderTransaction {
  id: string
  orderCode: string
  offerId: string
  buyerName: string
  crop: string
  grade: string
  quantity: number
  unit: string
  ratePerQtl: number
  totalAmount: number
  advancePaid: number
  balanceAmount: number
  orderDate: string
  pickupDate: string
  status: 'confirmed' | 'weighbridge_done' | 'payment_escrow' | 'completed' | 'dispatched'
  paymentStatus: 'Advance Received' | 'Payment Escrowed' | 'Full Settlement Completed'
  invoiceNumber: string
  weighSlipUrl?: string
}

export interface FarmerProfile {
  name: string
  phone: string
  village: string
  district: string
  state: string
  pincode: string
  kisanCardNumber: string
  landHoldingAcres: number
  primaryCrops: string[]
  bankName: string
  accountMasked: string
  ifscCode: string
  isKycVerified: boolean
  memberSince: string
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: 'price_spike' | 'offer' | 'payment' | 'weather' | 'system'
  read: boolean
}
