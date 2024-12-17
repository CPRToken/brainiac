import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const usePlagSubmit = () => {
  const [plagResponse, setPlagResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      console.log('No user logged in');
      // Handle unauthenticated scenario or redirect to login
    }
  }, []);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);

    const apiKey = process.env.NEXT_PUBLIC_COPYSCAPE_API_KEY; // Use the environment variable
    const apiUsername = process.env.NEXT_PUBLIC_COPYSCAPE_API_USERNAME; // Add your username in .env if needed

    if (!apiKey || !apiUsername) {
      console.error('API key or username is missing');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://www.copyscape.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'u': apiUsername,  // Use your Copyscape username from .env
          'k': apiKey,        // Use the API key from .env
          'o': 'csearch',     // Command for content search
          't': text,          // Text to check for plagiarism
        }).toString(),  // Convert the parameters to a string
      });

      const data = await response.text();  // Copyscape API returns data as text
      setPlagResponse(data);  // Save the plagiarism report
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);  // Stop the loading spinner
    }
  };

  return { handleSubmit, plagResponse, isLoading };
};

export default usePlagSubmit;
