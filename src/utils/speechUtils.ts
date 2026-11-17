// Pure Bangla & English Speech Engine:
// Uses server-side Gemini TTS (/api/tts) when configured,
// and features a full-fidelity Bangla phonetic voice engine with Web Speech API fallback.
import { audioManager } from './audioManager';

let voiceEnabled = true;
let preferredSpeechMode: 'bn' | 'en' | 'both' = 'bn';
let cachedVoices: SpeechSynthesisVoice[] = [];
let speechEpoch = 0;

let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;
let currentAbort: AbortController | null = null;
let webSpeechTimer: number | null = null;

const audioBase64Cache = new Map<string, string>();
const MAX_CLIENT_CACHE = 150;
const inFlightRequests = new Map<string, Promise<string>>();

const BANGLA_WORD_PHONETICS: Record<string, string> = {
  'হ্যালো': 'Hello',
  'স্বাগতম': 'Sha-gotom',
  'কিডোপ্লেতে': 'KiddoPlay tay',
  'কিডোপ্লে': 'KiddoPlay',
  'শাবাশ': 'Shabash',
  'দারুণ': 'Daarun',
  'হয়েছে': 'hoyeche',
  'সঠিক': 'Shothik',
  'উত্তর': 'Uttor',
  'ভুল': 'Bhool',
  'আবার': 'Abar',
  'চেষ্টা': 'Cheshta',
  'করো': 'Koro',
  'চমৎকার': 'Chomotkar',
  'অসাধারণ': 'Oshadharon',
  'ধন্যবাদ': 'Dhonnobad',
  'খেলো': 'Khelo',
  'শিখো': 'Shikho',
  'এসো': 'Esho',
  'ছোট্ট': 'Chhotto',
  'বন্ধু': 'Bondhu',
  'চলো': 'Cholo',
  'একসাথে': 'Ek-shathe',
  'আজ': 'Aaj',
  'নতুন': 'Notun',
  'কিছু': 'Kichhu',
  '০': 'Shunno', '১': 'Ek', '২': 'Dui', '৩': 'Teen', '৪': 'Chaar',
  '৫': 'Paanch', '৬': 'Chhoy', '৭': 'Shaat', '৮': 'Aat', '৯': 'Noy', '১০': 'Dosh',
  'শূন্য': 'Shunno', 'এক': 'Ek', 'দুই': 'Dui', 'তিন': 'Teen', 'চার': 'Chaar',
  'পাঁচ': 'Paanch', 'ছয়': 'Chhoy', 'ছয়': 'Chhoy', 'সাত': 'Shaat', 'আট': 'Aat', 'নয়': 'Noy', 'নয়': 'Noy', 'দশ': 'Dosh',
  'গুণ': 'Goon', 'সমান': 'Shoman', 'নামতা': 'Namta',
  'অ': 'Aw', 'আ': 'Aa', 'ই': 'Ee', 'ঈ': 'Ee', 'উ': 'Oo', 'ঊ': 'Oo', 'ঋ': 'Ree',
  'এ': 'Ay', 'ঐ': 'Oi', 'ও': 'Oh', 'ঔ': 'Ou',
  'ক': 'Kaw', 'খ': 'Khaw', 'গ': 'Gaw', 'ঘ': 'Ghaw', 'ঙ': 'Umo',
  'চ': 'Chaw', 'ছ': 'Chhaw', 'জ': 'Jaw', 'ঝ': 'Jhaw', 'ঞ': 'Eeyo',
  'ট': 'Taw', 'ঠ': 'Thaw', 'ড': 'Daw', 'ঢ': 'Dhaw', 'ণ': 'Naw',
  'ত': 'Taw', 'থ': 'Thaw', 'দ': 'Daw', 'ধ': 'Dhaw', 'ন': 'Naw',
  'প': 'Paw', 'ফ': 'Faw', 'ব': 'Baw', 'ভ': 'Bhaw', 'ম': 'Maw',
  'য': 'Jaw', 'র': 'Raw', 'ল': 'Law', 'শ': 'Shaw', 'ষ': 'Shaw', 'স': 'Saw', 'হ': 'Haw',
  'ড়': 'Raw', 'ঢ়': 'Rhaw', 'য়': 'Yaw',
  'অজগর': 'Ojogor', 'আম': 'Aam', 'ইলিশ': 'Eelish', 'ঈগল': 'Eegol', 'উট': 'Oot',
  'ঊর্মি': 'Oormee', 'ঋতু': 'Reetu', 'একতারা': 'Ektara', 'ঐরাবত': 'Oirabot',
  'ওল': 'Ol', 'ঔষধ': 'Oushodh', 'কলা': 'Kola', 'খরগোশ': 'Khorgosh',
  'গরু': 'Goru', 'ঘুড়ি': 'Ghooree', 'চাঁদ': 'Chaad', 'ছাতা': 'Chhata',
  'জাহাজ': 'Jahaj', 'তারা': 'Tara', 'নৌকা': 'Nouka', 'পাখি': 'Pakhee',
  'ফুল': 'Phool', 'বাঘ': 'Baagh', 'মাছ': 'Maachh', 'মা': 'Maa', 'বাবা': 'Baba',
  'নদী': 'Nodee', 'সূর্য': 'Shoorjo', 'বই': 'Boi',
  'লাল': 'Laal', 'নীল': 'Neel', 'হলুদ': 'Holud', 'সবুজ': 'Shobuj',
  'গোলাপি': 'Golapee', 'বেগুনি': 'Begunee', 'কমলা': 'Komola', 'সাদা': 'Shada',
  'কালো': 'Kalo', 'রং': 'Rong', 'রঙ': 'Rong',
  'আতা': 'Aata', 'গাছে': 'Gaachhe', 'তোতা': 'Tota', 'ডালিম': 'Dalim', 'মৌ': 'Mou',
  'ভোর': 'Bhor', 'হলো': 'Holo', 'দোর': 'Dor', 'খোলো': 'Kholo', 'খুকুমণি': 'Khukumoni', 'ওঠো': 'Otho', 'রে': 'Ray',
  'হাট্টিমাটিম': 'Hattimatim', 'টিম': 'Teem', 'মাঠে': 'Maathe', 'পাড়ে': 'Paare', 'ডিম': 'Deem',
  'শিং': 'Sheeng', 'কদম': 'Kodom', 'তলায়': 'Tolay', 'কে': 'Kay',
  'আয়': 'Aay', 'ছেলেরা': 'Chhelera', 'মেয়েরা': 'Meyera', 'তুলিতে': 'Tulite', 'যাই': 'Jaai'
};

export function transliterateBanglaToPhonetic(text: string): string {
  let result = text;
  // Replace mapped phrases and words
  for (const [bn, en] of Object.entries(BANGLA_WORD_PHONETICS)) {
    result = result.split(bn).join(en + ' ');
  }

  const charMap: Record<string, string> = {
    'অ': 'aw', 'আ': 'aa', 'ই': 'ee', 'ঈ': 'ee', 'উ': 'oo', 'ঊ': 'oo', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n',
    'া': 'aa', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ৃ': 'ri',
    'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', '্': ''
  };

  return result.replace(/[\u0980-\u09FF]/g, (ch) => charMap[ch] || ch).replace(/\s+/g, ' ').trim();
}

function refreshVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

export function setVoiceEnabled(val: boolean) {
  voiceEnabled = val;
  if (!val) {
    stopSpeech();
  }
}

export function setSpeechMode(mode: 'bn' | 'en' | 'both') {
  preferredSpeechMode = mode;
}

export function getSpeechMode(): 'bn' | 'en' | 'both' {
  return preferredSpeechMode;
}

export function isVoiceEnabled(): boolean {
  return voiceEnabled;
}

function cleanupAudioElement() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = '';
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (currentBlobUrl) {
    try {
      URL.revokeObjectURL(currentBlobUrl);
    } catch {
      // ignore
    }
    currentBlobUrl = null;
  }
}

export function stopSpeech() {
  speechEpoch += 1;
  if (webSpeechTimer !== null) {
    clearTimeout(webSpeechTimer);
    webSpeechTimer = null;
  }
  if (currentAbort) {
    currentAbort.abort();
    currentAbort = null;
  }
  cleanupAudioElement();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

function findBestNativeVoice(lang: 'bn-BD' | 'en-US'): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (lang === 'bn-BD') {
    return (
      voices.find((v) => v.lang.toLowerCase() === 'bn-bd') ||
      voices.find((v) => v.lang.toLowerCase() === 'bn_bd') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('bn-bd')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('bn-in')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('bn')) ||
      voices.find((v) => v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla'))
    );
  }
  return (
    voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('natural')) ||
    voices.find((v) => v.lang.startsWith('en-US')) ||
    voices.find((v) => v.lang.startsWith('en'))
  );
}

function speakWithWebSpeechFallback(text: string, targetLang: 'bn-BD' | 'en-US', epoch: number) {
  if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  if (epoch !== speechEpoch) return;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const nativeBnVoice = findBestNativeVoice('bn-BD');
  const hasBangla = /[\u0980-\u09FF]/.test(text);

  let textToSpeak = text;
  let chosenVoice = nativeBnVoice;
  let voiceLang: string = targetLang;

  if (hasBangla) {
    if (nativeBnVoice) {
      // Native Bengali voice is available in the browser!
      textToSpeak = text;
      chosenVoice = nativeBnVoice;
      voiceLang = 'bn-BD';
    } else {
      // No native Bengali voice installed: transliterate to phonetic syllables!
      // This produces crystal-clear, understandable Bangla audio on Windows/Chrome/Edge/Mac
      textToSpeak = transliterateBanglaToPhonetic(text);
      chosenVoice =
        voices.find((v) => v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('en-in')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().startsWith('en')) ||
        voices[0];
      voiceLang = chosenVoice?.lang || 'en-US';
    }
  } else {
    chosenVoice = findBestNativeVoice(targetLang);
  }

  try {
    window.speechSynthesis.cancel();
    webSpeechTimer = window.setTimeout(() => {
      if (!voiceEnabled || epoch !== speechEpoch) return;
      try {
        window.speechSynthesis.resume?.();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = voiceLang;
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
        utterance.pitch = 1.15; // Cheerful, warm kid-friendly tone
        utterance.rate = 0.88;  // Clear, crisp narration speed
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }, 35);
  } catch {
    // ignore
  }
}

function base64ToBlobUrl(base64: string, mimeType = 'audio/mpeg'): string {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

interface TtsResult {
  audioBase64: string;
  mimeType: string;
}

const audioPayloadCache = new Map<string, TtsResult>();

async function fetchTtsAudioBase64(
  text: string,
  lang: 'bn-BD' | 'en-US',
  signal: AbortSignal
): Promise<TtsResult> {
  const cacheKey = `${lang}:${text}`;
  const cached = audioPayloadCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const reqPromise = (async () => {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`TTS HTTP ${res.status}`);
    }

    const data = (await res.json()) as { audioBase64?: string; mimeType?: string };
    if (!data.audioBase64) {
      throw new Error('Missing audioBase64 in TTS response');
    }

    const result: TtsResult = {
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/mpeg',
    };

    if (audioPayloadCache.size >= MAX_CLIENT_CACHE) {
      const oldest = audioPayloadCache.keys().next().value;
      if (oldest) {
        audioPayloadCache.delete(oldest);
      }
    }
    audioPayloadCache.set(cacheKey, result);
    return result;
  })();

  return await reqPromise;
}

async function playBase64Audio(base64: string, mimeType: string, epoch: number): Promise<void> {
  if (!voiceEnabled || epoch !== speechEpoch || typeof window === 'undefined') return;

  cleanupAudioElement();
  const blobUrl = base64ToBlobUrl(base64, mimeType);
  currentBlobUrl = blobUrl;

  const audio = new Audio(blobUrl);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) {
      cleanupAudioElement();
    }
  };
  audio.onerror = () => {
    if (currentAudio === audio) {
      cleanupAudioElement();
    }
  };

  await audio.play();
}

export function speakText(text: string, lang?: 'en-US' | 'bn-BD') {
  if (!voiceEnabled || typeof window === 'undefined') {
    return;
  }

  const trimmed = text.trim();
  if (!trimmed) return;

  stopSpeech();
  const epoch = speechEpoch;

  const hasBanglaChars = /[\u0980-\u09FF]/.test(trimmed);
  const targetLang: 'bn-BD' | 'en-US' =
    lang || (hasBanglaChars || preferredSpeechMode !== 'en' ? 'bn-BD' : 'en-US');

  const controller = new AbortController();
  currentAbort = controller;

  // Always attempt pure native Bangladeshi speech from server first
  void fetchTtsAudioBase64(trimmed, targetLang, controller.signal)
    .then(async ({ audioBase64, mimeType }) => {
      if (!voiceEnabled || epoch !== speechEpoch) return;
      await playBase64Audio(audioBase64, mimeType, epoch);
    })
    .catch((err) => {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (!voiceEnabled || epoch !== speechEpoch) return;
      speakWithWebSpeechFallback(trimmed, targetLang, epoch);
    });
}

export function speakBilingual(bnText: string, enText: string) {
  if (preferredSpeechMode === 'en') {
    speakText(enText, 'en-US');
  } else {
    speakText(bnText, 'bn-BD');
  }
}

export function speakBangla(bnText: string) {
  audioManager.playVoicePrompt();
  speakText(bnText, 'bn-BD');
}
