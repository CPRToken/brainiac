import { auth } from 'src/libs/firebase';



export const handleSaveImage = (url: string, index: number) => {
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  if (uid === null) {
    alert('User is not authenticated');
    return;
  }

  fetch('/api/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: url, uid }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.url) {
        console.log(`Image saved to Firebase Storage. URL: ${data.url}`);
      } else {
        console.error('Failed to save image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error saving image:', error);
    });
};
