import React, { useState } from 'react'
import { X, CheckCircle, ArrowRightLeft, ShieldCheck, IndianRupee, AlertCircle, Building2 } from 'lucide-react'
import type { Language, BuyerOffer } from '../types'
import { getTranslation } from '../i18n/translations'

interface OfferActionModalProps {
  isOpen: boolean
  mode: 'accept' | 'counter' | 'decline'
  offer: BuyerOffer | null
  onClose: () => void
  onAccept: (offerId: string) => void
  onCounter: (offerId: string, counterPrice: number, note: string) => void
  onDecline: (offerId: string) => void
  language: Language
}

export const OfferActionModal: React.FC<OfferActionModalProps> = ({
  isOpen,
  mode,
  offer,
  onClose,
  onAccept,
  onCounter,
  onDecline,
  language,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [counterPrice, setCounterPrice] = useState<number>(offer ? offer.price + 80 : 5200)
  const [counterNote, setCounterNote] = useState<string>(
    'The quality is Grade A with low moisture (9.5%). Can you match our counter price for farm pickup?'
  )

  if (!isOpen || !offer) return null

  const originalTotal = offer.quantity * offer.price
  const counterTotal = offer.quantity * counterPrice
  const profitDelta = counterTotal - originalTotal
  const advanceAmount = Math.round(originalTotal * 0.2) // 20% advance
  const balanceAmount = originalTotal - advanceAmount

  const handleConfirm = () => {
    if (mode === 'accept') {
      onAccept(offer.id)
    } else if (mode === 'counter') {
      onCounter(offer.id, counterPrice, counterNote)
    } else if (mode === 'decline') {
      onDecline(offer.id)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className={`modal-header-icon ${mode === 'accept' ? 'green-bg' : mode === 'counter' ? 'orange-bg' : 'red-bg'}`}>
            {mode === 'accept' && <CheckCircle size={20} />}
            {mode === 'counter' && <ArrowRightLeft size={20} />}
            {mode === 'decline' && <AlertCircle size={20} />}
          </div>
          <div>
            <h3>
              {mode === 'accept' && t('acceptConfirmation')}
              {mode === 'counter' && t('counterOfferTitle')}
              {mode === 'decline' && 'Decline Buyer Offer'}
            </h3>
            <p>
              {offer.buyerName} • {offer.crop} ({offer.quantity} {offer.unit})
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-content">
          {/* Buyer details card */}
          <div className="buyer-summary-card">
            <div className="buyer-avatar-large" style={{ backgroundColor: offer.avatarColor }}>
              {offer.initials}
            </div>
            <div className="buyer-summary-info">
              <h4>{offer.buyerName}</h4>
              <p>{offer.companyName}</p>
              <div className="buyer-stats-row">
                <span className="rating-pill">★ {offer.rating}</span>
                <span className="deals-pill">{offer.dealsCount} deals verified</span>
                <span className="verified-pill">KYC Verified</span>
              </div>
            </div>
          </div>

          {mode === 'accept' && (
            <div className="accept-flow-details">
              <div className="deal-breakdown-grid">
                <div className="breakdown-item">
                  <span>Agreed Price</span>
                  <strong>₹{offer.price.toLocaleString('en-IN')}/qtl</strong>
                </div>
                <div className="breakdown-item">
                  <span>Total Quantity</span>
                  <strong>{offer.quantity} quintals</strong>
                </div>
                <div className="breakdown-item highlight">
                  <span>Total Deal Value</span>
                  <strong>₹{originalTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="escrow-terms-box">
                <div className="escrow-header">
                  <ShieldCheck size={18} className="shield-icon" />
                  <strong>KisanSetu Escrow Protection Active</strong>
                </div>
                <p>{t('escrowNote')}</p>
                <div className="escrow-payout-steps">
                  <div className="payout-step">
                    <span className="step-num">1</span>
                    <div>
                      <strong>Escrow Deposit Locked</strong>
                      <small>₹{originalTotal.toLocaleString('en-IN')} deposited by buyer</small>
                    </div>
                  </div>
                  <div className="payout-step">
                    <span className="step-num">2</span>
                    <div>
                      <strong>Weighbridge Slip Upload</strong>
                      <small>Quantity verified at local APMC or pickup point</small>
                    </div>
                  </div>
                  <div className="payout-step">
                    <span className="step-num">3</span>
                    <div>
                      <strong>Instant DBT Bank Transfer</strong>
                      <small>Funds released to Suresh Patil's SBI A/c (...4589)</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pickup-terms-note">
                <strong>Logistics & Pickup:</strong> {offer.pickupLocation} • {offer.paymentTerms}
              </div>
            </div>
          )}

          {mode === 'counter' && (
            <div className="counter-flow-details">
              <div className="counter-current-box">
                <div>
                  <span>Buyer's Original Offer:</span>
                  <strong>₹{offer.price.toLocaleString('en-IN')}/qtl</strong>
                </div>
                <div>
                  <span>Current Value:</span>
                  <strong>₹{originalTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="form-group highlight-box">
                <label>{t('proposedPrice')}</label>
                <div className="input-with-affix price-input-wrap">
                  <span className="rupee-symbol">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="10"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(Number(e.target.value))}
                    className="form-input price-input"
                  />
                  <span className="input-affix">/ qtl</span>
                </div>

                <div className="counter-delta-preview">
                  <span>New Gross Value: <strong>₹{counterTotal.toLocaleString('en-IN')}</strong></span>
                  <span className={profitDelta >= 0 ? 'delta-gain' : 'delta-loss'}>
                    {profitDelta >= 0 ? `+ ₹${profitDelta.toLocaleString('en-IN')} More Profit` : `- ₹${Math.abs(profitDelta).toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Message to Buyer (Reason for counter):</label>
                <textarea
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  rows={3}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {mode === 'decline' && (
            <div className="decline-warning-box">
              <p>
                Are you sure you want to decline this offer from <strong>{offer.buyerName}</strong> for ₹{offer.price}/qtl?
              </p>
              <small>The buyer will be notified. Your produce will remain active and visible to other buyers.</small>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`btn-primary ${mode === 'accept' ? 'btn-green' : mode === 'counter' ? 'btn-orange' : 'btn-red'}`}
            >
              {mode === 'accept' && <CheckCircle size={16} />}
              {mode === 'counter' && <ArrowRightLeft size={16} />}
              {mode === 'accept' && t('accept')}
              {mode === 'counter' && t('sendCounter')}
              {mode === 'decline' && 'Confirm Decline'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
