//src/sections/components/forms/grok-vision-submit.ts
import { useState } from 'react';
import { getAuth } from 'firebase/auth';

const useGrokVisionSubmit = () => {
  const [grokResponse, setGrokResponse] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const imageSubmit = async (imageUrl: string, prompt: string) => {
    setIsLoading(true);
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const response = await fetch('/api/grok-vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, prompt }),
      });

      const data = await response.json();

      if (data.response) {
        setGrokResponse(data.response);
      } else {
        console.error('Failed to get response:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return { imageSubmit, grokResponse, setGrokResponse, isLoading };
};

export default useGrokVisionSubmit;
