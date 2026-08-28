import React from 'react'
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  ShoppingBag,
  ReceiptText,
  HelpCircle,
  Settings,
  Mic,
  Languages,
  ChevronRight,
  PhoneCall,
  Sparkles,
} from 'lucide-react'
import { NavTab, Language, FarmerProfile } from '../types'
import { getTranslation } from '../i18n/translations'

interface SidebarProps {
  activeNav: NavTab
  setActiveNav: (tab: NavTab) => void
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  language: Language
  setLanguage: (lang: Language) => void
  pendingOffersCount: number
  farmerProfile: FarmerProfile
  onOpenVoice: () => void
  onShowNotice: (msg: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  menuOpen,
  setMenuOpen,
  language,
  setLanguage,
  pendingOffersCount,
  farmerProfile,
  onOpenVoice,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const navItems = [
    { label: 'Overview' as NavTab, title: t('overview'), icon: LayoutDashboard },
    { label: 'My produce' as NavTab, title: t('myProduce'), icon: Sprout },
    { label: 'Market prices' as NavTab, title: t('marketPrices'), icon: TrendingUp },
    {
      label: 'Buyer offers' as NavTab,
      title: t('buyerOffers'),
      icon: ShoppingBag,
      badge: pendingOffersCount > 0 ? `${pendingOffersCount}` : undefined,
    },
    { label: 'Orders & payments' as NavTab, title: t('ordersPayments'), icon: ReceiptText },
  ]

  const nextLanguage = language === 'मराठी' ? 'हिन्दी' : language === 'हिन्दी' ? 'English' : 'मराठी'

  return (
    <aside className={`sidebar ${menuOpen ? 'menu-open' : ''}`}>
      {/* Brand Header */}
      <div className="brand" onClick={() => setActiveNav('Overview')} style={{ cursor: 'pointer' }}>
        <div className="brand-mark">
          <Sprout size={20} />
        </div>
        <div className="brand-text">
          <span className="brand-title">Kisan<span>Setu</span></span>
          <span className="brand-tagline">कृषी समृद्धी</span>
        </div>
      </div>

      {/* Farmer Profile Mini Card */}
      <div className="profile-mini" onClick={() => setActiveNav('Settings')} title="View Farmer Profile">
        <div className="avatar">
          {farmerProfile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <div className="profile-info">
          <strong>{farmerProfile.name}</strong>
          <small>{farmerProfile.village}</small>
        </div>
        <ChevronRight size={16} className="profile-arrow" />
      </div>

      {/* Main Navigation */}
      <div className="sidebar-label">MAIN MENU</div>
      <nav className="nav-list">
        {navItems.map(({ label, title, icon: Icon, badge }) => {
          const isActive = activeNav === label
          return (
            <button
              key={label}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(label)
                setMenuOpen(false)
              }}
            >
              <Icon size={18} />
              <span>{title}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-spacer" />

      {/* Voice Assistant Interactive Card */}
      <div className="voice-card" onClick={onOpenVoice}>
        <div className="voice-card-header">
          <div className="voice-icon-wrap">
            <Mic size={16} />
          </div>
          <div>
            <strong>{t('voiceAssistance')}</strong>
            <span className="voice-badge">
              <Sparkles size={11} /> AI Voice
            </span>
          </div>
        </div>
        <p>{t('voiceAssistantDesc')}</p>
        <button className="voice-trigger-btn" type="button">
          बोलून विचारा / Tap to Speak
        </button>
      </div>

      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <button
          className={`nav-item ${activeNav === 'Help & support' ? 'active' : ''}`}
          onClick={() => {
            setActiveNav('Help & support')
            setMenuOpen(false)
          }}
        >
          <HelpCircle size={18} />
          <span>{t('helpSupport')}</span>
        </button>

        <button
          className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`}
          onClick={() => {
            setActiveNav('Settings')
            setMenuOpen(false)
          }}
        >
          <Settings size={18} />
          <span>{t('settings')}</span>
        </button>
      </div>

      {/* Language Quick Toggle */}
      <div className="language-selector-box">
        <div className="lang-label">
          <Languages size={15} />
          <span>भाषा / Language</span>
        </div>
        <button
          className="lang-pill"
          onClick={() => {
            setLanguage(nextLanguage)
            onShowNotice(`Language changed to ${nextLanguage}`)
          }}
        >
          <strong>{language}</strong>
          <small>Switch to {nextLanguage}</small>
        </button>
      </div>

      {/* Call Coordinator Direct Help */}
      <a
        href="tel:1800123456"
        className="coordinator-call-btn"
        onClick={(e) => {
          e.preventDefault()
          onShowNotice('Connecting to KisanSetu Support: 1800-123-456')
        }}
      >
        <PhoneCall size={14} />
        <span>हेल्पलाइन: 1800-123-456</span>
      </a>

      <div className="sidebar-footer">
        © 2026 KisanSetu <span>•</span> Empowering Indian Farmers
      </div>
    </aside>
  )
}
