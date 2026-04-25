import { useCallback, useEffect, useRef, useState } from "react";

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (enVoices.length === 0) return null;

  // Preference order: Google US English female, Microsoft English, any en-US, any en-GB, any en
  const preferences = [
    (v: SpeechSynthesisVoice) =>
      v.lang === "en-US" && /female|samantha|google.*us|aria|jenny|zira/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang === "en-US" && /google/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang === "en-US",
    (v: SpeechSynthesisVoice) => v.lang === "en-GB",
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
  ];

  for (const pred of preferences) {
    const found = enVoices.find(pred);
    if (found) return found;
  }
  return enVoices[0] ?? null;
}

export function useSpeak() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      const picked = pickEnglishVoice(v);
      if (picked) setVoice(picked);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!supported || typeof window === "undefined") return;
      const synth = window.speechSynthesis;
      synth.cancel(); // cancel any in-flight speech

      const utt = new SpeechSynthesisUtterance(text);
      if (voice) utt.voice = voice;
      utt.lang = voice?.lang ?? "en-US";
      utt.rate = options.rate ?? 0.9;
      utt.pitch = options.pitch ?? 1.05;
      utt.volume = options.volume ?? 1;
      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utt;
      synth.speak(utt);
    },
    [voice, supported],
  );

  const speakSlow = useCallback(
    (text: string) => {
      speak(text, { rate: 0.65, pitch: 1.05 });
    },
    [speak],
  );

  const stop = useCallback(() => {
    if (!supported || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  return { speak, speakSlow, stop, isSpeaking, supported };
}
