import React, { useState } from 'react'
import { X, Calculator, IndianRupee, Truck, ShieldAlert, Sparkles, Check, ArrowUpRight } from 'lucide-react'
import { Language } from '../types'
import { getTranslation } from '../i18n/translations'

interface NetProfitModalProps {
  isOpen: boolean
  onClose: () => void
  language: Language
  defaultCrop?: string
  defaultQuantity?: number
  defaultPrice?: number
}

export const NetProfitModal: React.FC<NetProfitModalProps> = ({
  isOpen,
  onClose,
  language,
  defaultCrop = 'Soybean',
  defaultQuantity = 25,
  defaultPrice = 5080,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [crop, setCrop] = useState(defaultCrop)
  const [quantity, setQuantity] = useState<number>(defaultQuantity)
  const [sellingPrice, setSellingPrice] = useState<number>(defaultPrice)
  const [distanceKm, setDistanceKm] = useState<number>(18)
  const [transportRatePerKm, setTransportRatePerKm] = useState<number>(35)
  const [channel, setChannel] = useState<'kisansetu' | 'traditional'>('kisansetu')
  const [moistureDiscountPercent, setMoistureDiscountPercent] = useState<number>(0)

  if (!isOpen) return null

  const grossIncome = quantity * sellingPrice
  const transportCost = channel === 'kisansetu' ? 0 : Math.round(distanceKm * transportRatePerKm) // In KisanSetu, buyer picks up or subsidizes
  const mandiCess = channel === 'kisansetu' ? 0 : Math.round((grossIncome * 1.05) / 100)
  const commission = channel === 'kisansetu' ? 0 : Math.round((grossIncome * 2.0) / 100) // 2% commission in regular Mandi
  const loadingPackaging = Math.round(quantity * (channel === 'kisansetu' ? 20 : 35))
  const moistureDeduction = Math.round((grossIncome * moistureDiscountPercent) / 100)

  const totalDeductions = transportCost + mandiCess + commission + loadingPackaging + moistureDeduction
  const netTakeHome = Math.max(0, grossIncome - totalDeductions)
  const netRatePerQtl = quantity > 0 ? Math.round(netTakeHome / quantity) : 0

  // Traditional Mandi Comparison calculation
  const traditionalTransport = Math.round(distanceKm * transportRatePerKm)
  const traditionalCess = Math.round((grossIncome * 1.05) / 100)
  const traditionalCommission = Math.round((grossIncome * 2.0) / 100)
  const traditionalLoading = Math.round(quantity * 35)
  const traditionalDeductions = traditionalTransport + traditionalCess + traditionalCommission + traditionalLoading + moistureDeduction
  const traditionalTakeHome = Math.max(0, grossIncome - traditionalDeductions)

  const extraSaved = netTakeHome - traditionalTakeHome

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container calc-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon orange-bg">
            <Calculator size={20} />
          </div>
          <div>
            <h3>{t('quickProfitCheck')}</h3>
            <p>{t('takeHomeSubtitle')}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="calc-modal-body">
          {/* Selling Channel Selector */}
          <div className="channel-switch-container">
            <button
              type="button"
              className={`channel-pill ${channel === 'kisansetu' ? 'active' : ''}`}
              onClick={() => setChannel('kisansetu')}
            >
              <Sparkles size={14} />
              <span>Direct KisanSetu Buyer (Zero Commission)</span>
            </button>
            <button
              type="button"
              className={`channel-pill ${channel === 'traditional' ? 'active' : ''}`}
              onClick={() => setChannel('traditional')}
            >
              <Truck size={14} />
              <span>Traditional Physical Mandi (With Cess & Middlemen)</span>
            </button>
          </div>

          <div className="calc-grid-layout">
            {/* Input Column */}
            <div className="calc-inputs-col">
              <div className="form-group">
                <label>{t('cropType')}</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="form-input"
                >
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Wheat">Wheat (गहू / गेहूं)</option>
                  <option value="Cotton">Cotton (कापूस / कपास)</option>
                  <option value="Gram">Gram (हरभरा / चना)</option>
                  <option value="Maize">Maize (मका / मक्का)</option>
                  <option value="Onion">Onion (कांदा / प्याज)</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>{t('quantityQuintals')}</label>
                  <div className="input-with-affix">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="form-input"
                    />
                    <span className="input-affix">qtl</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mandi Rate (₹/qtl)</label>
                  <div className="input-with-affix">
                    <span className="rupee-symbol">₹</span>
                    <input
                      type="number"
                      min="100"
                      step="10"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mandi Distance</label>
                  <div className="input-with-affix">
                    <input
                      type="number"
                      min="0"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(Number(e.target.value))}
                      className="form-input"
                    />
                    <span className="input-affix">km</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Moisture Penalty</label>
                  <div className="input-with-affix">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={moistureDiscountPercent}
                      onChange={(e) => setMoistureDiscountPercent(Number(e.target.value))}
                      className="form-input"
                    />
                    <span className="input-affix">%</span>
                  </div>
                </div>
              </div>

              {channel === 'kisansetu' && (
                <div className="savings-highlight-badge">
                  <Sparkles size={16} />
                  <div>
                    <strong>KisanSetu Direct Benefit:</strong>
                    <span>You save ₹{extraSaved.toLocaleString('en-IN')} in transport & mandi middleman fees!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="calc-summary-col">
              <div className="calc-result-card">
                <span className="result-label">Net In-Hand Take-Home Payout</span>
                <h2 className="result-amount">₹{netTakeHome.toLocaleString('en-IN')}</h2>
                <div className="net-rate-badge">
                  Effective Rate: <strong>₹{netRatePerQtl.toLocaleString('en-IN')} / quintal</strong>
                </div>

                <div className="calc-breakdown-list">
                  <div className="breakdown-row">
                    <span>Gross Sales Value ({quantity} qtl × ₹{sellingPrice})</span>
                    <strong>₹{grossIncome.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="breakdown-row deduction">
                    <span>Transport / Logistics Cost ({channel === 'kisansetu' ? 'Farm pickup' : `${distanceKm} km`})</span>
                    <span>− ₹{transportCost.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="breakdown-row deduction">
                    <span>Mandi Cess & Market Tax ({channel === 'kisansetu' ? 'Waived' : '1.05%'})</span>
                    <span>− ₹{mandiCess.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="breakdown-row deduction">
                    <span>Arhatiya / Agent Commission ({channel === 'kisansetu' ? '0%' : '2%'})</span>
                    <span>− ₹{commission.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="breakdown-row deduction">
                    <span>Loading, Hamali & Bagging</span>
                    <span>− ₹{loadingPackaging.toLocaleString('en-IN')}</span>
                  </div>

                  {moistureDeduction > 0 && (
                    <div className="breakdown-row deduction">
                      <span>Moisture Discount ({moistureDiscountPercent}%)</span>
                      <span>− ₹{moistureDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="breakdown-row total-deduction">
                    <span>Total Deductions & Expenses</span>
                    <strong>− ₹{totalDeductions.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Close Calculator
            </button>
            <button type="button" onClick={onClose} className="btn-primary">
              <Check size={16} /> Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
