import React, { useState } from 'react'
import {
  TrendingUp,
  MapPin,
  Filter,
  Search,
  ArrowUpRight,
  Calculator,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { Language, MandiPrice } from '../types'
import { getTranslation } from '../i18n/translations'

interface MarketPricesViewProps {
  language: Language
  prices: MandiPrice[]
  onOpenNetProfitModal: (crop?: string, qty?: number, price?: number) => void
  onShowNotice: (msg: string) => void
}

const CROPS_LIST = ['All Crops', 'Soybean', 'Wheat', 'Cotton', 'Gram', 'Maize']

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  language,
  prices,
  onOpenNetProfitModal,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops')
  const [maxDistance, setMaxDistance] = useState<number>(250) // km
  const [sortBy, setSortBy] = useState<'price_desc' | 'distance_asc' | 'arrivals_desc'>('price_desc')
  const [searchMandi, setSearchMandi] = useState<string>('')

  // Filter & Sort
  const filteredPrices = prices
    .filter((p) => {
      const matchCrop = selectedCrop === 'All Crops' || p.crop.toLowerCase() === selectedCrop.toLowerCase()
      const matchDist = p.distanceKm <= maxDistance
      const matchSearch =
        p.market.toLowerCase().includes(searchMandi.toLowerCase()) ||
        p.district.toLowerCase().includes(searchMandi.toLowerCase()) ||
        p.state.toLowerCase().includes(searchMandi.toLowerCase())
      return matchCrop && matchDist && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price_desc') return b.modal - a.modal
      if (sortBy === 'distance_asc') return a.distanceKm - b.distanceKm
      if (sortBy === 'arrivals_desc') return b.arrivals - a.arrivals
      return 0
    })

  const topMandi = filteredPrices[0]

  return (
    <div className="view-page-container">
      {/* Page Header Banner */}
      <div className="page-header-row">
        <div>
          <p className="eyebrow">
            <TrendingUp size={13} /> {t('marketPrices').toUpperCase()} • LIVE AGMARKNET FEED
          </p>
          <h1>{t('marketPrices')}</h1>
          <p className="subhead">Compare rates across Vidarbha, Maharashtra and national APMC mandis to maximize your profit.</p>
        </div>

        <button
          className="primary-action"
          onClick={() => onOpenNetProfitModal('Soybean', 25, 5080)}
        >
          <Calculator size={16} />
          <span>Compare Net Returns</span>
        </button>
      </div>

      {/* Top Highlight Banner */}
      {topMandi && (
        <div className="top-mandi-banner">
          <div className="top-mandi-info">
            <span className="best-badge">
              <Sparkles size={13} /> TOP MODAL RATE TODAY
            </span>
            <h2>{topMandi.market} ({topMandi.district}, {topMandi.state})</h2>
            <p>
              {topMandi.crop} • {topMandi.grade} • {topMandi.distanceKm} km from your farm • {topMandi.arrivals} qtl arrived today
            </p>
          </div>

          <div className="top-mandi-rate-box">
            <span className="rate-label">Modal Price</span>
            <strong className="rate-value">₹{topMandi.modal.toLocaleString('en-IN')}<small>/qtl</small></strong>
            <span className="rate-range">Min: ₹{topMandi.min} • Max: ₹{topMandi.max}</span>
            <button
              className="btn-calc-hero"
              onClick={() => onOpenNetProfitModal(topMandi.crop, 25, topMandi.modal)}
            >
              <Calculator size={14} /> Calculate My In-Hand Return
            </button>
          </div>
        </div>
      )}

      {/* Filters Strip */}
      <div className="mandi-filters-bar">
        {/* Crop Selector Pills */}
        <div className="crop-filter-pills">
          {CROPS_LIST.map((crop) => (
            <button
              key={crop}
              className={`crop-pill-btn ${selectedCrop === crop ? 'active' : ''}`}
              onClick={() => setSelectedCrop(crop)}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* Distance & Search Controls */}
        <div className="mandi-filter-controls">
          <div className="filter-select-group">
            <label>Distance Radius:</label>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="mandi-select"
            >
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
              <option value={150}>Within 150 km</option>
              <option value={500}>All Mandis (500 km)</option>
            </select>
          </div>

          <div className="filter-select-group">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="mandi-select"
            >
              <option value="price_desc">Highest Modal Price</option>
              <option value="distance_asc">Nearest Distance</option>
              <option value="arrivals_desc">Highest Arrivals</option>
            </select>
          </div>

          <div className="search-mandi-input-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Filter by mandi name or district..."
              value={searchMandi}
              onChange={(e) => setSearchMandi(e.target.value)}
              className="search-mandi-input"
            />
          </div>
        </div>
      </div>

      {/* Mandi Rates Table / Cards */}
      <div className="mandi-table-card">
        <div className="mandi-table-header-row">
          <span>MARKET & DISTRICT</span>
          <span>CROP & GRADE</span>
          <span>MODAL PRICE / QTL</span>
          <span>DAILY RANGE (MIN - MAX)</span>
          <span>7-DAY TREND</span>
          <span>ARRIVALS</span>
          <span>DISTANCE</span>
          <span>ACTION</span>
        </div>

        {filteredPrices.map((m) => (
          <div
            key={m.id}
            className={`mandi-table-row ${m.bestNet ? 'highlight-row' : ''}`}
            onClick={() => onOpenNetProfitModal(m.crop, 25, m.modal)}
            title="Click to calculate net in-hand payout"
          >
            {/* Market Column */}
            <div className="col-market">
              <span className="mandi-pin-icon">
                <MapPin size={16} />
              </span>
              <div>
                <strong>
                  {m.market} {m.bestNet && <mark>BEST NET</mark>}
                </strong>
                <small>{m.district}, {m.state}</small>
              </div>
            </div>

            {/* Crop Column */}
            <div className="col-crop">
              <span className="crop-name-badge">{m.crop}</span>
              <small>{m.grade}</small>
            </div>

            {/* Price Column */}
            <div className="col-price">
              <strong className="main-price">₹{m.modal.toLocaleString('en-IN')}</strong>
              <small>{m.updatedMinutesAgo} mins ago</small>
            </div>

            {/* Range Column */}
            <div className="col-range">
              <span>₹{m.min.toLocaleString('en-IN')} − ₹{m.max.toLocaleString('en-IN')}</span>
              <div className="range-bar">
                <div
                  className="range-fill"
                  style={{
                    left: `${((m.modal - m.min) / (m.max - m.min || 1)) * 100 * 0.4}%`,
                    width: '35%',
                  }}
                />
              </div>
            </div>

            {/* Trend Column */}
            <div className="col-trend">
              <span className={`trend-tag ${m.trend}`}>
                {m.trend === 'up' ? '▲ Rising' : m.trend === 'down' ? '▼ Falling' : '● Stable'}
              </span>
              <div className="trend-sparkline-mini">
                {m.trend7d?.map((val, idx) => (
                  <div
                    key={idx}
                    className="spark-bar"
                    style={{
                      height: `${Math.max(10, Math.min(26, (val - 4500) / 30))}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Arrivals Column */}
            <div className="col-arrivals">
              <strong>{m.arrivals}</strong>
              <small>quintals</small>
            </div>

            {/* Distance Column */}
            <div className="col-distance">
              <strong>{m.distanceKm} km</strong>
              <small>from Hingna</small>
            </div>

            {/* Action Column */}
            <div className="col-action">
              <button
                className="btn-table-calc"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenNetProfitModal(m.crop, 25, m.modal)
                }}
              >
                <Calculator size={13} />
                <span>Calc Payout</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
