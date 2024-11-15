 //src/hooks/use-save-button.ts
import { useState } from 'react';
import { auth } from 'src/libs/firebase';

const useSaveButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveDoc = async (openAIResponse: string, title: string, category: string) => {
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    if (!uid) {
      alert('User is not authenticated');
      return;
    }

    const createShortDescription = (html: string): string => {
      const text = html.replace(/<[^>]+>/g, '');
      return text.length > 100 ? `${text.substring(0, 100)}...` : text;
    };

    const shortDescription = createShortDescription(openAIResponse);

    setIsLoading(true);  // Set loading to true at the start
    try {
      const response = await fetch('/api/save-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: openAIResponse,
          title,
          uid,
          category,
          shortDescription,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Document saved successfully', data.message);
      } else {
        console.error('Failed to save document:', data.error);
      }
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsLoading(false);  // Set loading to false when done
    }
  };

  return { saveDoc, isLoading }; // Return saveDoc and isLoading
};

export default useSaveButton;
