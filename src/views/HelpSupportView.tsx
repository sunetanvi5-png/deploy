import React, { useState } from 'react'
import {
  HelpCircle,
  PhoneCall,
  MessageCircle,
  Warehouse,
  CloudSun,
  ShieldCheck,
  Building2,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import type { Language } from '../types'
import { getTranslation } from '../i18n/translations'
import { nearbyWarehouses } from '../data/mockData'

interface HelpSupportViewProps {
  language: Language
  onShowNotice: (msg: string) => void
}

const FAQS: Record<Language, { q: string; a: string }[]> = {
  English: [
    {
      q: 'How does KisanSetu guarantee payment protection for farmers?',
      a: 'When you accept an offer, the buyer must deposit 100% of the deal amount into the KisanSetu Escrow Account prior to loading. Once the digital weighbridge slip is verified, funds are transferred directly to your bank account via IMPS/NEFT within 2 hours.',
    },
    {
      q: 'Do I have to pay any middleman commission or market tax?',
      a: 'No. KisanSetu is a direct farmer-to-buyer platform. We charge 0% commission to farmers. Traditional Mandi commissions (2%) and APMC cess are avoided.',
    },
    {
      q: 'Who arranges the transport and vehicle for crop pickup?',
      a: 'In most verified buyer offers, the buyer provides their own vehicle and logistics from your farm gate or local collection center. The terms are clearly marked on every offer card.',
    },
    {
      q: 'Can I get a pledge loan against stored produce in WDRA warehouses?',
      a: 'Yes! Storing your crop in MSWC/CWC approved warehouses generates an Electronic Negotiable Warehouse Receipt (e-NWR). Banks provide up to 75% loan against the value of your stored produce at subsidized 7% interest.',
    },
  ],
  मराठी: [
    {
      q: 'किसानसेतू वर शेतकऱ्यांच्या पैशांची सुरक्षितता कशी असते?',
      a: 'तुम्ही खरेदीदाराची ऑफर स्वीकारताच, खरेदीदाराला एकूण रकमेची १००% रक्कम किसानसेतू एस्क्रो खात्यात जमा करावी लागते. शेतमाल वजन झाल्यावर वजन पावती अपलोड होताच २ तासांच्या आत थेट तुमच्या बँक खात्यात पैसे जमा होतात.',
    },
    {
      q: 'शेतकऱ्यांना काही दलाली किंवा कमिशन द्यावे लागते का?',
      a: 'नाही! किसानसेतू वर शेतकऱ्यांसाठी ०% कमिशन आहे. पारंपारिक आडत (२%) आणि अतिरिक्त बाजार फी शेतकऱ्याला भरावी लागत नाही.',
    },
    {
      q: 'शेतमालाची वाहतूक आणि गाडी कोण पाठवते?',
      a: 'बहुतांश खरेदीदार स्वतःची गाडी थेट शेतात किंवा गावातील केंद्रावर पाठवून माल उचलतात. ऑफर स्वीकारताना वाहतुकीची अट स्पष्ट नमूद केलेली असते.',
    },
    {
      q: 'गोदामात धान्य ठेवल्यावर तारण कर्ज (Pledge Loan) मिळू शकते का?',
      a: 'होय! महाराष्ट्र राज्य वखार महामंडळाच्या (MSWC) मान्यताप्राप्त गोदामात धान्य ठेवल्यास इलेक्ट्रॉनिक पावती (e-NWR) मिळते, ज्यावर राष्ट्रीयीकृत बँकांकडून ७% सवलतीच्या व्याजदराने ७५% पर्यंत कर्ज त्वरित उपलब्ध होते.',
    },
  ],
  हिन्दी: [
    {
      q: 'किसानसेतु पर भुगतान सुरक्षा (Payment Protection) कैसे काम करती है?',
      a: 'ऑफर स्वीकारते ही खरीदार को पूरी रकम किसानसेतु एस्क्रो खाते में जमा करनी होती है। डिजिटल तौल पर्ची मिलते ही २ घंटे के भीतर राशि सीधे आपके बैंक खाते में ट्रांसफर हो जाती है।',
    },
    {
      q: 'क्या किसान को कोई आढ़त या दलाली देनी होगी?',
      a: 'बिल्कुल नहीं! किसानसेतु पर किसानों के लिए शून्य प्रतिशत (0%) कमीशन है। कोई बिचौलिया या आढ़त शुल्क नहीं काटा जाता।',
    },
    {
      q: 'फसल उठान और परिवहन का खर्च कौन उठाता है?',
      a: 'अधिकांश कॉर्पोरेट खरीदार अपने वाहन से सीधे खेत अथवा गांव से फसल उठाते हैं।',
    },
    {
      q: 'वेयरहाउस में फसल रखने पर क्या लोन मिल सकता है?',
      a: 'हाँ! WDRA प्रमाणित गोदामाें में माल रखने पर e-NWR रसीद मिलती है, जिस पर बैंक से 7% ब्याज पर 75% तक तारण ऋण मिलता है।',
    },
  ],
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({
  language,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = FAQS[language] || FAQS['English']

  return (
    <div className="view-page-container">
      {/* Page Header Banner */}
      <div className="page-header-row">
        <div>
          <p className="eyebrow">
            <HelpCircle size={13} /> {t('helpSupport').toUpperCase()} • DEDICATED FARMER ASSISTANCE
          </p>
          <h1>{t('helpSupport')}</h1>
          <p className="subhead">
            Reach your local Mandi coordinator, locate WDRA warehouses, check weather alerts, or explore farmer guides.
          </p>
        </div>

        <div className="helpline-top-card">
          <PhoneCall size={18} className="text-green" />
          <div>
            <span>Toll-Free Helpline</span>
            <strong>1800-123-456</strong>
            <small>7:00 AM - 9:00 PM (Daily)</small>
          </div>
        </div>
      </div>

      {/* Grid: Coordinator Card & Weather Advisory */}
      <div className="help-top-grid">
        {/* Local Mandi Coordinator Card */}
        <div className="coordinator-card">
          <div className="coordinator-head">
            <div className="coord-avatar">AK</div>
            <div>
              <span className="coord-role-tag">
                <ShieldCheck size={12} /> {t('localCoordinator')}
              </span>
              <h3>Shri. Anil Kulkarni</h3>
              <p>Hingna & Nagpur Rural APMC Cluster</p>
            </div>
          </div>

          <div className="coord-contact-row">
            <button
              className="btn-coord-call"
              onClick={() => onShowNotice('Connecting to Anil Kulkarni: +91 94228 11920')}
            >
              <PhoneCall size={16} />
              <span>{t('callCoordinator')}</span>
            </button>

            <button
              className="btn-coord-wa"
              onClick={() => onShowNotice('Opening WhatsApp chat with Mandi Coordinator')}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Chat</span>
            </button>
          </div>

          <div className="coord-info-points">
            <div className="info-pt">
              <CheckCircle2 size={14} className="text-green" />
              <span>Available on-site at Hingna Mandi Weighbridge</span>
            </div>
            <div className="info-pt">
              <CheckCircle2 size={14} className="text-green" />
              <span>Assistance with digital quality grading & moisture checks</span>
            </div>
          </div>
        </div>

        {/* Weather Forecast & Crop Advisory */}
        <div className="weather-advisory-card">
          <div className="weather-head">
            <div className="weather-icon-wrap">
              <CloudSun size={24} />
            </div>
            <div>
              <span className="weather-badge">
                <AlertTriangle size={12} /> 48-Hour Advisory
              </span>
              <h3>{t('weatherAlert')}</h3>
              <p>Nagpur, Wardha & Amravati Region</p>
            </div>
          </div>

          <div className="weather-stats-row">
            <div className="w-stat">
              <span>Temperature</span>
              <strong>29°C / 23°C</strong>
            </div>
            <div className="w-stat">
              <span>Rain Probability</span>
              <strong className="text-orange">65% (Light Showers)</strong>
            </div>
            <div className="w-stat">
              <span>Humidity</span>
              <strong>82%</strong>
            </div>
          </div>

          <p className="crop-advisory-text">
            <strong>Advisory for Soybean & Cotton Farmers:</strong> Ensure harvested soybean pods are covered with tarpaulins to prevent moisture absorption. Do not leave open in farm yards.
          </p>
        </div>
      </div>

      {/* WDRA Approved Warehouses Directory */}
      <div className="warehouse-directory-section">
        <div className="section-head-bar">
          <div>
            <h3>{t('storageWarehouses')}</h3>
            <p>Certified storage with pledge loan & zero grain degradation warranty</p>
          </div>
          <span className="wdra-cert-tag">
            <Building2 size={14} /> WDRA Govt Approved
          </span>
        </div>

        <div className="warehouse-cards-grid">
          {nearbyWarehouses.map((wh, idx) => (
            <div key={idx} className="warehouse-card">
              <div className="wh-top">
                <div className="wh-icon-circle">
                  <Warehouse size={18} />
                </div>
                <div>
                  <h4>{wh.name}</h4>
                  <p>
                    Distance: <strong>{wh.distance}</strong> from your farm
                  </p>
                </div>
              </div>

              <div className="wh-details-grid">
                <div>
                  <span>Capacity:</span>
                  <strong>{wh.capacity}</strong>
                </div>
                <div>
                  <span>Storage Rate:</span>
                  <strong className="text-green">{wh.ratePerBagMonth}</strong>
                </div>
                <div>
                  <span>Pledge Loan (7%):</span>
                  <strong>{wh.pledgeLoanAvailable ? 'Available (Up to 75%)' : 'Not Available'}</strong>
                </div>
              </div>

              <div className="wh-actions-row">
                <button
                  className="btn-wh-contact"
                  onClick={() => onShowNotice(`Calling warehouse manager at ${wh.contact}`)}
                >
                  <PhoneCall size={14} /> Contact Warehouse
                </button>
                <button
                  className="btn-wh-book"
                  onClick={() => onShowNotice(`Storage booking request initiated for ${wh.name}`)}
                >
                  Book Space
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="faq-section">
        <div className="faq-head">
          <HelpCircle size={20} />
          <h3>Frequently Asked Questions (शेतकऱ्यांचे सामान्य प्रश्न)</h3>
        </div>

        <div className="faq-list">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <strong>{item.q}</strong>
                  <ChevronDown size={18} className="faq-arrow" />
                </button>
                {isOpen && <div className="faq-answer-body"><p>{item.a}</p></div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
