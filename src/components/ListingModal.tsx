import React, { useState } from 'react'
import { X, Sprout, CheckCircle2, Sparkles, AlertCircle, MapPin } from 'lucide-react'
import { Language, ProduceListing } from '../types'
import { getTranslation } from '../i18n/translations'

interface ListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (listing: Omit<ProduceListing, 'id' | 'offersCount' | 'status'>) => void
  language: Language
}

const CROP_OPTIONS = [
  { name: 'Soybean', varieties: ['JS 335', 'JS 9305', 'DS 228', 'NRC 37'], avgPrice: 5080, code: 'soybean' },
  { name: 'Cotton', varieties: ['Bt Cotton Hybrid', 'Ajeet 155', 'RCH 2'], avgPrice: 7150, code: 'cotton' },
  { name: 'Wheat', varieties: ['Lokwan Golden', 'Sharbati', 'GW 496'], avgPrice: 2450, code: 'wheat' },
  { name: 'Gram (Chana)', varieties: ['Vijay', 'Digvijay', 'Jaki 9218'], avgPrice: 6150, code: 'chana' },
  { name: 'Maize', varieties: ['Kaveri 50', 'Pioneer 3302', 'HQPM 1'], avgPrice: 2180, code: 'maize' },
  { name: 'Onion', varieties: ['Nashik Red', 'Garwa', 'Bhima Super'], avgPrice: 2800, code: 'onion' },
]

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [selectedCrop, setSelectedCrop] = useState(CROP_OPTIONS[0])
  const [variety, setVariety] = useState(CROP_OPTIONS[0].varieties[0])
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C' | 'Premium'>('Grade A')
  const [quantity, setQuantity] = useState<number>(30)
  const [expectedPrice, setExpectedPrice] = useState<number>(5100)
  const [harvestDate, setHarvestDate] = useState<string>('Ready for Immediate Dispatch')
  const [location, setLocation] = useState<string>('Hingna Farm Warehouse, Nagpur')
  const [moisturePercent, setMoisturePercent] = useState<number>(9.5)
  const [notes, setNotes] = useState<string>('Cleaned, graded, packed in standard 50kg bags.')
  const [packaging, setPackaging] = useState<string>('50kg Jute Gunny Bags')

  if (!isOpen) return null

  const handleCropChange = (cropName: string) => {
    const found = CROP_OPTIONS.find((c) => c.name === cropName) || CROP_OPTIONS[0]
    setSelectedCrop(found)
    setVariety(found.varieties[0])
    setExpectedPrice(found.avgPrice)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      crop: selectedCrop.name,
      variety,
      grade,
      quantity: Number(quantity) || 10,
      unit: 'quintals',
      available: harvestDate,
      expectedPrice: Number(expectedPrice) || selectedCrop.avgPrice,
      moisturePercent: Number(moisturePercent) || 10,
      harvestDate: new Date().toISOString().split('T')[0],
      location,
      imageCode: selectedCrop.code as any,
      notes: `${notes} Packaging: ${packaging}`,
    })
    onClose()
  }

  const estimatedTotal = (Number(quantity) || 0) * (Number(expectedPrice) || 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <Sprout size={20} />
          </div>
          <div>
            <h3>{t('addNewProduce')}</h3>
            <p>Connect directly with 100+ verified corporate & local buyers</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          {/* Crop & Variety Selection */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>{t('cropType')}</label>
              <select
                value={selectedCrop.name}
                onChange={(e) => handleCropChange(e.target.value)}
                className="form-input"
              >
                {CROP_OPTIONS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} (Avg: ₹{c.avgPrice}/qtl)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('variety')}</label>
              <select
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="form-input"
              >
                {selectedCrop.varieties.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity & Grade */}
          <div className="form-grid-3">
            <div className="form-group">
              <label>{t('quantityQuintals')}</label>
              <div className="input-with-affix">
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="form-input"
                  required
                />
                <span className="input-affix">qtl</span>
              </div>
            </div>

            <div className="form-group">
              <label>{t('grade')}</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="form-input"
              >
                <option value="Premium">Premium (+5% Premium)</option>
                <option value="Grade A">Grade A (Standard)</option>
                <option value="Grade B">Grade B (Fair)</option>
                <option value="Grade C">Grade C (Commercial)</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('moisturePercent')}</label>
              <div className="input-with-affix">
                <input
                  type="number"
                  min="5"
                  max="25"
                  step="0.1"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="form-input"
                />
                <span className="input-affix">%</span>
              </div>
            </div>
          </div>

          {/* Expected Price & Market Benchmark */}
          <div className="form-group highlight-box">
            <div className="price-label-row">
              <label>{t('expectedPricePerQtl')}</label>
              <span className="benchmark-tag">
                <Sparkles size={12} /> Today's Modal Mandi Benchmark: ₹{selectedCrop.avgPrice}/qtl
              </span>
            </div>
            <div className="input-with-affix price-input-wrap">
              <span className="rupee-symbol">₹</span>
              <input
                type="number"
                min="500"
                step="10"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="form-input price-input"
                required
              />
              <span className="input-affix">/ quintal</span>
            </div>
            <div className="estimated-total-bar">
              <span>Estimated Gross Value ({quantity} qtl):</span>
              <strong>₹{estimatedTotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Location & Availability */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>{t('farmLocation')}</label>
              <div className="input-with-icon">
                <MapPin size={16} className="field-icon" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('harvestDate')}</label>
              <select
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="form-input"
              >
                <option value="Ready for Immediate Dispatch">Ready for Immediate Dispatch</option>
                <option value="Available in 3-5 Days">Available in 3-5 Days</option>
                <option value="Upcoming Harvest (10-15 Days)">Upcoming Harvest (10-15 Days)</option>
              </select>
            </div>
          </div>

          {/* Notes & Quality assurance */}
          <div className="form-group">
            <label>{t('notesDescription')}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Grain is well cleaned, 0% sand stones, dry storage"
              className="form-input"
            />
          </div>

          <div className="escrow-badge-note">
            <CheckCircle2 size={16} className="text-green" />
            <span>KisanSetu Guarantee: Guaranteed 100% Escrow payment protection on all deals.</span>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Sprout size={16} />
              {t('submitListing')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
