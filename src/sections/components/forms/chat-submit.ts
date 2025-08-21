// src/sections/components/forms/chat-submit.ts
import { useState } from 'react';

const useChatSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    prompt: string,
    maxTokens: number,
    onToken?: (t: string) => void
  ): Promise<string> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, max_tokens: maxTokens }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        if (onToken) onToken(chunk);
      }

      return fullText; // ✅ return the complete streamed text
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};

export default useChatSubmit;
