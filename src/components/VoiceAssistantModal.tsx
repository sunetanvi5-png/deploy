import React, { useState } from 'react'
import { X, Mic, Volume2, Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Language } from '../types'
import { getTranslation } from '../i18n/translations'

interface VoiceAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  language: Language
  onSelectAction: (actionText: string) => void
}

interface VoicePrompt {
  id: string
  question: string
  response: string
  actionKey?: string
}

const VOICE_KNOWLEDGE: Record<Language, VoicePrompt[]> = {
  English: [
    {
      id: 'p-1',
      question: 'What is today’s best soybean price near Nagpur?',
      response: 'Today’s top price is at Hingna Market: ₹5,080 per quintal for Grade A Soybean (+₹90 up). Nagpur APMC is trading at ₹4,950/qtl.',
      actionKey: 'Market prices',
    },
    {
      id: 'p-2',
      question: 'Should I sell my 25 quintal Soybean today or store it?',
      response: 'Our advisory recommends storing for 15-20 days. Historical data and reduced arrivals suggest expected rates of ₹5,250/qtl, yielding approx +₹1,000 more net profit after warehouse charges.',
      actionKey: 'Overview',
    },
    {
      id: 'p-3',
      question: 'How do I list my new Cotton crop for buyers?',
      response: 'Tap on "List produce" on the top right. Enter your variety (e.g. Bt Cotton 29.5mm), quantity, and reserve price. Over 10 verified ginning mills will receive your listing immediately.',
      actionKey: 'My produce',
    },
    {
      id: 'p-4',
      question: 'Where is the nearest government approved warehouse?',
      response: 'Maharashtra State Warehousing Corp (MSWC) Hingna branch is 6.5 km away with 40% capacity available at ₹4.50/bag/month with pledge loan support.',
      actionKey: 'Help & support',
    },
  ],
  मराठी: [
    {
      id: 'p-1',
      question: 'नागपूर परिसरात आज सोयाबीनचा सर्वात चांगला भाव काय आहे?',
      response: 'आज हिंगणा बाजार समितीत सोयाबीनला ग्रेड-ए साठी सर्वाधिक ५,०८० रुपये प्रति क्विंटल भाव मिळत आहे (कालपेक्षा ९० रुपयांची वाढ). नागपूर APMC मध्ये ४,९५० रुपये भाव आहे.',
      actionKey: 'Market prices',
    },
    {
      id: 'p-2',
      question: 'मी २५ क्विंटल सोयाबीन आज विकावे की साठवून ठेवावे?',
      response: 'सध्या आवक कमी होत असल्याने १५-२० दिवस साठवून ठेवल्यास प्रति क्विंटल ५,२५० रुपयांपर्यंत भाव मिळण्याची शक्यता आहे. गोदामाचे भाडे वजा जाता तुम्हाला अंदाजे १,००० रुपये अधिक निव्वळ नफा मिळू शकेल.',
      actionKey: 'Overview',
    },
    {
      id: 'p-3',
      question: 'नवीन कपाशीची विक्री नोंदणी कशी करावी?',
      response: 'वर दिलेल्या "शेतमाल विका" बटणावर क्लिक करा. कपाशीचा प्रकार, एकूण क्विंटल आणि अपेक्षित किंमत भरा. त्वरित जिनिंग व स्पिनिंग मिल खरेदीदारांपर्यंत तुमची नोंद पोहोचेल.',
      actionKey: 'My produce',
    },
    {
      id: 'p-4',
      question: 'जवळचे शासकीय धान्य गोदाम कुठे आहे?',
      response: 'महाराष्ट्र राज्य वखार महामंडळ (MSWC) हिंगणा केंद्र ६.५ किमी अंतरावर आहे. येथे प्रति पोते दरमहा ४.५० रुपये दराने साठवणूक व तारणावर कर्ज उपलब्ध आहे.',
      actionKey: 'Help & support',
    },
  ],
  हिन्दी: [
    {
      id: 'p-1',
      question: 'नागपुर क्षेत्र में आज सोयाबीन का सबसे अच्छा भाव क्या है?',
      response: 'आज हिंगना मंडी में ग्रेड-ए सोयाबीन का भाव सबसे अच्छा ₹5,080 प्रति क्विंटल है। नागपुर मुख्य APMC में ₹4,950 का भाव चल रहा है।',
      actionKey: 'Market prices',
    },
    {
      id: 'p-2',
      question: 'क्या मुझे सोयाबीन अभी बेचना चाहिए या कुछ दिन रोकना चाहिए?',
      response: 'हमारी सलाह है कि 15-20 दिन भंडारण करें। आगामी दिनों में भाव ₹5,250/क्विंटल तक जाने की संभावना है, जिससे आपको वेयरहाउस खर्च के बाद भी प्रति क्विंटल अधिक मुनाफा होगा।',
      actionKey: 'Overview',
    },
    {
      id: 'p-3',
      question: 'अपनी फसल को बेचने के लिए कैसे लिस्ट करें?',
      response: 'ऊपर "फसल बेचें" बटन पर क्लिक करें। फसल का नाम, मात्रा (क्विंटल) और अपेक्षित भाव दर्ज करें। आपके नजदीकी सत्यापित खरीदार तुरंत बोली लगाना शुरू करेंगे।',
      actionKey: 'My produce',
    },
    {
      id: 'p-4',
      question: 'नजदीकी वेयरहाउस (गोदाम) कहां उपलब्ध है?',
      response: 'महाराष्ट्र वेयरहाउसिंग कॉर्पोरेशन (MSWC) हिंगना 6.5 किमी पर उपलब्ध है, जिसका शुल्क ₹4.50 प्रति बोरी प्रति माह है।',
      actionKey: 'Help & support',
    },
  ],
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectAction,
}) => {
  const t = (key: string) => getTranslation(language, key)
  const prompts = VOICE_KNOWLEDGE[language] || VOICE_KNOWLEDGE['English']

  const [activePrompt, setActivePrompt] = useState<VoicePrompt | null>(prompts[0])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  if (!isOpen) return null

  const handleSpeakText = (text: string) => {
    setIsSpeaking(true)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsSpeaking(false), 3000)
    }
  }

  const handlePromptClick = (p: VoicePrompt) => {
    setActivePrompt(p)
    handleSpeakText(p.response)
  }

  const handleMicToggle = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        const nextP = prompts[Math.floor(Math.random() * prompts.length)]
        setActivePrompt(nextP)
        handleSpeakText(nextP.response)
      }, 2500)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="voice-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="voice-modal-header">
          <div className="voice-header-title">
            <Sparkles size={18} className="text-orange" />
            <div>
              <h3>KisanSetu Voice Advisor</h3>
              <p>ध्वनी सहाय्यक • Multi-lingual AI for Farmers</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Big Interactive Mic Radar */}
        <div className="voice-radar-stage">
          <div className={`radar-ring ${isListening ? 'listening-active' : ''} ${isSpeaking ? 'speaking-active' : ''}`}>
            <button
              className={`big-mic-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
              onClick={handleMicToggle}
              title="Click to speak"
            >
              <Mic size={36} />
            </button>
          </div>
          <p className="mic-status-label">
            {isListening
              ? 'ऐकत आहे... (Listening... Speak now)'
              : isSpeaking
              ? 'माहिती वाचून दाखवत आहे... (Speaking advisory...)'
              : 'माईकवर टॅप करा आणि प्रश्न विचारा (Tap to speak in Marathi, Hindi, or English)'}
          </p>
        </div>

        {/* Current Active Conversation Box */}
        {activePrompt && (
          <div className="voice-dialog-card">
            <div className="voice-user-q">
              <MessageSquare size={16} />
              <strong>"{activePrompt.question}"</strong>
            </div>

            <div className="voice-ai-answer">
              <div className="ai-icon-tag">
                <Volume2 size={16} />
                <span>KisanSetu Answer</span>
              </div>
              <p>{activePrompt.response}</p>

              <div className="voice-answer-actions">
                <button
                  className="replay-voice-btn"
                  onClick={() => handleSpeakText(activePrompt.response)}
                >
                  <Volume2 size={14} /> पुन्हा ऐका (Replay Audio)
                </button>

                {activePrompt.actionKey && (
                  <button
                    className="goto-section-btn"
                    onClick={() => {
                      onSelectAction(activePrompt.actionKey!)
                      onClose()
                    }}
                  >
                    <span>{activePrompt.actionKey} उघडा</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Question Chips */}
        <div className="voice-suggested-section">
          <label>विचारले जाणारे महत्त्वाचे प्रश्न (Frequently Asked Questions):</label>
          <div className="suggested-chips-grid">
            {prompts.map((p) => (
              <button
                key={p.id}
                className={`suggested-voice-chip ${activePrompt?.id === p.id ? 'active' : ''}`}
                onClick={() => handlePromptClick(p)}
              >
                <Mic size={13} />
                <span>{p.question}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="voice-modal-footer">
          <CheckCircle2 size={14} className="text-green" />
          <span>Real-time voice advisory powered by Maharashtra APMC Agmarknet network.</span>
        </div>
      </div>
    </div>
  )
}
