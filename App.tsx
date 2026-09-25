import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  Upload,
  Camera,
  Check,
  AlertTriangle,
  Clock,
  Mic,
  MicOff,
  Bell,
  Share2,
  Settings,
  Sun,
  Moon,
  Plus,
  Trash2,
  CheckCircle2,
  Pill,
  Heart,
  Sparkles,
  RefreshCw,
  FileText,
  X
} from 'lucide-react';
import { getSampleLabels, SampleLabel } from './utils/sampleLabels';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'en-US', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
];

interface TimingItem {
  period: string;
  instruction: string;
  recommended_time: string;
  meal_relation: string;
}

interface SimplifiedResult {
  medicine_name: string;
  simplified_text: string;
  phonetic_text?: string;
  dosage_summary: string;
  timings: TimingItem[];
  warning: string;
  language_code: string;
}

interface Reminder {
  id: string;
  medicineName: string;
  time: string;
  mealRelation: string;
  enabled: boolean;
  createdAt: string;
}

export default function App() {
  // Theme & Accessibility Settings
  const [highContrastDark, setHighContrastDark] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'default' | 'large' | 'max'>('large');
  const [speechRate, setSpeechRate] = useState<number>(0.85); // Default slower for seniors
  const [webhookUrl, setWebhookUrl] = useState<string>(() => localStorage.getItem('medvoice_webhook_url') || '');
  const [caregiverPhone, setCaregiverPhone] = useState<string>(() => localStorage.getItem('medvoice_caregiver_phone') || '');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Form State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('hi-IN');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result State
  const [result, setResult] = useState<SimplifiedResult | null>(null);

  // Speech State
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [isPausedSpeech, setIsPausedSpeech] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoiceInfo, setActiveVoiceInfo] = useState<string>('');
  const [usePhoneticSpeech, setUsePhoneticSpeech] = useState<boolean>(false);

  // Voice Input & Alarm State
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [alarmTime, setAlarmTime] = useState<string>('08:00');
  const [alarmMealRelation, setAlarmMealRelation] = useState<string>('after breakfast');
  const [activeReminders, setActiveReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('medvoice_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Camera Modal State
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Samples
  const [samples, setSamples] = useState<SampleLabel[]>([]);

  useEffect(() => {
    setSamples(getSampleLabels());
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }

    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
      }
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('medvoice_reminders', JSON.stringify(activeReminders));
  }, [activeReminders]);

  useEffect(() => {
    localStorage.setItem('medvoice_webhook_url', webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem('medvoice_caregiver_phone', caregiverPhone);
  }, [caregiverPhone]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate([150, 80, 150]);
    }
  };

  // Image File Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setErrorMsg(null);
        triggerHaptic();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleLabel) => {
    setImagePreview(sample.dataUrl);
    setErrorMsg(null);
    triggerHaptic();
    triggerToast(`Loaded sample prescription: ${sample.name}`);
  };

  // Camera Capture
  const startCamera = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Could not access device camera. Please upload an image file instead.');
      setShowCameraModal(false);
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImagePreview(dataUrl);
        triggerHaptic();
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  // Speech Synthesis Implementation
  const playSpeech = (
    textToSpeak: string,
    langCode: string,
    phoneticText?: string,
    forcePhonetic: boolean = false
  ) => {
    if (!('speechSynthesis' in window)) {
      triggerToast('Text-to-speech is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any existing speech

    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const targetLangLower = (langCode || 'en-US').toLowerCase();
    const langPrefix = targetLangLower.slice(0, 2);

    // 1. Find exact language match (e.g., 'hi-in' or 'es-es')
    let matchedVoice = currentVoices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLangLower);

    // 2. Find prefix match (e.g., 'hi' or 'es')
    if (!matchedVoice) {
      matchedVoice = currentVoices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));
    }

    // 3. Find voice name match (e.g., voice named 'Google हिन्दी' or 'Microsoft Hemant')
    if (!matchedVoice) {
      const langObj = LANGUAGES.find(l => l.code === langCode);
      if (langObj) {
        matchedVoice = currentVoices.find(v =>
          v.name.toLowerCase().includes(langObj.name.toLowerCase()) ||
          v.name.toLowerCase().includes(langObj.nativeName.toLowerCase())
        );
      }
    }

    let finalSpeechContent = textToSpeak;
    let chosenLang = langCode;

    if (forcePhonetic && phoneticText) {
      finalSpeechContent = phoneticText;
      chosenLang = 'en-US';
      setActiveVoiceInfo('Phonetic Mode: Transliterated English-alphabet audio');
    } else if (!matchedVoice && phoneticText && !langPrefix.startsWith('en')) {
      // System lacks native font voice for non-English script -> use phonetic fallback so it's read accurately!
      finalSpeechContent = phoneticText;
      chosenLang = 'en-US';
      setActiveVoiceInfo(`Phonetic Mode: No native ${langCode} system voice found on device`);
    } else if (matchedVoice) {
      setActiveVoiceInfo(`Native Voice: ${matchedVoice.name} (${matchedVoice.lang})`);
    } else {
      setActiveVoiceInfo(`System Voice (${chosenLang})`);
    }

    const utterance = new SpeechSynthesisUtterance(finalSpeechContent);
    utterance.rate = speechRate;
    utterance.lang = (matchedVoice && !forcePhonetic) ? matchedVoice.lang : chosenLang;
    if (matchedVoice && !forcePhonetic) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlayingSpeech(true);
      setIsPausedSpeech(false);
    };

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      setIsPausedSpeech(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlayingSpeech(false);
      setIsPausedSpeech(false);
    };

    window.speechSynthesis.speak(utterance);
    triggerHaptic();
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPausedSpeech(true);
      setIsPlayingSpeech(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPausedSpeech(false);
      setIsPlayingSpeech(true);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      setIsPausedSpeech(false);
    }
  };

  // Submit & Analyze Workflow
  const handleSimplifyAndListen = async () => {
    if (!imagePreview) {
      setErrorMsg('Please upload or snap a prescription label photo first.');
      triggerHaptic();
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);
    stopSpeech();

    const selectedLangObj = LANGUAGES.find(l => l.code === selectedLanguageCode) || LANGUAGES[0];

    try {
      const response = await fetch('/api/simplify-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: imagePreview,
          target_language: `${selectedLangObj.name} (${selectedLangObj.nativeName})`,
          language_code: selectedLangObj.code,
          webhook_url: webhookUrl
        })
      });

      if (!response.ok) {
        let errDetail = '';
        try {
          const errJson = await response.json();
          errDetail = errJson.error || errJson.message || '';
        } catch {
          // ignore json parse error
        }
        if (errDetail.includes('503') || errDetail.includes('UNAVAILABLE') || errDetail.includes('busy')) {
          throw new Error('The AI service is currently busy due to high demand. Please wait a few seconds and click "Simplify & Listen Now" again.');
        }
        throw new Error(errDetail || `Server returned status ${response.status}`);
      }

      const data: SimplifiedResult = await response.json();
      setResult(data);
      setIsAnalyzing(false);
      triggerHaptic();

      // Automatically trigger speech synthesis on response arrival as required!
      if (data.simplified_text) {
        setTimeout(() => {
          playSpeech(
            data.simplified_text,
            data.language_code || selectedLangObj.code,
            data.phonetic_text,
            usePhoneticSpeech
          );
        }, 500);
      }
    } catch (err: any) {
      console.error('Error simplifying prescription:', err);
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Failed to simplify prescription. Please try again.');
      triggerHaptic();
    }
  };

  // Voice Input for Alarm Setting
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast('Voice recognition is not supported in this browser. You can select time below!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguageCode || 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningVoice(true);
        triggerHaptic();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceTranscript(transcript);
        setIsListeningVoice(false);
        triggerHaptic();

        // Attempt to extract time and meal relation from spoken voice input
        if (transcript.includes('breakfast') || transcript.includes('नाश्ता') || transcript.includes('desayuno')) {
          setAlarmMealRelation('after breakfast');
          setAlarmTime('08:30');
        } else if (transcript.includes('lunch') || transcript.includes('दोपहर') || transcript.includes('almuerzo')) {
          setAlarmMealRelation('after lunch');
          setAlarmTime('13:30');
        } else if (transcript.includes('dinner') || transcript.includes('रात') || transcript.includes('cena')) {
          setAlarmMealRelation('after dinner');
          setAlarmTime('20:00');
        } else if (transcript.includes('bedtime') || transcript.includes('सोते')) {
          setAlarmMealRelation('at bedtime');
          setAlarmTime('22:00');
        }

        // Search for numbers / times like "8", "8:30", "9 pm"
        const timeMatch = transcript.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
          const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : '';

          if (ampm === 'pm' && hours < 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;

          const formattedH = hours.toString().padStart(2, '0');
          const formattedM = minutes.toString().padStart(2, '0');
          setAlarmTime(`${formattedH}:${formattedM}`);
        }

        triggerToast(`Voice heard: "${transcript}". Alarm set for ${alarmTime}!`);
      };

      recognition.onerror = (e: any) => {
        console.error('Voice recognition error:', e);
        setIsListeningVoice(false);
        triggerToast('Could not hear clearly. Please tap a time button below.');
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch (e) {
      setIsListeningVoice(false);
      triggerToast('Voice recognition error.');
    }
  };

  // Add Reminder
  const handleAddReminder = () => {
    const medName = result?.medicine_name || 'Prescription Medicine';
    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicineName: medName,
      time: alarmTime,
      mealRelation: alarmMealRelation,
      enabled: true,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveReminders(prev => [newReminder, ...prev]);
    triggerHaptic();

    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationStatus(permission);
      });
    }

    triggerToast(`⏰ Reminder set for ${medName} at ${alarmTime} (${alarmMealRelation})!`);
  };

  const handleDeleteReminder = (id: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== id));
    triggerHaptic();
    triggerToast('Reminder removed.');
  };

  const handleShareWithCaregiver = () => {
    triggerHaptic();
    const medName = result?.medicine_name || 'Prescription Medicine';
    const text = `Hi! 💊 Med-Voice Prescription Alert:\n- Medicine: ${medName}\n- Alarm Time: ${alarmTime} (${alarmMealRelation})\n- Spoken Instructions: "${result?.simplified_text || 'Take as prescribed.'}"`;
    const encodedText = encodeURIComponent(text);

    let whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    if (caregiverPhone && caregiverPhone.trim()) {
      const cleanPhone = caregiverPhone.replace(/[^\d]/g, '');
      if (cleanPhone) {
        whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
      }
    }

    // Opens WhatsApp application directly on mobile phones or web
    window.open(whatsappUrl, '_blank');
    triggerToast('Opening WhatsApp on your phone...');
  };

  const testAlarmSound = () => {
    triggerHaptic();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Attention! Time to take your prescription medicine now.");
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    triggerToast('🔔 Playing test alarm sound and vibration!');
  };

  // Base font size styling
  const getFontSizeClass = () => {
    if (fontSizeLevel === 'max') return 'text-xl md:text-2xl';
    if (fontSizeLevel === 'large') return 'text-lg md:text-xl';
    return 'text-base md:text-lg';
  };

  const getContainerBg = () => {
    if (highContrastDark) return 'bg-slate-950 text-slate-100';
    return 'bg-[#F4F7F5] text-[#1A1A1A]';
  };

  const getCardBg = () => {
    if (highContrastDark) return 'bg-slate-900 border-2 border-slate-700 shadow-xl text-white';
    return 'bg-white border-2 border-[#E0E7E1] shadow-sm text-[#1A1A1A]';
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getContainerBg()} ${getFontSizeClass()} font-sans pb-24`}>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-xl bg-[#1B4332] text-[#D8F3DC] font-extrabold px-6 py-4 rounded-2xl border-4 border-[#409167] shadow-2xl flex items-center justify-between text-lg animate-bounce">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#B7E4C7] animate-spin" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-2 text-white hover:text-[#D8F3DC]">
            <X className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Top Clean Minimalist Header */}
      <header className={`sticky top-0 z-40 ${highContrastDark ? 'bg-slate-900 border-b-4 border-yellow-400 text-white' : 'bg-white border-b-4 border-[#E0E7E1] text-[#1A1A1A]'} px-6 py-4 shadow-sm`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2D6A4F] text-white rounded-full flex items-center justify-center shadow-md shrink-0">
              <Volume2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1B4332] dark:text-emerald-400 flex items-center gap-2">
                Med-Voice
                <span className="bg-[#D8F3DC] text-[#1B4332] text-xs md:text-sm font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#2D6A4F]/30">
                  Senior Ready
                </span>
              </h1>
              <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-slate-400">
                Prescription Audio Simplifier
              </p>
            </div>
          </div>

          {/* Accessibility Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Font Size Toggle */}
            <div className="flex items-center bg-[#F4F7F5] dark:bg-slate-800 rounded-xl p-1 border border-[#E0E7E1] dark:border-slate-700">
              <button
                onClick={() => setFontSizeLevel('default')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${fontSizeLevel === 'default' ? 'bg-[#2D6A4F] text-white' : 'text-slate-800 dark:text-slate-200'}`}
                title="Normal Text Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                className={`px-3 py-1.5 rounded-lg text-base font-bold ${fontSizeLevel === 'large' ? 'bg-[#2D6A4F] text-white' : 'text-slate-800 dark:text-slate-200'}`}
                title="Large Text Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel('max')}
                className={`px-3 py-1.5 rounded-lg text-xl font-bold ${fontSizeLevel === 'max' ? 'bg-[#2D6A4F] text-white' : 'text-slate-800 dark:text-slate-200'}`}
                title="Maximum Text Size"
              >
                A++
              </button>
            </div>

            {/* Dark High Contrast Toggle */}
            <button
              onClick={() => {
                setHighContrastDark(!highContrastDark);
                triggerHaptic();
              }}
              className="p-3 rounded-xl bg-[#2D6A4F] text-white dark:bg-yellow-400 dark:text-slate-950 font-bold flex items-center gap-2 text-sm shadow hover:bg-[#1B4332] transition-all"
              title="Toggle High Contrast Theme"
            >
              {highContrastDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              <span className="hidden sm:inline font-bold">
                {highContrastDark ? 'Light' : 'High Contrast'}
              </span>
            </button>

            {/* Settings Modal Toggle */}
            <button
              onClick={() => {
                setShowSettingsModal(true);
                triggerHaptic();
              }}
              className="p-3 rounded-xl bg-[#D8F3DC] dark:bg-slate-800 text-[#1B4332] dark:text-slate-100 font-bold border border-[#B7E4C7] dark:border-slate-700 hover:bg-[#B7E4C7] transition-colors"
              title="Settings & Webhook"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-8">
        {/* Error Alert if any */}
        {errorMsg && (
          <div className="bg-red-100 border-4 border-red-500 text-red-950 p-5 rounded-2xl shadow-lg flex items-start gap-4">
            <AlertTriangle className="w-10 h-10 text-red-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold">Please Check:</h3>
              <p className="text-base font-semibold mt-1">{errorMsg}</p>
              <button
                onClick={() => setErrorMsg(null)}
                className="mt-3 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm"
              >
                Dismiss Error
              </button>
            </div>
          </div>
        )}

        {/* SECTION 1: PHOTO UPLOAD & SNAP LABEL */}
        <section className={`${getCardBg()} rounded-[32px] p-6 md:p-8 transition-all`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#2D6A4F] text-white text-xl font-black w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1B4332] dark:text-[#D8F3DC]">
              Upload or Snap Prescription Photo
            </h2>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg mb-6">
            Take a clear photo of the bottle or box label using your device camera or upload an existing photo.
          </p>

          {/* Upload Dropzone / Camera Action */}
          {!imagePreview ? (
            <div className="space-y-6">
              <div className="border-4 border-dashed border-[#B7E4C7] dark:border-slate-700 rounded-[28px] p-6 md:p-10 text-center bg-[#F8FAF9] dark:bg-slate-800/60 hover:bg-[#E0E7E1]/50 transition-all flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 bg-[#D8F3DC] dark:bg-slate-700 text-[#1B4332] dark:text-[#B7E4C7] rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <p className="text-xl md:text-2xl font-bold text-[#1B4332] dark:text-slate-100">
                    Select or Drag Prescription Photo Here
                  </p>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                    Supports JPG, PNG, WEBP prescription images
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-2">
                  <label className="flex-1 min-w-[220px] bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-95 text-white font-black py-4 px-6 rounded-2xl shadow-md cursor-pointer text-center text-lg md:text-xl flex items-center justify-center gap-3 transition-all">
                    <Upload className="w-7 h-7" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={startCamera}
                    className="flex-1 min-w-[220px] bg-[#1B4332] hover:bg-black active:scale-95 text-white font-black py-4 px-6 rounded-2xl shadow-md text-center text-lg md:text-xl flex items-center justify-center gap-3 transition-all"
                  >
                    <Camera className="w-7 h-7" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </div>

              {/* Instant Test Sample Presets */}
              <div className="pt-2">
                <p className="text-base font-bold text-[#1B4332] dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2D6A4F]" />
                  Or Try a Sample Prescription Label instantly:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {samples.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="p-4 rounded-2xl border-2 border-[#E0E7E1] dark:border-slate-700 bg-[#F8FAF9] dark:bg-slate-800 hover:border-[#2D6A4F] text-left transition-all active:scale-95 flex flex-col gap-1 shadow-sm"
                    >
                      <span className="font-extrabold text-[#1B4332] dark:text-[#B7E4C7] text-lg flex items-center gap-1.5">
                        <Pill className="w-5 h-5 text-[#2D6A4F]" />
                        {sample.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {sample.dosage}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Selected Image Preview Card */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-4 border-[#2D6A4F] shadow-xl bg-black max-h-[350px] flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Prescription Label Preview"
                  className="max-h-[350px] w-auto object-contain"
                />
                <div className="absolute top-3 right-3 bg-[#2D6A4F] text-white font-black text-sm px-4 py-1.5 rounded-full shadow flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Label Ready
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                    stopSpeech();
                    triggerHaptic();
                  }}
                  className="bg-red-50 dark:bg-slate-800 text-red-700 dark:text-red-400 hover:bg-red-100 border-2 border-red-200 dark:border-red-900 font-bold py-3 px-6 rounded-2xl text-base md:text-lg flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Change / Remove Photo
                </button>

                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Ready to simplify in your preferred language
                </p>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: REGIONAL LANGUAGE SELECTION */}
        <section className={`${getCardBg()} rounded-[32px] p-6 md:p-8 transition-all`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#2D6A4F] text-white text-xl font-black w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1B4332] dark:text-[#D8F3DC]">
              Select Your Regional Language
            </h2>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg mb-6">
            Choose the language for colloquial translation and clear audio speech output.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguageCode === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguageCode(lang.code);
                    triggerHaptic();
                  }}
                  className={`p-4 rounded-2xl font-black text-left flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 border-4 ${
                    isSelected
                      ? 'bg-[#2D6A4F] text-white border-[#1B4332] shadow-lg scale-105'
                      : 'bg-[#F8FAF9] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-[#E0E7E1] dark:border-slate-700 hover:border-[#2D6A4F]'
                  }`}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <div className="text-lg leading-tight">{lang.nativeName}</div>
                    <div className="text-xs font-semibold opacity-80">{lang.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRIMARY ACTION SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleSimplifyAndListen}
            disabled={isAnalyzing || !imagePreview}
            className={`w-full py-6 px-8 rounded-[32px] font-black text-2xl md:text-3xl shadow-xl flex items-center justify-center gap-4 transition-all ${
              !imagePreview
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border-2 border-slate-300'
                : isAnalyzing
                ? 'bg-[#2D6A4F] text-white border-4 border-[#1B4332] animate-pulse cursor-wait'
                : 'bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-98 text-white border-4 border-[#409167]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-10 h-10 animate-spin text-white" />
                <span>Simplifying & Translating...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-10 h-10" />
                <span>SIMPLIFY & LISTEN NOW</span>
              </>
            )}
          </button>
        </div>

        {/* SECTION 3: SIMPLIFIED RESULTS & AUDIO PLAYER */}
        {result && (
          <section className={`bg-[#F8FAF9] dark:bg-slate-900 border-4 border-[#2D6A4F] rounded-[32px] p-6 md:p-8 shadow-md space-y-6 animate-fade-in`}>
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#E0E7E1] dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#2D6A4F] text-white p-3 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] dark:text-[#B7E4C7]">
                    Simplified Instructions
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-[#1B4332] dark:text-slate-100">
                    {result.medicine_name || 'Prescription Medicine'}
                  </h3>
                </div>
              </div>

              {/* Language Tag */}
              <div className="bg-[#D8F3DC] text-[#1B4332] font-black px-4 py-2 rounded-xl text-base border border-[#B7E4C7]">
                {LANGUAGES.find(l => l.code === result.language_code)?.nativeName || result.language_code}
              </div>
            </div>

            {/* Colloquial Audio Script Card */}
            <div className="bg-white dark:bg-slate-800 border-2 border-[#B7E4C7] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-extrabold uppercase tracking-wider text-[#2D6A4F] dark:text-[#B7E4C7] flex items-center gap-2">
                  <Volume2 className="w-5 h-5" /> Spoken Instructions (Native):
                </p>
                {result.phonetic_text && (
                  <button
                    onClick={() => {
                      const next = !usePhoneticSpeech;
                      setUsePhoneticSpeech(next);
                      triggerHaptic();
                      playSpeech(result.simplified_text, result.language_code, result.phonetic_text, next);
                    }}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                      usePhoneticSpeech
                        ? 'bg-[#2D6A4F] text-white border-[#1B4332]'
                        : 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]'
                    }`}
                  >
                    {usePhoneticSpeech ? '🗣️ Using Phonetic Audio' : '🔊 Using Native Audio'}
                  </button>
                )}
              </div>

              <p className="text-xl md:text-2xl font-extrabold text-[#1B4332] dark:text-slate-100 leading-relaxed">
                "{result.simplified_text}"
              </p>

              {result.phonetic_text && (
                <div className="pt-2 border-t border-[#E0E7E1] dark:border-slate-700">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    📖 Phonetic Transliteration (for smooth voice reading):
                  </span>
                  <p className="text-base md:text-lg font-semibold italic text-slate-700 dark:text-slate-300">
                    "{result.phonetic_text}"
                  </p>
                </div>
              )}
            </div>

            {/* Meal-Based Timings Breakdown */}
            {result.timings && result.timings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-[#1B4332] dark:text-slate-200 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-[#2D6A4F]" />
                  When to Take Medicine:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.timings.map((timing, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#E0E7E1] dark:border-slate-700 flex items-center gap-4 shadow-sm"
                    >
                      <div className="bg-[#D8F3DC] text-[#1B4332] p-3 rounded-xl font-black text-lg">
                        {timing.recommended_time || '08:00'}
                      </div>
                      <div>
                        <div className="font-extrabold text-lg text-[#1B4332] dark:text-slate-100">
                          {timing.period}
                        </div>
                        <div className="text-base text-slate-700 dark:text-slate-300 font-semibold">
                          {timing.instruction} ({timing.meal_relation})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Box */}
            {result.warning && (
              <div className="bg-amber-50 dark:bg-amber-950/80 border-4 border-amber-400 text-amber-950 dark:text-amber-200 p-5 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-extrabold text-lg text-amber-900 dark:text-amber-300">
                    Important Caution / Note:
                  </h4>
                  <p className="font-bold text-base md:text-lg mt-0.5">
                    {result.warning}
                  </p>
                </div>
              </div>
            )}

            {/* TEXT-TO-SPEECH CONTROLLER CARD */}
            <div className="bg-[#1B4332] text-white p-6 rounded-2xl space-y-4 border-4 border-[#2D6A4F] shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isPlayingSpeech ? 'bg-[#409167] animate-ping' : 'bg-[#2D6A4F]'}`}>
                    <Volume2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-[#D8F3DC]">
                      {isPlayingSpeech ? '🔊 Audio Playing...' : isPausedSpeech ? '⏸️ Audio Paused' : 'Read Instructions Aloud'}
                    </h4>
                    <p className="text-xs text-[#B7E4C7] font-medium flex items-center gap-1.5 mt-0.5">
                      <span>🎙️</span>
                      <span>{activeVoiceInfo || 'Native browser text-to-speech engine'}</span>
                    </p>
                  </div>
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-2 bg-[#2D6A4F] p-1.5 rounded-xl border border-[#409167]">
                  <span className="text-xs text-white font-bold px-2">Speed:</span>
                  <button
                    onClick={() => {
                      setSpeechRate(0.75);
                      triggerHaptic();
                      if (isPlayingSpeech) playSpeech(result.simplified_text, result.language_code, result.phonetic_text, usePhoneticSpeech);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${speechRate === 0.75 ? 'bg-white text-[#1B4332]' : 'text-white'}`}
                  >
                    🐢 Slow 0.75x
                  </button>
                  <button
                    onClick={() => {
                      setSpeechRate(1.0);
                      triggerHaptic();
                      if (isPlayingSpeech) playSpeech(result.simplified_text, result.language_code, result.phonetic_text, usePhoneticSpeech);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${speechRate === 1.0 ? 'bg-white text-[#1B4332]' : 'text-white'}`}
                  >
                    🚶 1.0x
                  </button>
                </div>
              </div>

              {/* Main Audio Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => playSpeech(result.simplified_text, result.language_code, result.phonetic_text, usePhoneticSpeech)}
                  className="flex-1 min-w-[180px] bg-[#D8F3DC] hover:bg-[#B7E4C7] active:scale-95 text-[#1B4332] font-black py-4 px-6 rounded-2xl text-xl shadow-md flex items-center justify-center gap-3 transition-transform"
                >
                  <RotateCcw className="w-7 h-7" />
                  <span>🔊 REPLAY AUDIO</span>
                </button>

                {isPlayingSpeech ? (
                  <button
                    onClick={pauseSpeech}
                    className="bg-amber-300 hover:bg-amber-400 text-slate-950 font-extrabold py-4 px-6 rounded-2xl text-lg flex items-center gap-2"
                  >
                    <Pause className="w-6 h-6" />
                    <span>Pause</span>
                  </button>
                ) : isPausedSpeech ? (
                  <button
                    onClick={resumeSpeech}
                    className="bg-[#D8F3DC] text-[#1B4332] font-extrabold py-4 px-6 rounded-2xl text-lg flex items-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    <span>Resume</span>
                  </button>
                ) : null}

                <button
                  onClick={stopSpeech}
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-4 px-5 rounded-2xl text-base flex items-center gap-2"
                >
                  <Square className="w-5 h-5 text-red-300" />
                  <span>Stop</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: MEDICATION REMINDER & VOICE ALARM SCHEDULER */}
        <section className={`${getCardBg()} rounded-[32px] p-6 md:p-8 space-y-6 transition-all`}>
          <div className="flex items-center gap-3">
            <span className="bg-[#2D6A4F] text-white text-xl font-black w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2 text-[#1B4332] dark:text-[#D8F3DC]">
              <Bell className="w-8 h-8 text-[#2D6A4F]" />
              Set Voice / Meal Alarm
            </h2>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg">
            Easily set a daily reminder alarm relative to meals (e.g. before/after breakfast). You can also tap the microphone to speak your alarm time!
          </p>

          {/* Voice Input Section */}
          <div className="bg-[#F8FAF9] dark:bg-slate-800 border-2 border-[#E0E7E1] dark:border-slate-700 p-5 rounded-2xl space-y-3 text-center">
            <p className="font-extrabold text-lg text-[#1B4332] dark:text-slate-100">
              🎙️ Voice Alarm Setup (Tap & Speak):
            </p>

            <button
              onClick={startVoiceInput}
              disabled={isListeningVoice}
              className={`w-full py-4 px-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-md transition-all ${
                isListeningVoice
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white border-2 border-[#409167]'
              }`}
            >
              {isListeningVoice ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              <span>{isListeningVoice ? 'Listening... Speak Now!' : 'Tap & Speak Alarm Time'}</span>
            </button>

            {voiceTranscript && (
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic">
                Heard: "{voiceTranscript}"
              </p>
            )}
          </div>

          {/* Quick Meal-Based Time Presets */}
          <div className="space-y-3">
            <p className="font-bold text-base text-[#1B4332] dark:text-slate-200">
              Or Choose Meal Schedule Preset:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { time: '08:00', label: '🌅 Before Breakfast', meal: 'before breakfast' },
                { time: '09:00', label: '🍳 After Breakfast', meal: 'after breakfast' },
                { time: '13:30', label: '🥗 After Lunch', meal: 'after lunch' },
                { time: '19:00', label: '🌆 Before Dinner', meal: 'before dinner' },
                { time: '20:30', label: '🍲 After Dinner', meal: 'after dinner' },
                { time: '22:00', label: '🌙 At Bedtime', meal: 'at bedtime' }
              ].map((preset) => {
                const isSelected = alarmTime === preset.time;
                return (
                  <button
                    key={preset.time}
                    onClick={() => {
                      setAlarmTime(preset.time);
                      setAlarmMealRelation(preset.meal);
                      triggerHaptic();
                    }}
                    className={`p-3.5 rounded-2xl text-left font-bold border-2 transition-all text-sm md:text-base ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white border-[#1B4332] shadow-md scale-105'
                        : 'bg-[#F8FAF9] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-[#E0E7E1] dark:border-slate-700'
                    }`}
                  >
                    <div>{preset.label}</div>
                    <div className="text-xs opacity-80">{preset.time}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker & Add Action */}
          <div className="flex flex-wrap items-center gap-4 bg-[#F8FAF9] dark:bg-slate-800 p-4 rounded-2xl border border-[#E0E7E1] dark:border-slate-700">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Selected Alarm Time:
              </label>
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-[#E0E7E1] dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-extrabold text-xl"
              />
            </div>

            <div className="flex-1 min-w-[200px] flex items-center gap-2 pt-5">
              <button
                onClick={handleAddReminder}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-95 text-white font-black py-3.5 px-6 rounded-xl shadow-md text-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                <span>Save Alarm</span>
              </button>
            </div>
          </div>

          {/* Caregiver & Haptic Testing Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleShareWithCaregiver}
              className="flex-1 min-w-[220px] bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold py-3.5 px-5 rounded-2xl text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-5 h-5 text-emerald-200" />
              <span>Share Alarm via WhatsApp</span>
            </button>

            <button
              onClick={testAlarmSound}
              className="bg-[#D8F3DC] dark:bg-slate-800 text-[#1B4332] dark:text-slate-100 font-extrabold py-3.5 px-5 rounded-2xl text-base border border-[#B7E4C7] dark:border-slate-700 flex items-center gap-2"
            >
              <Bell className="w-5 h-5 text-[#2D6A4F]" />
              <span>Test Alarm Chime</span>
            </button>
          </div>

          {/* Active Saved Reminders List */}
          {activeReminders.length > 0 && (
            <div className="pt-4 border-t-2 border-[#E0E7E1] dark:border-slate-700 space-y-3">
              <h3 className="text-xl font-extrabold text-[#1B4332] dark:text-slate-100 flex items-center justify-between">
                <span>Active Medication Alarms ({activeReminders.length})</span>
              </h3>

              <div className="space-y-2">
                {activeReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#B7E4C7] flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-[#D8F3DC] dark:bg-slate-700 text-[#1B4332] dark:text-[#B7E4C7] font-black px-3 py-2 rounded-xl text-lg">
                        ⏰ {reminder.time}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                          {reminder.medicineName}
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {reminder.mealRelation}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* CAMERA CAPTURE MODAL */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden border-4 border-amber-400 flex flex-col items-center p-6 space-y-4">
            <h3 className="text-2xl font-black text-amber-300">
              Snap Prescription Photo
            </h3>

            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-4 w-full pt-2">
              <button
                onClick={captureCameraPhoto}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Camera className="w-7 h-7" />
                <span>Take Photo</span>
              </button>

              <button
                onClick={stopCamera}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-2xl text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL (Webhook URL & Caregiver Info) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-6 md:p-8 border-4 border-amber-400 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <Settings className="w-7 h-7 text-amber-500" />
                App Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Custom Webhook URL */}
            <div className="space-y-2">
              <label className="block font-extrabold text-base">
                Make.com Webhook URL (Optional):
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Leave empty to use built-in server Gemini 3.6 Flash AI vision OCR & translator.
              </p>
              <input
                type="url"
                placeholder="https://hook.eu1.make.com/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm font-mono"
              />
            </div>

            {/* Default Caregiver Phone */}
            <div className="space-y-2">
              <label className="block font-extrabold text-base">
                Caregiver WhatsApp / Phone Number:
              </label>
              <input
                type="tel"
                placeholder="+1 555 123 4567"
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-3 text-base"
              />
            </div>

            <button
              onClick={() => {
                setShowSettingsModal(false);
                triggerToast('Settings saved!');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xl shadow-lg"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
