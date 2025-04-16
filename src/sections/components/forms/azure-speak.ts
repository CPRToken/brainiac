//src/sections/components/forms/azure-speak.ts
import { useState } from 'react';
import { getAuth } from 'firebase/auth';

const useAzureSpeak = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async (text: string): Promise<void> => {
    setIsSpeaking(true);
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const response = await fetch('/api/azure-translator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Azure Speech API failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Azure TTS failed:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return { handleSpeak, isSpeaking };
};

export default useAzureSpeak;
