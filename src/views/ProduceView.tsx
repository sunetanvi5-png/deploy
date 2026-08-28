import React, { useState } from 'react'
import {
  Sprout,
  Plus,
  ShoppingBag,
  IndianRupee,
  MapPin,
  Calendar,
  Droplets,
  Edit2,
  CheckCircle2,
  ArrowUpRight,
  Calculator,
  Trash2,
} from 'lucide-react'
import type { Language, ProduceListing, NavTab } from '../types'
import { getTranslation } from '../i18n/translations'

interface ProduceViewProps {
  language: Language
  listings: ProduceListing[]
  setActiveNav: (tab: NavTab) => void
  onOpenListingModal: () => void
  onOpenNetProfitModal: (crop?: string, qty?: number, price?: number) => void
  onDeleteListing: (id: string) => void
  onMarkAsSold: (id: string) => void
  onShowNotice: (msg: string) => void
}

export const ProduceView: React.FC<ProduceViewProps> = ({
  language,
  listings,
  setActiveNav,
  onOpenListingModal,
  onOpenNetProfitModal,
  onDeleteListing,
  onMarkAsSold,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'sold'>('all')

  const filtered = listings.filter((l) => {
    if (filterTab === 'active') return l.status === 'active' || l.status === 'under_deal'
    if (filterTab === 'sold') return l.status === 'sold'
    return true
  })

  const totalQuintals = listings.reduce((sum, l) => sum + l.quantity, 0)
  const totalValue = listings.reduce(
    (sum, l) => sum + (l.bestOffer || l.expectedPrice || 5000) * l.quantity,
    0
  )

  return (
    <div className="view-page-container">
      {/* Page Header Banner */}
      <div className="page-header-row">
        <div>
          <p className="eyebrow">
            <Sprout size={13} /> {t('myProduce').toUpperCase()}
          </p>
          <h1>{t('myProduce')}</h1>
          <p className="subhead">Manage your listed crops, track buyer interest, and monitor harvest batches.</p>
        </div>

        <button className="primary-action" onClick={onOpenListingModal}>
          <Plus size={18} />
          <span>{t('listProduce')}</span>
        </button>
      </div>

      {/* Summary Stat Strip */}
      <div className="produce-summary-bar">
        <div className="summary-stat">
          <span>Total Listed Produce</span>
          <strong>{totalQuintals} quintals</strong>
        </div>
        <div className="summary-stat">
          <span>Active Batches</span>
          <strong>{listings.filter((l) => l.status === 'active').length} Crops</strong>
        </div>
        <div className="summary-stat">
          <span>Total Estimated Value</span>
          <strong className="text-green">₹{totalValue.toLocaleString('en-IN')}</strong>
        </div>
        <div className="summary-stat">
          <span>Offers Under Review</span>
          <strong className="text-orange">
            {listings.reduce((sum, l) => sum + l.offersCount, 0)} Bids
          </strong>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tab-pills-row">
        <button
          className={`tab-pill ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All Produce ({listings.length})
        </button>
        <button
          className={`tab-pill ${filterTab === 'active' ? 'active' : ''}`}
          onClick={() => setFilterTab('active')}
        >
          Active Listings ({listings.filter((l) => l.status === 'active').length})
        </button>
        <button
          className={`tab-pill ${filterTab === 'sold' ? 'active' : ''}`}
          onClick={() => setFilterTab('sold')}
        >
          Past Sold Batches ({listings.filter((l) => l.status === 'sold').length})
        </button>
      </div>

      {/* Produce Cards Grid */}
      <div className="produce-cards-grid">
        {filtered.map((item) => {
          const grossValue = (item.bestOffer || item.expectedPrice || 5000) * item.quantity
          return (
            <div key={item.id} className={`produce-card ${item.status === 'sold' ? 'sold-card' : ''}`}>
              {/* Card Top */}
              <div className="produce-card-head">
                <div className="produce-card-title-group">
                  <div className={`crop-badge-icon ${item.imageCode}`}>
                    <span>{item.crop.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3>{item.crop}</h3>
                    <p>{item.variety || 'Standard Quality'}</p>
                  </div>
                </div>

                <div className="produce-badges">
                  <span className={`grade-tag ${item.grade === 'Premium' ? 'premium-tag' : ''}`}>
                    {item.grade}
                  </span>
                  <span className={`status-tag ${item.status}`}>
                    {item.status === 'active'
                      ? 'Live on Market'
                      : item.status === 'under_deal'
                      ? 'Under Deal'
                      : 'Sold Out'}
                  </span>
                </div>
              </div>

              {/* Card Meta Details */}
              <div className="produce-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Quantity</span>
                  <strong className="spec-val">
                    {item.quantity} {item.unit}
                  </strong>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Reserve Price</span>
                  <strong className="spec-val">
                    ₹{(item.expectedPrice || 5000).toLocaleString('en-IN')}/qtl
                  </strong>
                </div>

                <div className="spec-item highlight-spec">
                  <span className="spec-label">Top Buyer Bid</span>
                  <strong className="spec-val text-green">
                    {item.bestOffer ? `₹${item.bestOffer.toLocaleString('en-IN')}/qtl` : 'Awaiting Bids'}
                  </strong>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Estimated Value</span>
                  <strong className="spec-val">₹{grossValue.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="produce-extra-info">
                {item.moisturePercent && (
                  <div className="extra-pill">
                    <Droplets size={13} />
                    <span>Moisture: {item.moisturePercent}%</span>
                  </div>
                )}
                {item.available && (
                  <div className="extra-pill">
                    <Calendar size={13} />
                    <span>{item.available}</span>
                  </div>
                )}
                {item.location && (
                  <div className="extra-pill">
                    <MapPin size={13} />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              {item.notes && <p className="produce-notes">{item.notes}</p>}

              {/* Card Action Foot */}
              <div className="produce-card-actions">
                <button
                  className="btn-view-offers"
                  onClick={() => setActiveNav('Buyer offers')}
                >
                  <ShoppingBag size={15} />
                  <span>View Offers ({item.offersCount})</span>
                </button>

                <button
                  className="btn-calc-action"
                  onClick={() =>
                    onOpenNetProfitModal(
                      item.crop,
                      item.quantity,
                      item.bestOffer || item.expectedPrice || 5000
                    )
                  }
                  title="Calculate take-home profit"
                >
                  <Calculator size={15} />
                  <span>Profit Calculator</span>
                </button>

                {item.status !== 'sold' ? (
                  <button
                    className="btn-mark-sold"
                    onClick={() => onMarkAsSold(item.id)}
                    title="Mark this batch as sold"
                  >
                    <CheckCircle2 size={15} />
                    <span>Mark Sold</span>
                  </button>
                ) : (
                  <button
                    className="btn-delete-action"
                    onClick={() => onDeleteListing(item.id)}
                    title="Remove from list"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
