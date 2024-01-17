import { useState } from 'react';

const useImageSubmit = () => {
  const [openAIResponse, setOpenAIResponse] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);  // Add a loading state

  const imageSubmit = async (prompt: string, n: number = 1, size: string = "1024x1024", model: string = "dall-e-3") => {
    setIsLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch('/api/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, n: 1, size, model }), // Set n to 1 as required by the API
      });

      const data = await response.json();

      if (data.images) {
        // Assuming each image object has a 'url' property
        const imageUrls = data.images.map((img: { url: string }) => img.url);
        setOpenAIResponse(imageUrls);
      } else {
        console.error("Failed to get images:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Stop loading when request is complete or fails
    }
  };

  return { imageSubmit, openAIResponse, setOpenAIResponse, isLoading };
};

export default useImageSubmit;
