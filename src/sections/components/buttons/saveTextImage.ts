import { auth } from 'src/libs/firebase';

// Function to save the HTML docs

const generateHtmlContent = (text: string, imageUrl: string[]): string => {
  const imageHtml = imageUrl.map(url => `<img src="${url}" alt="Embedded Image" style="max-width: 100%; display: block; margin-bottom: 20px;">`).join('');
  return `<div>${text}</div><div>${imageHtml}</div>`;
};



export const saveTextImage = (textResponse: string, title: string, category: string, image: string[]) => {
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  if (uid === null) {
    alert('User is not authenticated');
    return;
  }

  // Generate HTML content with embedded images
  const htmlContent = generateHtmlContent(textResponse, image);

  // Generate short description from textContent, not the HTML content
  const createShortDescription = (text: string): string => {
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  const shortDescription = createShortDescription(textResponse);

  // API call to save the document with HTML content
  fetch('/api/save-docimage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: htmlContent, // Use the generated HTML content here
      title: title,
      uid: uid,
      category: category,
      image: image,
      shortDescription: shortDescription,
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
