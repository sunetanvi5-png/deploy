import React, { useState, useEffect } from 'react'
import './App.css'
import {
  Language,
  NavTab,
  ProduceListing,
  MandiPrice,
  BuyerOffer,
  OrderTransaction,
  FarmerProfile,
  NotificationItem,
} from './types'
import {
  initialFarmerProfile,
  initialProduceListings,
  initialMandiPrices,
  initialBuyerOffers,
  initialOrders,
  initialNotifications,
} from './data/mockData'
import { getTranslation } from './i18n/translations'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { ListingModal } from './components/ListingModal'
import { OfferActionModal } from './components/OfferActionModal'
import { ChatDrawer } from './components/ChatDrawer'
import { VoiceAssistantModal } from './components/VoiceAssistantModal'
import { NetProfitModal } from './components/NetProfitModal'
import { NotificationModal } from './components/NotificationModal'

// Views
import { OverviewView } from './views/OverviewView'
import { ProduceView } from './views/ProduceView'
import { MarketPricesView } from './views/MarketPricesView'
import { BuyerOffersView } from './views/BuyerOffersView'
import { OrdersView } from './views/OrdersView'
import { HelpSupportView } from './views/HelpSupportView'
import { SettingsView } from './views/SettingsView'

// Lucide icons
import {
  Sprout,
  ArrowRight,
  Volume2,
  CheckCircle,
  ChevronDown,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react'

export function App() {
  // App Setup & Auth State
  const [languageSelected, setLanguageSelected] = useState<boolean>(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)
  const [loginStep, setLoginStep] = useState<'mobile' | 'otp'>('mobile')
  const [mobile, setMobile] = useState<string>('9876543210')
  const [otp, setOtp] = useState<string>('')
  const [language, setLanguage] = useState<Language>('मराठी')
  const [activeNav, setActiveNav] = useState<NavTab>('Overview')
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [notice, setNotice] = useState<string>('')

  // Domain Data State
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(initialFarmerProfile)
  const [listings, setListings] = useState<ProduceListing[]>(initialProduceListings)
  const [prices, setPrices] = useState<MandiPrice[]>(initialMandiPrices)
  const [offers, setOffers] = useState<BuyerOffer[]>(initialBuyerOffers)
  const [orders, setOrders] = useState<OrderTransaction[]>(initialOrders)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)

  // Modals & Drawers State
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false)
  const [netProfitModalConfig, setNetProfitModalConfig] = useState<{
    isOpen: boolean
    crop: string
    qty: number
    price: number
  }>({
    isOpen: false,
    crop: 'Soybean',
    qty: 25,
    price: 5080,
  })
  const [offerActionConfig, setOfferActionConfig] = useState<{
    isOpen: boolean
    mode: 'accept' | 'counter' | 'decline'
    offer: BuyerOffer | null
  }>({
    isOpen: false,
    mode: 'accept',
    offer: null,
  })
  const [chatDrawerOffer, setChatDrawerOffer] = useState<BuyerOffer | null>(null)

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3500)
  }

  const t = (key: string) => getTranslation(language, key)

  // Auth Handlers
  const handleRequestOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return showNotice('कृपया १० अंकी वैध मोबाईल नंबर टाका (Enter valid 10-digit mobile)')
    }
    setLoginStep('otp')
    showNotice('Demo OTP: 1234')
  }

  const handleVerifyOtp = () => {
    if (otp !== '1234') {
      return showNotice('अवैध OTP! चाचणीसाठी १२३४ वापरा (Invalid OTP! Use 1234 for demo)')
    }
    setIsLoggedIn(true)
    showNotice(`Welcome to KisanSetu, ${farmerProfile.name}!`)
  }

  // Domain Actions: Produce Listings
  const handleCreateListing = (newListingData: Omit<ProduceListing, 'id' | 'offersCount' | 'status'>) => {
    const newId = `listing-${Date.now()}`
    const newListing: ProduceListing = {
      ...newListingData,
      id: newId,
      offersCount: 0,
      status: 'active',
      bestOffer: undefined,
    }
    setListings([newListing, ...listings])
    showNotice(`नवीन शेतमाल (${newListing.crop}) विक्रीसाठी नोंदवला गेला!`)

    // Simulate an automated instant buyer quote after 2 seconds
    setTimeout(() => {
      const generatedOffer: BuyerOffer = {
        id: `offer-auto-${Date.now()}`,
        buyerName: 'Vidarbha Agro Mills',
        companyName: 'Nagpur Agro Sourcing Unit',
        initials: 'VA',
        avatarColor: '#547f63',
        listingId: newId,
        crop: newListing.crop,
        quantity: newListing.quantity,
        unit: 'quintals',
        price: (newListing.expectedPrice || 5000) + 30,
        originalListingPrice: newListing.expectedPrice,
        verified: true,
        rating: 4.8,
        dealsCount: 94,
        paymentTerms: '100% Escrow deposit before truck dispatch',
        pickupLocation: 'Farm-gate pickup',
        validUntil: 'Today 8:00 PM',
        status: 'pending',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'buyer',
            text: `Namaste Suresh ji. We are offering ₹${(newListing.expectedPrice || 5000) + 30}/qtl for your new lot of ${newListing.crop}.`,
            time: 'Just now',
          },
        ],
      }
      setOffers((prev) => [generatedOffer, ...prev])
      setListings((prev) =>
        prev.map((l) =>
          l.id === newId
            ? { ...l, offersCount: l.offersCount + 1, bestOffer: generatedOffer.price }
            : l
        )
      )
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `New Buyer Bid for ${newListing.crop}`,
          description: `Vidarbha Agro Mills placed a bid of ₹${generatedOffer.price}/qtl.`,
          time: 'Just now',
          type: 'offer',
          read: false,
        },
        ...prev,
      ])
      showNotice(`नवीन बोली प्राप्त झाली! Vidarbha Agro Mills: ₹${generatedOffer.price}/qtl`)
    }, 2500)
  }

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter((l) => l.id !== id))
    showNotice('Listing removed.')
  }

  const handleMarkAsSold = (id: string) => {
    setListings(listings.map((l) => (l.id === id ? { ...l, status: 'sold' } : l)))
    showNotice('Batch marked as sold.')
  }

  // Domain Actions: Buyer Offers Negotiation & Acceptance
  const handleAcceptOffer = (offerId: string) => {
    const targetOffer = offers.find((o) => o.id === offerId)
    if (!targetOffer) return

    setOffers(offers.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o)))

    // Generate Order Transaction
    const newOrder: OrderTransaction = {
      id: `ord-${Date.now()}`,
      orderCode: `KS-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      offerId: targetOffer.id,
      buyerName: targetOffer.buyerName,
      crop: targetOffer.crop,
      grade: 'Grade A',
      quantity: targetOffer.quantity,
      unit: targetOffer.unit,
      ratePerQtl: targetOffer.price,
      totalAmount: targetOffer.quantity * targetOffer.price,
      advancePaid: Math.round(targetOffer.quantity * targetOffer.price * 0.2),
      balanceAmount: Math.round(targetOffer.quantity * targetOffer.price * 0.8),
      orderDate: new Date().toISOString().split('T')[0],
      pickupDate: 'In 2 Days',
      status: 'payment_escrow',
      paymentStatus: 'Payment Escrowed',
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    }

    setOrders([newOrder, ...orders])

    // Update listing status
    setListings(
      listings.map((l) => (l.id === targetOffer.listingId ? { ...l, status: 'under_deal' } : l))
    )

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: `Deal Confirmed: ${targetOffer.crop}`,
        description: `Escrow deposit of ₹${newOrder.totalAmount.toLocaleString('en-IN')} is secured. Order ${newOrder.orderCode} generated.`,
        time: 'Just now',
        type: 'payment',
        read: false,
      },
      ...notifications,
    ])

    showNotice(`Deal Accepted! ₹${newOrder.totalAmount.toLocaleString('en-IN')} secured in Escrow.`)
    setActiveNav('Orders & payments')
  }

  const handleCounterOffer = (offerId: string, counterPrice: number, note: string) => {
    setOffers(
      offers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'countered',
              counterPrice,
              counterNote: note,
              messages: [
                ...(o.messages || []),
                {
                  id: `msg-${Date.now()}`,
                  sender: 'farmer',
                  text: `Counter Proposal: ₹${counterPrice}/qtl. Note: ${note}`,
                  time: 'Just now',
                },
              ],
            }
          : o
      )
    )
    showNotice(`Counter offer of ₹${counterPrice}/qtl sent to buyer!`)
  }

  const handleDeclineOffer = (offerId: string) => {
    setOffers(offers.map((o) => (o.id === offerId ? { ...o, status: 'declined' } : o)))
    showNotice('Offer declined.')
  }

  // Chat message send handler
  const handleSendMessage = (offerId: string, text: string) => {
    setOffers((prevOffers) =>
      prevOffers.map((o) => {
        if (o.id === offerId) {
          const updatedMessages = [
            ...(o.messages || []),
            {
              id: `msg-${Date.now()}`,
              sender: 'farmer' as const,
              text,
              time: 'Just now',
            },
          ]
          const updatedOffer = { ...o, messages: updatedMessages }
          if (chatDrawerOffer && chatDrawerOffer.id === offerId) {
            setChatDrawerOffer(updatedOffer)
          }
          return updatedOffer
        }
        return o
      })
    )

    // Simulate buyer auto-reply after 1.5s
    setTimeout(() => {
      setOffers((prevOffers) =>
        prevOffers.map((o) => {
          if (o.id === offerId) {
            const autoReply = [
              ...(o.messages || []),
              {
                id: `msg-rep-${Date.now()}`,
                sender: 'buyer' as const,
                text: 'Thank you Suresh ji. Our local logistics coordinator is confirming the schedule.',
                time: 'Just now',
              },
            ]
            const updatedOffer = { ...o, messages: autoReply }
            if (chatDrawerOffer && chatDrawerOffer.id === offerId) {
              setChatDrawerOffer(updatedOffer)
            }
            return updatedOffer
          }
          return o
        })
      )
    }, 1500)
  }

  // Notifications mark all read
  const handleMarkAllNotifsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    showNotice('All notifications marked as read.')
  }

  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.type === 'offer') setActiveNav('Buyer offers')
    else if (notif.type === 'payment') setActiveNav('Orders & payments')
    else if (notif.type === 'price_spike') setActiveNav('Market prices')
    else if (notif.type === 'weather') setActiveNav('Help & support')
  }

  // 1. Language Selection Screen (Initial Splash if not chosen)
  if (!languageSelected) {
    return (
      <div className="language-screen">
        <div className="language-art">
          <div className="brand-mark">
            <Sprout size={20} />
          </div>
          <h1>
            Kisan<span>Setu</span>
          </h1>
          <p>
            Better markets. Better choices.
            <br />A fairer harvest for every farmer.
          </p>
          <div className="language-field">✦</div>
        </div>

        <div className="language-picker">
          <p className="eyebrow">WELCOME TO KISANSETU</p>
          <h2>Choose your language</h2>
          <p className="language-subtitle">आपली भाषा निवडा / अपनी भाषा चुनें</p>

          <div className="language-options">
            {(['मराठी', 'हिन्दी', 'English'] as Language[]).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setLanguage(option)
                  setLanguageSelected(true)
                  showNotice(`${option} निवडली`)
                }}
              >
                <span>{option === 'मराठी' ? 'अ' : option === 'हिन्दी' ? 'अा' : 'Aa'}</span>
                <strong>{option}</strong>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>

          <p className="language-footer">
            <Volume2 size={15} /> Voice assistance is available after login
          </p>
        </div>

        {notice && (
          <div className="toast">
            <CheckCircle size={16} /> {notice}
          </div>
        )}
      </div>
    )
  }

  // 2. Authentication Screen (Mobile OTP & Instant Demo Login)
  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-art">
          <div className="login-sun" />
          <div className="field-line line-one" />
          <div className="field-line line-two" />
          <div className="login-plant">✦</div>
          <div className="login-copy">
            <div className="brand-mark">
              <Sprout size={20} />
            </div>
            <h1>
              Kisan<span>Setu</span>
            </h1>
            <p>
              Direct farmer-to-buyer electronic marketplace.
              <br />Zero middleman commission. Guaranteed Escrow payment.
            </p>
          </div>
          <div className="login-art-footer">
            <span>LOCAL APMC MARKETS</span>
            <span>VERIFIED BUYERS</span>
            <span>100% ESCROW PROTECTION</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-language">
            <span>भाषा / Language</span>
            <button
              type="button"
              onClick={() => {
                const next = language === 'मराठी' ? 'हिन्दी' : language === 'हिन्दी' ? 'English' : 'मराठी'
                setLanguage(next)
                showNotice(`Language: ${next}`)
              }}
            >
              {language}
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="login-heading">
            <p className="eyebrow">FARMER ACCESS PORTAL</p>
            <h2>{loginStep === 'mobile' ? 'Welcome to KisanSetu' : 'Verify One-Time Password'}</h2>
            <p>
              {loginStep === 'mobile'
                ? 'Sign in with your mobile number to view live Mandi bhav and buyer bids.'
                : `We sent a 4-digit demo OTP to +91 ${mobile}`}
            </p>
          </div>

          {loginStep === 'mobile' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRequestOtp()
              }}
            >
              <label>
                Registered Mobile Number
                <div className="mobile-input">
                  <span>+91</span>
                  <input
                    autoFocus
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    inputMode="numeric"
                  />
                </div>
              </label>

              <button className="login-button" type="submit">
                <span>Send OTP</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="demo-login"
                type="button"
                onClick={() => {
                  setMobile('9876543210')
                  setIsLoggedIn(true)
                  showNotice('Demo login successful: Welcome Shri. Suresh Patil')
                }}
              >
                <strong>⚡ Instant Demo Login</strong>
                <span>Open demo farmer account · Suresh Patil (Nagpur)</span>
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleVerifyOtp()
              }}
            >
              <label>
                Enter 4-Digit OTP
                <input
                  className="otp-input"
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 1234"
                  inputMode="numeric"
                />
              </label>

              <button className="login-button" type="submit">
                <span>Verify & Enter Dashboard</span>
                <CheckCircle size={16} />
              </button>

              <button
                className="back-button"
                type="button"
                onClick={() => setLoginStep('mobile')}
              >
                Change mobile number
              </button>
            </form>
          )}

          <div className="login-note">
            <span>🔒</span> Protected by KisanSetu Digital Security. We never ask for your bank PIN or OTP.
          </div>

          <p className="login-help">
            Need assistance?{' '}
            <button
              type="button"
              onClick={() => showNotice('Connecting to Mandi Coordinator: 1800-123-456')}
            >
              Talk to a local coordinator
            </button>
          </p>
        </div>
      </div>
    )
  }

  // 3. Main Application Shell
  const pendingOffersCount = offers.filter((o) => o.status === 'pending').length

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        language={language}
        setLanguage={setLanguage}
        pendingOffersCount={pendingOffersCount}
        farmerProfile={farmerProfile}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onShowNotice={showNotice}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navigation Header */}
        <Header
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          language={language}
          setLanguage={setLanguage}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenVoice={() => setIsVoiceModalOpen(true)}
          onOpenListingModal={() => setIsListingModalOpen(true)}
          farmerProfile={farmerProfile}
          onShowNotice={showNotice}
        />

        {/* Dynamic View Routing */}
        <section className="content-wrap">
          {activeNav === 'Overview' && (
            <OverviewView
              language={language}
              setActiveNav={setActiveNav}
              listings={listings}
              prices={prices}
              offers={offers}
              orders={orders}
              farmerProfile={farmerProfile}
              onOpenListingModal={() => setIsListingModalOpen(true)}
              onOpenNetProfitModal={(c, q, p) =>
                setNetProfitModalConfig({
                  isOpen: true,
                  crop: c || 'Soybean',
                  qty: q || 25,
                  price: p || 5080,
                })
              }
              onOpenOfferAction={(offer, mode) =>
                setOfferActionConfig({ isOpen: true, mode, offer })
              }
              onOpenChat={(offer) => setChatDrawerOffer(offer)}
              onShowNotice={showNotice}
            />
          )}

          {activeNav === 'My produce' && (
            <ProduceView
              language={language}
              listings={listings}
              setActiveNav={setActiveNav}
              onOpenListingModal={() => setIsListingModalOpen(true)}
              onOpenNetProfitModal={(c, q, p) =>
                setNetProfitModalConfig({
                  isOpen: true,
                  crop: c || 'Soybean',
                  qty: q || 25,
                  price: p || 5080,
                })
              }
              onDeleteListing={handleDeleteListing}
              onMarkAsSold={handleMarkAsSold}
              onShowNotice={showNotice}
            />
          )}

          {activeNav === 'Market prices' && (
            <MarketPricesView
              language={language}
              prices={prices}
              onOpenNetProfitModal={(c, q, p) =>
                setNetProfitModalConfig({
                  isOpen: true,
                  crop: c || 'Soybean',
                  qty: q || 25,
                  price: p || 5080,
                })
              }
              onShowNotice={showNotice}
            />
          )}

          {activeNav === 'Buyer offers' && (
            <BuyerOffersView
              language={language}
              offers={offers}
              setActiveNav={setActiveNav}
              onOpenOfferAction={(offer, mode) =>
                setOfferActionConfig({ isOpen: true, mode, offer })
              }
              onOpenChat={(offer) => setChatDrawerOffer(offer)}
              onShowNotice={showNotice}
            />
          )}

          {activeNav === 'Orders & payments' && (
            <OrdersView
              language={language}
              orders={orders}
              farmerProfile={farmerProfile}
              onShowNotice={showNotice}
            />
          )}

          {activeNav === 'Help & support' && (
            <HelpSupportView language={language} onShowNotice={showNotice} />
          )}

          {activeNav === 'Settings' && (
            <SettingsView
              language={language}
              setLanguage={setLanguage}
              farmerProfile={farmerProfile}
              onUpdateProfile={(updated) => setFarmerProfile(updated)}
              onLogout={() => {
                setIsLoggedIn(false)
                setLoginStep('mobile')
                showNotice('Logged out successfully.')
              }}
              onShowNotice={showNotice}
            />
          )}
        </section>
      </main>

      {/* Produce Listing Creation Modal */}
      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        onSubmit={handleCreateListing}
        language={language}
      />

      {/* Offer Negotiation & Acceptance Modal */}
      <OfferActionModal
        isOpen={offerActionConfig.isOpen}
        mode={offerActionConfig.mode}
        offer={offerActionConfig.offer}
        onClose={() => setOfferActionConfig({ isOpen: false, mode: 'accept', offer: null })}
        onAccept={handleAcceptOffer}
        onCounter={handleCounterOffer}
        onDecline={handleDeclineOffer}
        language={language}
      />

      {/* Buyer Direct Chat Drawer */}
      <ChatDrawer
        isOpen={!!chatDrawerOffer}
        offer={chatDrawerOffer}
        onClose={() => setChatDrawerOffer(null)}
        onSendMessage={handleSendMessage}
        onShowNotice={showNotice}
        language={language}
      />

      {/* Interactive Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onSelectAction={(actionKey) => {
          if (
            [
              'Overview',
              'My produce',
              'Market prices',
              'Buyer offers',
              'Orders & payments',
              'Help & support',
              'Settings',
            ].includes(actionKey)
          ) {
            setActiveNav(actionKey as NavTab)
          }
        }}
      />

      {/* Net Payout Calculator Modal */}
      <NetProfitModal
        isOpen={netProfitModalConfig.isOpen}
        onClose={() => setNetProfitModalConfig({ ...netProfitModalConfig, isOpen: false })}
        language={language}
        defaultCrop={netProfitModalConfig.crop}
        defaultQuantity={netProfitModalConfig.qty}
        defaultPrice={netProfitModalConfig.price}
      />

      {/* Notifications Dropdown Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onSelectNotification={handleSelectNotification}
        language={language}
      />

      {/* Global Toast Notification */}
      {notice && (
        <div className="toast">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}
    </div>
  )
}

export default App
