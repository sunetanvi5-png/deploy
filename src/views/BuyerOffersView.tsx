import React, { useState } from 'react'
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle,
  ArrowRightLeft,
  MessageSquare,
  Phone,
  Clock,
  Sparkles,
  Truck,
  IndianRupee,
  Star,
  XCircle,
} from 'lucide-react'
import { Language, BuyerOffer, NavTab } from '../types'
import { getTranslation } from '../i18n/translations'

interface BuyerOffersViewProps {
  language: Language
  offers: BuyerOffer[]
  setActiveNav: (tab: NavTab) => void
  onOpenOfferAction: (offer: BuyerOffer, mode: 'accept' | 'counter' | 'decline') => void
  onOpenChat: (offer: BuyerOffer) => void
  onShowNotice: (msg: string) => void
}

export const BuyerOffersView: React.FC<BuyerOffersViewProps> = ({
  language,
  offers,
  setActiveNav,
  onOpenOfferAction,
  onOpenChat,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)
  const [filterTab, setFilterTab] = useState<'pending' | 'accepted' | 'countered' | 'all'>('all')

  const filteredOffers = offers.filter((o) => {
    if (filterTab === 'pending') return o.status === 'pending'
    if (filterTab === 'accepted') return o.status === 'accepted'
    if (filterTab === 'countered') return o.status === 'countered'
    return true
  })

  return (
    <div className="view-page-container">
      {/* Page Header Banner */}
      <div className="page-header-row">
        <div>
          <p className="eyebrow">
            <ShoppingBag size={13} /> {t('buyerOffers').toUpperCase()} • VERIFIED DIRECT BUYERS
          </p>
          <h1>{t('buyerOffers')}</h1>
          <p className="subhead">
            Review, negotiate, and accept direct purchase bids from verified agro-processors, mills, and FPOs.
          </p>
        </div>

        <div className="escrow-assurance-badge">
          <ShieldCheck size={18} />
          <div>
            <strong>100% Escrow Guaranteed</strong>
            <small>Zero default risk. Funds locked before dispatch.</small>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tab-pills-row">
        <button
          className={`tab-pill ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All Offers ({offers.length})
        </button>
        <button
          className={`tab-pill ${filterTab === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterTab('pending')}
        >
          Pending Review ({offers.filter((o) => o.status === 'pending').length})
        </button>
        <button
          className={`tab-pill ${filterTab === 'countered' ? 'active' : ''}`}
          onClick={() => setFilterTab('countered')}
        >
          Countered ({offers.filter((o) => o.status === 'countered').length})
        </button>
        <button
          className={`tab-pill ${filterTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilterTab('accepted')}
        >
          Accepted & Ordered ({offers.filter((o) => o.status === 'accepted').length})
        </button>
      </div>

      {/* Offers List Grid */}
      <div className="offers-cards-grid">
        {filteredOffers.map((offer) => {
          const totalValue = offer.quantity * offer.price
          const originalPrice = offer.originalListingPrice || offer.price
          const priceDiff = offer.price - originalPrice

          return (
            <div key={offer.id} className={`buyer-offer-card ${offer.status}`}>
              {/* Card Header */}
              <div className="offer-card-top">
                <div className="buyer-head-info">
                  <div
                    className="buyer-avatar-large"
                    style={{ backgroundColor: offer.avatarColor }}
                  >
                    {offer.initials}
                  </div>
                  <div>
                    <div className="buyer-name-line">
                      <h3>{offer.buyerName}</h3>
                      {offer.verified && (
                        <span className="kyc-verified-badge" title="KYC and Bank Account Verified">
                          <CheckCircle size={12} /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="company-subtitle">{offer.companyName}</p>
                    <div className="buyer-metrics-strip">
                      <span className="rating-pill">
                        <Star size={11} /> {offer.rating}
                      </span>
                      <span className="deal-count-pill">{offer.dealsCount} deals completed</span>
                    </div>
                  </div>
                </div>

                <div className="offer-price-box">
                  <span className="bid-label">Offered Bid Price</span>
                  <strong className="bid-amount">₹{offer.price.toLocaleString('en-IN')}<small>/qtl</small></strong>
                  <div className="total-deal-tag">
                    Total: <strong>₹{totalValue.toLocaleString('en-IN')}</strong> ({offer.quantity} {offer.unit})
                  </div>
                </div>
              </div>

              {/* Offer Details Grid */}
              <div className="offer-terms-grid">
                <div className="term-box">
                  <span className="term-label">Crop & Quantity</span>
                  <strong className="term-value">
                    {offer.crop} • {offer.quantity} {offer.unit}
                  </strong>
                </div>

                <div className="term-box">
                  <span className="term-label">Logistics / Pickup</span>
                  <strong className="term-value">{offer.pickupLocation}</strong>
                </div>

                <div className="term-box">
                  <span className="term-label">Payment Terms</span>
                  <strong className="term-value">{offer.paymentTerms}</strong>
                </div>

                <div className="term-box">
                  <span className="term-label">Bid Validity</span>
                  <strong className="term-value text-orange">{offer.validUntil}</strong>
                </div>
              </div>

              {/* Status Note or Counter proposal info if any */}
              {offer.status === 'countered' && (
                <div className="counter-status-strip">
                  <ArrowRightLeft size={14} />
                  <span>
                    Your Counter-offer of <strong>₹{offer.counterPrice}/qtl</strong> has been sent to the buyer. Awaiting buyer confirmation.
                  </span>
                </div>
              )}

              {offer.status === 'accepted' && (
                <div className="accepted-status-strip">
                  <CheckCircle size={14} />
                  <span>
                    Deal Confirmed! Escrow deposit secured. View tracking in{' '}
                    <button
                      className="inline-nav-link"
                      onClick={() => setActiveNav('Orders & payments')}
                    >
                      Orders & Payments
                    </button>
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="offer-card-footer">
                <div className="footer-left-actions">
                  <button
                    className="btn-chat-action"
                    onClick={() => onOpenChat(offer)}
                    title="Open live chat with buyer"
                  >
                    <MessageSquare size={16} />
                    <span>Chat ({offer.messages?.length || 0})</span>
                  </button>

                  <button
                    className="btn-call-action"
                    onClick={() =>
                      onShowNotice(`Initiating call to ${offer.buyerName} at +91 98230 45890`)
                    }
                    title="Call buyer directly"
                  >
                    <Phone size={15} />
                    <span>Call Buyer</span>
                  </button>
                </div>

                {offer.status === 'pending' && (
                  <div className="footer-right-actions">
                    <button
                      className="btn-decline-offer"
                      onClick={() => onOpenOfferAction(offer, 'decline')}
                    >
                      <XCircle size={15} />
                      <span>Decline</span>
                    </button>

                    <button
                      className="btn-counter-offer"
                      onClick={() => onOpenOfferAction(offer, 'counter')}
                    >
                      <ArrowRightLeft size={15} />
                      <span>Counter Offer</span>
                    </button>

                    <button
                      className="btn-accept-offer"
                      onClick={() => onOpenOfferAction(offer, 'accept')}
                    >
                      <CheckCircle size={16} />
                      <span>Accept Offer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
