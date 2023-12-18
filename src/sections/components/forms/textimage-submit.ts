import { useState, useCallback } from 'react';
import useGPT4Submit from "./gpt4-submit";
import useImageSubmit from './image-submit';

const TextImageSubmit = () => {
  const { handleSubmit: handleTextSubmit, openAIResponse: textResponse, isLoading: isTextLoading } = useGPT4Submit();
  const { imageSubmit, openAIResponse: images, isLoading: isImageLoading } = useImageSubmit();

  const [combinedLoading, setCombinedLoading] = useState(false);

  const combinedSubmit = useCallback(async (prompt: string, maxTokens: number) => {
    setCombinedLoading(true);
    await handleTextSubmit(prompt, maxTokens); // Handle text submission
    await imageSubmit(prompt); // Then, handle image submission
    setCombinedLoading(false);
  }, [handleTextSubmit, imageSubmit]);

  return {
    combinedSubmit,
    textResponse,
    images,
    isLoading: combinedLoading || isTextLoading || isImageLoading
  };
};

export default TextImageSubmit;
