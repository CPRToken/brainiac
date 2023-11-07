import { useState } from 'react';

const useImageSubmit = () => {
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);

  const imageSubmit = async (prompt: string) => {
    try {
      const response = await fetch('/api/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();

      if (data.imageUrl) {
        setOpenAIResponse(data.imageUrl);
      }
      else {
        console.error("Failed to get content.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return { imageSubmit, openAIResponse, setOpenAIResponse };
};

export default useImageSubmit;
