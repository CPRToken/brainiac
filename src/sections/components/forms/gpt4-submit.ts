//src/sections/components/forms/gpt4-submit.ts
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const useGPT4Submit = () => {
    const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);  // Add a loading state

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      console.log('No user logged in');
      // Handle unauthenticated scenario or redirect to login
    }
  }, []);


  const handleSubmit = async (prompt: string, maxTokens: number): Promise<string | undefined> => {
    setIsLoading(true);
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const response = await fetch('/api/gpt4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure token is attached
        },
        body: JSON.stringify({ prompt: [prompt], max_tokens: maxTokens }),
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setOpenAIResponse(data.content);
        return data.content; // Return the response content as a string
      } else {
        console.error("Failed to get documents.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return { handleSubmit, openAIResponse, isLoading };  // Return the loading state along with other states
};

export default useGPT4Submit;
