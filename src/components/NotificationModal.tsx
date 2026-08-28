import React from 'react'
import { X, Bell, TrendingUp, ShoppingBag, CheckCircle, CloudRain, Check } from 'lucide-react'
import { NotificationItem, Language } from '../types'
import { getTranslation } from '../i18n/translations'

interface NotificationModalProps {
  isOpen: boolean
  notifications: NotificationItem[]
  onClose: () => void
  onMarkAllAsRead: () => void
  onSelectNotification: (notif: NotificationItem) => void
  language: Language
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
  onSelectNotification,
  language,
}) => {
  const t = (key: string) => getTranslation(language, key)

  if (!isOpen) return null

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'price_spike':
        return <TrendingUp size={16} className="text-green" />
      case 'offer':
        return <ShoppingBag size={16} className="text-orange" />
      case 'payment':
        return <CheckCircle size={16} className="text-blue" />
      case 'weather':
        return <CloudRain size={16} className="text-purple" />
      default:
        return <Bell size={16} />
    }
  }

  return (
    <div className="notif-dropdown-overlay" onClick={onClose}>
      <div className="notif-dropdown-box" onClick={(e) => e.stopPropagation()}>
        <div className="notif-dropdown-header">
          <div className="notif-title-wrap">
            <Bell size={16} />
            <strong>{t('notifications')}</strong>
          </div>
          <div className="notif-head-actions">
            <button className="mark-read-btn" onClick={onMarkAllAsRead}>
              <Check size={14} /> Mark all read
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="notif-list-body">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item-row ${n.read ? 'read' : 'unread'}`}
                onClick={() => {
                  onSelectNotification(n)
                  onClose()
                }}
              >
                <div className="notif-icon-circle">{getIcon(n.type)}</div>
                <div className="notif-item-content">
                  <div className="notif-item-top">
                    <strong>{n.title}</strong>
                    <span className="notif-time">{n.time}</span>
                  </div>
                  <p>{n.description}</p>
                </div>
                {!n.read && <span className="unread-dot" />}
              </div>
            ))
          ) : (
            <div className="empty-notifs">
              <p>{t('noNotifications')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
