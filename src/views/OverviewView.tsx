import React, { useState } from 'react'
import {
  Sprout,
  ShoppingBag,
  IndianRupee,
  PackageCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight,
  Calculator,
  MessageSquare,
  ChevronDown,
  Check,
  Sparkles,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react'
import {
  Language,
  ProduceListing,
  MandiPrice,
  BuyerOffer,
  OrderTransaction,
  FarmerProfile,
  NavTab,
} from '../types'
import { getTranslation } from '../i18n/translations'

interface OverviewViewProps {
  language: Language
  setActiveNav: (tab: NavTab) => void
  listings: ProduceListing[]
  prices: MandiPrice[]
  offers: BuyerOffer[]
  orders: OrderTransaction[]
  farmerProfile: FarmerProfile
  onOpenListingModal: () => void
  onOpenNetProfitModal: (crop?: string, qty?: number, price?: number) => void
  onOpenOfferAction: (offer: BuyerOffer, mode: 'accept' | 'counter') => void
  onOpenChat: (offer: BuyerOffer) => void
  onShowNotice: (msg: string) => void
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  language,
  setActiveNav,
  listings,
  prices,
  offers,
  orders,
  farmerProfile,
  onOpenListingModal,
  onOpenNetProfitModal,
  onOpenOfferAction,
  onOpenChat,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [selectedCrop, setSelectedCrop] = useState<string>('Soybean')
  const [storeDuration, setStoreDuration] = useState<number>(15) // days
  const [filterRange, setFilterRange] = useState<'Last 30 days' | 'Last 7 days'>('Last 30 days')
  const [quickQty, setQuickQty] = useState<number>(25)
  const [quickCrop, setQuickCrop] = useState<string>('Soybean')

  // Calculated dynamic statistics
  const activeListingsCount = listings.filter((l) => l.status === 'active').length
  const pendingOffers = offers.filter((o) => o.status === 'pending')
  const expectedGross = listings
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + (l.bestOffer || l.expectedPrice || 5000) * l.quantity, 0)
  const inProgressDeals = orders.filter((o) => o.status !== 'completed').length

  // Filtered prices by selected crop
  const filteredPrices = prices.filter((p) => p.crop.toLowerCase() === selectedCrop.toLowerCase())
  const displayPrices = filteredPrices.length > 0 ? filteredPrices : prices.slice(0, 3)

  // Sell vs Store Calculations
  const currentBestPrice = 5080
  const expectedFuturePrice = currentBestPrice + (storeDuration === 15 ? 170 : storeDuration === 30 ? 290 : 380)
  const warehouseStorageCostPerQtl = Math.round((storeDuration / 30) * 15) // ~₹15/qtl/month
  const interestCostPerQtl = Math.round(((currentBestPrice * 0.07) / 365) * storeDuration) // 7% crop loan interest
  const totalHoldingCost = (warehouseStorageCostPerQtl + interestCostPerQtl) * 25
  const sellNowTotal = 25 * currentBestPrice
  const futureGrossTotal = 25 * expectedFuturePrice
  const netStorePayout = futureGrossTotal - totalHoldingCost
  const netGain = netStorePayout - sellNowTotal

  return (
    <div className="overview-container">
      {/* Welcome Row */}
      <div className="welcome-row">
        <div>
          <p className="eyebrow">
            <span className="live-dot" /> {t('liveMarketData')} • MAHARASHTRA AGMARKNET
          </p>
          <h1>
            {t('goodMorning')}, {farmerProfile.name.split(' ')[1] || 'Suresh'} <span>👋</span>
          </h1>
          <p className="subhead">{t('subhead')}</p>
        </div>
        <button className="primary-action" onClick={onOpenListingModal}>
          <PlusCircle size={18} />
          <span>{t('listProduce')}</span>
        </button>
      </div>

      {/* Real-time Metric Cards */}
      <div className="stat-grid">
        <div className="stat-card" onClick={() => setActiveNav('My produce')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon green">
            <Sprout size={20} />
          </div>
          <div className="stat-meta">
            <span>{t('activeListings')}</span>
            <strong>
              {activeListingsCount} <em>+1 this week</em>
            </strong>
          </div>
          <ArrowUpRight className="trend" size={18} />
        </div>

        <div className="stat-card" onClick={() => setActiveNav('Buyer offers')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon orange">
            <ShoppingBag size={20} />
          </div>
          <div className="stat-meta">
            <span>{t('offersReceived')}</span>
            <strong>
              {pendingOffers.length.toString().padStart(2, '0')} <em>+2 today</em>
            </strong>
          </div>
          <ArrowUpRight className="trend" size={18} />
        </div>

        <div className="stat-card" onClick={() => onOpenNetProfitModal()} style={{ cursor: 'pointer' }}>
          <div className="stat-icon blue">
            <IndianRupee size={20} />
          </div>
          <div className="stat-meta">
            <span>{t('expectedEarnings')}</span>
            <strong>
              ₹{expectedGross.toLocaleString('en-IN')}{' '}
              <em className="neutral">{t('fromOpenListings')}</em>
            </strong>
          </div>
          <ArrowUpRight className="trend" size={18} />
        </div>

        <div className="stat-card" onClick={() => setActiveNav('Orders & payments')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon purple">
            <PackageCheck size={20} />
          </div>
          <div className="stat-meta">
            <span>{t('inProgress')}</span>
            <strong>
              {inProgressDeals.toString().padStart(2, '0')}{' '}
              <em className="neutral">{t('paymentPending')}</em>
            </strong>
          </div>
          <ArrowUpRight className="trend" size={18} />
        </div>
      </div>

      {/* Section Heading: Market Pulse */}
      <div className="section-heading">
        <div>
          <h2>{t('marketPulse')}</h2>
          <p>{t('marketPulseSub')}</p>
        </div>
        <button className="text-button" onClick={() => setActiveNav('Market prices')}>
          <span>{t('viewAllPrices')}</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Dashboard Grid: Mandi Rates & Storage Advisor */}
      <div className="dashboard-grid">
        {/* Nearby Mandi Prices Panel */}
        <section className="panel price-panel">
          <div className="panel-head">
            <div>
              <h3>{t('nearbyMandiPrices')}</h3>
              <p>
                <span className="live-dot" /> {t('updatedAgo')} <span className="source">{t('sourceAgmarknet')}</span>
              </p>
            </div>
            <button
              className="select-button"
              onClick={() => {
                const next = selectedCrop === 'Soybean' ? 'Wheat' : selectedCrop === 'Wheat' ? 'Cotton' : 'Soybean'
                setSelectedCrop(next)
                onShowNotice(`Showing ${next} Mandi rates`)
              }}
            >
              <span>{selectedCrop}</span>
              <ChevronDown size={15} />
            </button>
          </div>

          <div className="price-table">
            <div className="table-row table-label">
              <span>{t('market')}</span>
              <span>{t('modalPrice')}</span>
              <span>{t('trend7d')}</span>
              <span>{t('distance')}</span>
            </div>

            {displayPrices.map((m) => (
              <div
                key={m.id}
                className={`table-row ${m.bestNet ? 'featured' : ''}`}
                onClick={() => onOpenNetProfitModal(m.crop, 25, m.modal)}
                style={{ cursor: 'pointer' }}
                title="Click to calculate net in-hand returns"
              >
                <div className="market-name">
                  <span className="market-pin">
                    <MapPin size={15} />
                  </span>
                  <div>
                    <strong>
                      {m.market} {m.bestNet && <mark>{t('bestNet')}</mark>}
                    </strong>
                    <small>
                      {m.grade} • {m.arrivals} qtl arrivals
                    </small>
                  </div>
                </div>

                <strong className="price">₹{m.modal.toLocaleString('en-IN')}</strong>

                <span className={`sparkline ${m.trend}`}>
                  {m.trend === 'up' ? '╱╲╱╱' : m.trend === 'down' ? '╲╱╲╲' : '━━━━'}
                </span>

                <span>{m.distanceKm} km</span>
              </div>
            ))}
          </div>

          <div className="panel-foot">
            <span>{t('indicativeDisclaimer')}</span>
            <button onClick={() => onOpenNetProfitModal(selectedCrop, 25, displayPrices[0]?.modal || 5080)}>
              <span>{t('compareNetReturns')}</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </section>

        {/* Interactive Sell vs Store Decision Panel */}
        <section className="panel decision-panel">
          <div className="panel-head">
            <div>
              <h3>{t('sellOrStore')}</h3>
              <p>{t('forSoybeanListing')}</p>
            </div>
            <div className="storage-duration-pills">
              {[15, 30, 45].map((d) => (
                <button
                  key={d}
                  className={`dur-pill ${storeDuration === d ? 'active' : ''}`}
                  onClick={() => setStoreDuration(d)}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="decision-visual">
            <div className="donut">
              <strong>+₹{netGain > 0 ? netGain.toLocaleString('en-IN') : 0}</strong>
              <span>{t('moreProfit')}</span>
            </div>
            <div className="decision-copy">
              <strong>Store for {storeDuration} days</strong>
              <p>{t('expectedNetIncome')}</p>
              <b>₹{netStorePayout.toLocaleString('en-IN')}</b>
              <span className="risk">
                <span /> {t('mediumRisk')}
              </span>
            </div>
          </div>

          <div className="decision-compare">
            <div>
              <span>{t('sellNow')}</span>
              <strong>₹{sellNowTotal.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span>{t('storageAndInterest')}</span>
              <strong className="expense">− ₹{totalHoldingCost.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <p className="disclaimer">{t('disclaimerStorage')}</p>
        </section>
      </div>

      {/* Section Heading: Action Items */}
      <div className="section-heading lower">
        <div>
          <h2>{t('whatNeedsAttention')}</h2>
          <p>{t('salesMovingForward')}</p>
        </div>
        <button
          className="filter-button"
          onClick={() => {
            const next = filterRange === 'Last 30 days' ? 'Last 7 days' : 'Last 30 days'
            setFilterRange(next)
            onShowNotice(`Showing ${next.toLowerCase()}`)
          }}
        >
          <Clock size={15} />
          <span>{filterRange}</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Bottom Grid: Active Listings & Buyer Offers */}
      <div className="bottom-grid">
        {/* Active Produce Panel */}
        <section className="panel listing-panel">
          <div className="panel-head">
            <div>
              <h3>{t('yourActiveProduce')}</h3>
              <p>{listings.length} {t('listingsLive')}</p>
            </div>
            <button className="text-button" onClick={() => setActiveNav('My produce')}>
              <span>{t('manage')}</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="listings-scroll-list">
            {listings.map((l) => (
              <div key={l.id} className="listing">
                <div className={`crop-thumb ${l.imageCode}`}>
                  <span>{l.crop.slice(0, 3).toUpperCase()}</span>
                </div>

                <div className="listing-info">
                  <strong>
                    {l.crop} <small>{l.grade}</small>
                  </strong>
                  <span>
                    {l.quantity} {l.unit} • {l.available}
                  </span>
                  <div className="progress-label">
                    <span>{t('receivingOffers')}</span>
                    <b>{l.offersCount} offers</b>
                  </div>
                  <div className="progress">
                    <i
                      className={l.imageCode === 'wheat' ? 'blue-progress' : ''}
                      style={{ width: `${Math.min(100, l.offersCount * 25 + 20)}%` }}
                    />
                  </div>
                </div>

                <div className="listing-value">
                  <span>{t('bestOffer')}</span>
                  <strong>
                    ₹{(l.bestOffer || l.expectedPrice || 5000).toLocaleString('en-IN')}
                    <span>/qtl</span>
                  </strong>
                  <button onClick={() => setActiveNav('Buyer offers')}>
                    <span>{t('viewOffers')}</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Buyer Offers Panel */}
        <section className="panel offers-panel">
          <div className="panel-head">
            <div>
              <h3>{t('latestBuyerOffers')}</h3>
              <p>{t('verifiedBuyersNearYou')}</p>
            </div>
            <button
              className="icon-button"
              aria-label="Message buyers"
              onClick={() => {
                if (offers[0]) onOpenChat(offers[0])
              }}
              title="Chat with buyer"
            >
              <MessageSquare size={17} />
            </button>
          </div>

          <div className="offers-scroll-list">
            {offers.slice(0, 3).map((offer) => (
              <div key={offer.id} className="offer">
                <div
                  className="buyer-avatar"
                  style={{ backgroundColor: offer.avatarColor }}
                >
                  {offer.initials}
                </div>

                <div className="offer-main">
                  <strong>
                    {offer.buyerName}{' '}
                    {offer.verified && (
                      <span className="verified">
                        <Check size={10} />
                      </span>
                    )}
                  </strong>
                  <span>
                    For your {offer.crop} • {offer.quantity} {offer.unit}
                  </span>
                  <div className="offer-inline-actions">
                    <button
                      className="inline-accept-btn"
                      onClick={() => onOpenOfferAction(offer, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="inline-counter-btn"
                      onClick={() => onOpenOfferAction(offer, 'counter')}
                    >
                      Counter
                    </button>
                    <button
                      className="inline-chat-btn"
                      onClick={() => onOpenChat(offer)}
                    >
                      Chat
                    </button>
                  </div>
                </div>

                <div className="offer-price">
                  <strong>₹{offer.price.toLocaleString('en-IN')}</strong>
                  <small>/ qtl</small>
                </div>
              </div>
            ))}
          </div>

          <button className="full-button" onClick={() => setActiveNav('Buyer offers')}>
            <span>{t('reviewAllOffers')}</span>
            <ArrowUpRight size={15} />
          </button>
        </section>
      </div>

      {/* Quick Net Profit Check Strip */}
      <div className="quick-strip">
        <div className="quick-intro">
          <span className="quick-icon">
            <Calculator size={18} />
          </span>
          <div>
            <strong>{t('quickProfitCheck')}</strong>
            <span>{t('takeHomeSubtitle')}</span>
          </div>
        </div>

        <div className="quick-fields">
          <label>
            Crop
            <select value={quickCrop} onChange={(e) => setQuickCrop(e.target.value)}>
              <option>Soybean</option>
              <option>Wheat</option>
              <option>Cotton</option>
              <option>Gram</option>
            </select>
          </label>

          <label>
            Quantity
            <input
              type="number"
              value={quickQty}
              onChange={(e) => setQuickQty(Math.max(1, Number(e.target.value)))}
              min="1"
            />
            <span>qtl</span>
          </label>

          <label>
            Market Price
            <input
              value={quickCrop === 'Soybean' ? '5,080' : quickCrop === 'Cotton' ? '7,150' : '2,450'}
              readOnly
            />
            <span>₹ / qtl</span>
          </label>

          <button
            className="primary-action"
            onClick={() =>
              onOpenNetProfitModal(
                quickCrop,
                quickQty,
                quickCrop === 'Soybean' ? 5080 : quickCrop === 'Cotton' ? 7150 : 2450
              )
            }
          >
            <Calculator size={16} />
            <span>{t('calculate')}</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
