//src/sections/components/forms/chat-submit.ts
import { useState } from 'react';

const useChatSubmit = () => {
    const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);  // Add a loading state

  const handleSubmit = async (prompt: string, maxTokens: number) => {
    setIsLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: [prompt], // Wrap the prompt in an array
          max_tokens: maxTokens, // Ensure the property name matches the API's expected field
        }),
      });

      const data = await response.json();

      if (data.content) {
        setOpenAIResponse(data.content);
      } else {
        console.error("Failed to get documents.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Set loading to false when the request completes or fails
    }
  };


  return { handleSubmit, openAIResponse, isLoading };  // Return the loading state along with other states
};

export default useChatSubmit;
