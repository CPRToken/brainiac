//src/sections/components/buttons/saveDoc.ts
import { auth } from 'src/libs/firebase';

// Function to save the HTML docs
export const saveDoc = (openAIResponse: string, title: string, category: string) => {
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  if (uid === null) {
    alert('User is not authenticated');
    return;
  }

  const createShortDescription = (html: string): string => {
    const text = html.replace(/<[^>]+>/g, ''); // Strip HTML tags
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };


  const shortDescription = createShortDescription(openAIResponse);


  // Replace '/api/upload-image' with your endpoint for saving documents
  fetch('/api/save-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: openAIResponse, // This matches the corrected parameter usage
      title: title, // Direct use of 'title' as received
      uid: uid, // UID is included if necessary for your backend logic
     category, // Include the category
      shortDescription, // Include the generated short description
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Document saved successfully', data.message);
      } else {
        console.error('Failed to save document:', data.error);
      }
    })
    .catch(error => {
      console.error('Error saving document:', error);
    });
};
