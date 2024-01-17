import { useState, useCallback } from 'react';
import useGPT4Submit from "./gpt4-submit";
import useImageSubmit from './image-submit';

const TextImageSubmit = () => {
  const { handleSubmit: handleTextSubmit, openAIResponse: textResponse, isLoading: isTextLoading } = useGPT4Submit();
  const { imageSubmit, openAIResponse: images, isLoading: isImageLoading } = useImageSubmit();

  const [combinedLoading, setCombinedLoading] = useState(false);

  const combinedSubmit = useCallback(async (prompt: string, arg2: number, arg3?: number) => {
    setCombinedLoading(true);
    if (typeof arg3 === 'number') {
      // If three arguments are passed, assume arg2 is maxTokens and arg3 is numImages
      await handleTextSubmit(prompt, arg2); // Handle text submission
      await imageSubmit(prompt, arg3); // Then, handle image submission
    } else {
      // If two arguments are passed, assume arg2 is numImages
      await imageSubmit(prompt, arg2); // Only handle image submission
    }
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
