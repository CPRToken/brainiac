// src/sections/components/forms/grok-image-submit.ts
import { useState } from 'react';
import { getAuth } from 'firebase/auth';

const useGrokImageSubmit = () => {
  const [grokResponse, setGrokResponse] = useState<string[]>([]); // Store image URLs
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const imageSubmit = async (prompt: string) => {
    console.log('Submitting Prompt:', prompt); // Debugging

    if (!prompt.trim()) {
      console.error('Prompt is empty.');
      return;
    }

    setIsLoading(true);
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      console.error('Failed to retrieve token.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/grok-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Unknown API error');
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.response?.images) {
        setGrokResponse(data.response.images);
      } else {
        console.error('Unexpected API Response:', data);
        throw new Error('No images returned from the API.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in image generation:', error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { imageSubmit, grokResponse, setGrokResponse, isLoading };
};

export default useGrokImageSubmit;
