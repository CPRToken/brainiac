import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const useGrokSubmit = () => {
  const [grokResponse, setGrokResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      console.log('No user logged in');

    }
  }, []);

  const handleSubmit = async (prompt: string, maxTokens: number): Promise<string | undefined> => {
    setIsLoading(true);
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure token is attached
        },
        body: JSON.stringify({ prompt: [prompt], max_tokens: maxTokens }),
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setGrokResponse(data.content);
        return data.content;
      } else {
        console.error('Failed to get response from Grok.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, grokResponse, isLoading };
};

export default useGrokSubmit;
