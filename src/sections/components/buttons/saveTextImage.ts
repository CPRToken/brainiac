import { auth } from 'src/libs/firebase'; // Auth import for user details

// Function to upload image to Firebase Storage




// Adjusted saveTextImage function
export const saveTextImage = async (textResponse: string, title: string, category: string, image: string) => {
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


  const shortDescription = createShortDescription(textResponse);

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

      image,
      shortDescription,
      uid,
       // Directly use the images array
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
