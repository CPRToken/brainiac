//src/sections/components/forms/grokchat-submit.ts
import { useState } from 'react';

const useGrokChatSubmit = () => {
  const [openAIResponse, setOpenAIResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);
    setOpenAIResponse(''); // Reset response before new submission

    try {
      const response = await fetch('/api/grokchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          setOpenAIResponse((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error('Error during streaming:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, openAIResponse, isLoading };
};

export default useGrokChatSubmit;
