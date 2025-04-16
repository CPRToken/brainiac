//src/sections/components/forms/azure-speak.ts
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const useAzureSpeak = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async (text: string): Promise<void> => {
    setIsSpeaking(true);
    try {
      if (!text.includes('|')) throw new Error('Invalid input format');

      const [inputText, voiceLang] = text.split('|');

      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.lang = voiceLang;

      // Optional: pick voice from browser's available list
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang === voiceLang);
      if (matchedVoice) utterance.voice = matchedVoice;

      window.speechSynthesis.speak(utterance);

      utterance.onend = () => setIsSpeaking(false);
    } catch (err) {
      console.error('Browser TTS failed:', err);
      setIsSpeaking(false);
    }
  };

  return { handleSpeak, isSpeaking };
};

export default useAzureSpeak;
