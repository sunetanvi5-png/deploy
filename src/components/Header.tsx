import React from 'react'
import {
  Menu,
  Search,
  Bell,
  Mic,
  Languages,
  PlusCircle,
  TrendingUp,
} from 'lucide-react'
import type { NavTab, Language, NotificationItem, FarmerProfile } from '../types'
import { getTranslation } from '../i18n/translations'

interface HeaderProps {
  activeNav: NavTab
  setActiveNav: (tab: NavTab) => void
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  language: Language
  setLanguage: (lang: Language) => void
  notifications: NotificationItem[]
  onOpenNotifications: () => void
  onOpenVoice: () => void
  onOpenListingModal: () => void
  farmerProfile: FarmerProfile
  onShowNotice: (msg: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  menuOpen,
  setMenuOpen,
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
  notifications,
  onOpenNotifications,
  onOpenVoice,
  onOpenListingModal,
  farmerProfile,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        onShowNotice(`Searching for "${searchQuery}"`)
      }
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={22} />
        </button>

        <div className="breadcrumb-nav">
          <span className="crumb-root" onClick={() => setActiveNav('Overview')}>KisanSetu</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{t(activeNav.toLowerCase().replace(/ & /g, '').replace(/ /g, '')) || activeNav}</span>
        </div>

        {/* Live Mandi Ticker Pill */}
        <div className="live-ticker-pill" onClick={() => setActiveNav('Market prices')} title="View live Mandi rates">
          <span className="live-pulse-dot" />
          <TrendingUp size={14} className="ticker-icon" />
          <span className="ticker-text">Hingna Soybean: <strong>₹5,080/qtl</strong> <em className="ticker-up">+₹90</em></span>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Global Search Bar */}
        <div className="search-bar-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('searchPlaceholder')}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Voice Prompt Button */}
        <button
          className="icon-action-btn voice-btn"
          onClick={onOpenVoice}
          title="Voice Assistant (आवाज सहाय्य)"
        >
          <Mic size={18} />
          <span className="btn-label-desktop">आवाज सहाय्य</span>
        </button>

        {/* List Produce Fast Action */}
        <button
          className="primary-action-pill"
          onClick={onOpenListingModal}
          title={t('listProduce')}
        >
          <PlusCircle size={16} />
          <span>{t('listProduce')}</span>
        </button>

        {/* Language Select Dropdown / Toggle */}
        <div className="lang-menu-dropdown">
          <button
            className="icon-action-btn lang-btn"
            onClick={() => {
              const next = language === 'मराठी' ? 'हिन्दी' : language === 'हिन्दी' ? 'English' : 'मराठी'
              setLanguage(next)
              onShowNotice(`भाषा बदलली: ${next}`)
            }}
            title="Change Language (भाषा बदला)"
          >
            <Languages size={18} />
            <span className="current-lang-code">{language.slice(0, 3)}</span>
          </button>
        </div>

        {/* Notification Bell */}
        <button
          className="icon-action-btn notif-btn"
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          title={t('notifications')}
        >
          <Bell size={19} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        {/* Farmer Avatar */}
        <button
          className="farmer-avatar-btn"
          onClick={() => setActiveNav('Settings')}
          title="Farmer Profile & Settings"
        >
          {farmerProfile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </button>
      </div>
    </header>
  )
}
