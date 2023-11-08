import { useState } from 'react';

const useHandleSubmit = () => {
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);

  const handleSubmit = async (prompt: string, maxTokens: number) => {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens,
        }),
      });

      const data = await response.json();

      if (data.content) {
        setOpenAIResponse(data.content);
      } else {
        console.error("Failed to get content.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return { handleSubmit, openAIResponse, setOpenAIResponse };
};

export default useHandleSubmit;
