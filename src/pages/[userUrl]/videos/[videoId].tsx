import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDocs, query, collection, where } from "firebase/firestore";
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, db, storage } from 'src/libs/firebase';
import { onAuthStateChanged } from "firebase/auth";

const VideoPage = () => {
  const router = useRouter();
  const { userUrl, videoId } = router.query;
  const [videoUrl, setVideoUrl] = useState('');



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {


      if (user) {
        if (videoId && userUrl) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('userUrl', '==', userUrl));
          const querySnapshot = await getDocs(q);
      let uid = null;
      querySnapshot.forEach((doc) => {
        uid = doc.id;
      });

          if (uid) {
            const videoRef = ref(storage, `${uid}/videos/${videoId}`);
            try {
              const url = await getDownloadURL(videoRef);
              setVideoUrl(url);
            } catch (error) {
              console.error('Error getting video URL: ', error);
            }
          }
        }
      } else {
        console.log('Not authenticated');
      }
    });

    return () => unsubscribe();
  }, [videoId, userUrl]);

  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '0px' }}>
        {videoUrl ? (
            <video width="700" height="700" controls style={{ objectFit: 'cover' }}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        ) : (
            'Loading...'
        )}
      </div>
  );
};

export default VideoPage;
