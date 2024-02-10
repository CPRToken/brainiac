import { auth } from 'src/libs/firebase'; // Auth import for user details

// Function to upload image to Firebase Storage




// Adjusted saveTextImage function
export const saveTextImage = async (textResponse: string, title: string, category: string, imageURL: string) => {
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  if (uid === null) {
    alert('User is not authenticated');
    return;
  }

  // Assuming `images` is an array of URLs
  fetch('/api/save-docimage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: textResponse,
      title,
      category,
      shortDescription: textResponse.substring(0, 100),
      uid,
      imageURL, // Directly use the images array
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Document and images saved successfully', data.message);
      } else {
        console.error('Failed to save document and images:', data.error);
      }
    })
    .catch(error => {
      console.error('Error saving document and images:', error);
    });
};
