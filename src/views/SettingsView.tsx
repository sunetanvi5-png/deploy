import React, { useState } from 'react'
import {
  Settings,
  User,
  Building,
  ShieldCheck,
  Bell,
  Languages,
  LogOut,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  FileCheck,
} from 'lucide-react'
import { Language, FarmerProfile } from '../types'
import { getTranslation } from '../i18n/translations'

interface SettingsViewProps {
  language: Language
  setLanguage: (lang: Language) => void
  farmerProfile: FarmerProfile
  onUpdateProfile: (updated: FarmerProfile) => void
  onLogout: () => void
  onShowNotice: (msg: string) => void
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  setLanguage,
  farmerProfile,
  onUpdateProfile,
  onLogout,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [name, setName] = useState(farmerProfile.name)
  const [village, setVillage] = useState(farmerProfile.village)
  const [landAcres, setLandAcres] = useState(farmerProfile.landHoldingAcres)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [whatsappAlerts, setWhatsappAlerts] = useState(true)
  const [priceSpikeAlerts, setPriceSpikeAlerts] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateProfile({
      ...farmerProfile,
      name,
      village,
      landHoldingAcres: Number(landAcres) || 6.5,
    })
    onShowNotice('Profile and preferences updated successfully!')
  }

  return (
    <div className="view-page-container">
      {/* Page Header Banner */}
      <div className="page-header-row">
        <div>
          <p className="eyebrow">
            <Settings size={13} /> {t('settings').toUpperCase()} • FARMER PROFILE & PREFERENCES
          </p>
          <h1>{t('settings')}</h1>
          <p className="subhead">Manage your KisanSetu account, linked bank accounts, notification preferences, and verification.</p>
        </div>

        <button className="btn-logout" onClick={onLogout} title="Log out of session">
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="settings-layout-grid">
        {/* Left Column: Profile Card & KYC */}
        <div className="settings-left-col">
          <div className="profile-badge-card">
            <div className="profile-avatar-giant">
              {farmerProfile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <h3>{farmerProfile.name}</h3>
            <p>{farmerProfile.village}, {farmerProfile.district}</p>

            <div className="kyc-status-banner">
              <ShieldCheck size={18} className="text-green" />
              <div>
                <strong>Aadhaar & KYC Verified</strong>
                <small>Kisan Card: {farmerProfile.kisanCardNumber}</small>
              </div>
            </div>

            <div className="profile-quick-stats">
              <div>
                <span>Landholding</span>
                <strong>{farmerProfile.landHoldingAcres} Acres</strong>
              </div>
              <div>
                <span>Member Since</span>
                <strong>{farmerProfile.memberSince}</strong>
              </div>
            </div>
          </div>

          {/* Linked Bank Account Card */}
          <div className="bank-account-card">
            <div className="bank-head">
              <Building size={18} />
              <h4>Linked Bank Account (DBT Payouts)</h4>
            </div>
            <div className="bank-details-box">
              <p className="bank-name">{farmerProfile.bankName}</p>
              <p className="acc-number">A/c: <strong>{farmerProfile.accountMasked}</strong></p>
              <p className="ifsc">IFSC: <strong>{farmerProfile.ifscCode}</strong></p>
              <span className="direct-verified-tag">
                <CheckCircle2 size={12} /> Direct DBT Verified
              </span>
            </div>
            <button
              className="btn-change-bank"
              onClick={() => onShowNotice('To update bank details, please contact Mandi Coordinator with passbook copy.')}
            >
              Update Bank Account
            </button>
          </div>
        </div>

        {/* Right Column: Editable Forms & Preferences */}
        <div className="settings-right-col">
          <form onSubmit={handleSave} className="settings-card-form">
            <h3>Farmer Details & Land Record</h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name (as per Aadhaar / 7/12 Utara)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Registered Mobile Number</label>
                <div className="input-with-affix">
                  <span className="input-affix">+91</span>
                  <input
                    type="text"
                    value={farmerProfile.phone}
                    readOnly
                    className="form-input readonly-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Village & Taluka</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Agricultural Land (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={landAcres}
                  onChange={(e) => setLandAcres(Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Primary Cultivated Crops</label>
              <div className="crops-tags-row">
                {farmerProfile.primaryCrops.map((c, i) => (
                  <span key={i} className="crop-pref-tag">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <hr className="form-divider" />

            {/* Language Preference */}
            <h3>{t('languages') || 'Language Preference (भाषा निवड)'}</h3>
            <div className="language-pref-selector">
              {(['मराठी', 'हिन्दी', 'English'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`lang-pref-btn ${language === lang ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(lang)
                    onShowNotice(`Language set to ${lang}`)
                  }}
                >
                  <span>{lang === 'मराठी' ? 'अ' : lang === 'हिन्दी' ? 'अा' : 'Aa'}</span>
                  <strong>{lang}</strong>
                </button>
              ))}
            </div>

            <hr className="form-divider" />

            {/* Notification Preferences */}
            <h3>Notification & Price Alerts</h3>
            <div className="toggle-list">
              <label className="toggle-item-row">
                <div>
                  <strong>WhatsApp Price Spikes & Buyer Alerts</strong>
                  <p>Receive instant notifications when nearby Mandi rates rise by +₹50/qtl</p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="switch-input"
                />
              </label>

              <label className="toggle-item-row">
                <div>
                  <strong>SMS Transaction Updates</strong>
                  <p>Escrow payment deposit notifications and weighbridge slip confirmation</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="switch-input"
                />
              </label>

              <label className="toggle-item-row">
                <div>
                  <strong>Daily Morning Market Pulse</strong>
                  <p>Summary of Nagpur, Hingna & Amravati rates at 8:00 AM</p>
                </div>
                <input
                  type="checkbox"
                  checked={priceSpikeAlerts}
                  onChange={(e) => setPriceSpikeAlerts(e.target.checked)}
                  className="switch-input"
                />
              </label>
            </div>

            <div className="form-actions-bar">
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>Save All Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
