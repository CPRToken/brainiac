// src/sections/components/forms/gpt5-submit.ts
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const useGPT5Submit = () => {
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (!getAuth().currentUser) console.log('No user logged in'); }, []);

  const handleSubmit = async (prompt: string, maxTokens: number) => {
    setIsLoading(true);
    const token = await getAuth().currentUser?.getIdToken();

    try {
      const res = await fetch('/api/gpt5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        // frontend can keep sending max_tokens; API maps it
        body: JSON.stringify({ prompt: [prompt], max_tokens: maxTokens }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('API error:', res.status, data);
        setOpenAIResponse(`API ${res.status}: ${data?.error ?? 'Unknown error'}`);
        return;
      }

      const content = typeof data?.content === 'string' ? data.content : '';
      setOpenAIResponse(content); // allow ""
      return content || undefined;
    } catch (e) {
      console.error('Request failed:', e);
      setOpenAIResponse('Request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, openAIResponse, isLoading };
};

export default useGPT5Submit;
