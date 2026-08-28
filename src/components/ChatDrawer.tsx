import React, { useState } from 'react'
import { X, Send, Phone, ShieldCheck, Mic, Sparkles } from 'lucide-react'
import type { Language, BuyerOffer } from '../types'
import { getTranslation } from '../i18n/translations'

interface ChatDrawerProps {
  isOpen: boolean
  offer: BuyerOffer | null
  onClose: () => void
  onSendMessage: (offerId: string, text: string) => void
  onShowNotice: (msg: string) => void
  language: Language
}

const QUICK_FARMER_TEMPLATES: Record<Language, string[]> = {
  English: [
    'Can you provide vehicle for farm-gate pickup?',
    'What is your expected moisture specification?',
    'Is the 100% Escrow deposit confirmed?',
    'When is your truck arriving in Hingna?',
  ],
  मराठी: [
    'शेत बांधावरून माल उचलण्यासाठी गाडी पाठवाल का?',
    'ओलावा (Moisture) किती टक्के अपेक्षित आहे?',
    'एस्क्रो खात्यात १००% रक्कम जमा झाली आहे का?',
    'हिंगण्यात गाडी कधी पोहोचेल?',
  ],
  हिन्दी: [
    'क्या आप खेत से माल उठाने के लिए वाहन भेजेंगे?',
    'नमी (Moisture) का क्या पैमाना रहेगा?',
    'क्या एस्क्रो में पूरा भुगतान जमा हो चुका है?',
    'गाड़ी कब तक पहुंचेगी?',
  ],
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  offer,
  onClose,
  onSendMessage,
  onShowNotice,
  language,
}) => {
  const t = (key: string) => getTranslation(language, key)
  const [inputText, setInputText] = useState('')

  if (!isOpen || !offer) return null

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(offer.id, inputText.trim())
    setInputText('')
  }

  const handleTemplateClick = (tmpl: string) => {
    onSendMessage(offer.id, tmpl)
  }

  const templates = QUICK_FARMER_TEMPLATES[language] || QUICK_FARMER_TEMPLATES['English']

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-buyer-head">
            <div className="buyer-avatar-circle" style={{ backgroundColor: offer.avatarColor }}>
              {offer.initials}
            </div>
            <div>
              <h4>{offer.buyerName}</h4>
              <p>
                {offer.companyName} • <span className="online-indicator">Online</span>
              </p>
            </div>
          </div>
          <div className="drawer-head-actions">
            <button
              className="action-circle-btn phone-btn"
              onClick={() => onShowNotice(`Calling ${offer.buyerName} at +91 98230 45890`)}
              title="Call Buyer Directly"
            >
              <Phone size={16} />
            </button>
            <button className="action-circle-btn close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Deal Context Strip */}
        <div className="drawer-deal-strip">
          <div>
            <span>Deal Produce:</span>
            <strong>{offer.crop} ({offer.quantity} {offer.unit})</strong>
          </div>
          <div>
            <span>Offer Rate:</span>
            <strong>₹{offer.price}/qtl</strong>
          </div>
          <span className="escrow-pill">
            <ShieldCheck size={12} /> Escrow Protected
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="drawer-chat-body">
          {offer.messages && offer.messages.length > 0 ? (
            offer.messages.map((msg) => {
              const isFarmer = msg.sender === 'farmer'
              return (
                <div key={msg.id} className={`chat-bubble-wrap ${isFarmer ? 'farmer-msg' : 'buyer-msg'}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="empty-chat-hint">
              <Sparkles size={24} />
              <p>Start a direct conversation with {offer.buyerName} about logistics, price, or quality.</p>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="quick-templates-section">
          <div className="quick-tmpl-title">
            <Sparkles size={12} /> Quick Farmer Prompts:
          </div>
          <div className="quick-chips-scroll">
            {templates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-chip-btn"
                onClick={() => handleTemplateClick(tmpl)}
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="drawer-input-form">
          <button
            type="button"
            className="chat-voice-btn"
            onClick={() => onShowNotice('Voice recording started... speak in your language.')}
            title="Record Voice Note"
          >
            <Mic size={18} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message or proposal..."
            className="chat-text-input"
          />
          <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
