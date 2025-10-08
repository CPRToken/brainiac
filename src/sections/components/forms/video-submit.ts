// src/sections/components/forms/video-submit.ts
import { useState } from 'react';
import { getAuth } from 'firebase/auth';

const useVideoSubmit = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const videoSubmit = async (
    prompt: string,
    duration: number = 4,
    size: string = "1280x720",
    model: string = "sora-2"
  ) => {
    setIsLoading(true);
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const response = await fetch("/api/sora", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, duration, size, model }),
      });

      const data = await response.json();

      if (data.video) {
        setVideoUrl(data.video); // base64 video string
      } else {
        console.error("Failed to generate video:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { videoSubmit, videoUrl, setVideoUrl, isLoading };
};

export default useVideoSubmit;
