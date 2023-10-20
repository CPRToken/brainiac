import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { getDownloadURL, ref } from 'firebase/storage';
import { auth, storage } from 'src/libs/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';







const DocPage = () => {
  const router = useRouter();
  const user = auth.currentUser;
    const uid = user ? user.uid : null;
  const { userUrl, itemId } = router.query;

  const [docUrl, setDocUrl] = useState<string | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // existing code...
        if (user) {
          // ...
          if (uid) {
            const docRef = ref(storage, `${uid}/documentos/${itemId}`);
            try {
              const url = await getDownloadURL(docRef);
              setDocUrl(url);
              console.log('Document URL set:', url);  // Log 1
            } catch (error) {
              console.error('Error getting doc URL: ', error);  // Log 2
            }
          }
        } else {
          console.log('Not authenticated');  // Log 3
        }
      } catch (e) {
        console.error('Error in onAuthStateChanged:', e);  // Log 4
      }
    });

    return () => unsubscribe();
  }, [itemId, userUrl, uid]); //


  return (
      <div>
        {docUrl && (
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer fileUrl={docUrl} />
            </Worker>
        )}
      </div>
  );

}

export default DocPage;
