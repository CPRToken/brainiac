import React, { FC } from 'react';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from 'src/libs/firebase';
import Typography from '@mui/material/Typography';
import { tokens } from '../../locales/tokens';
import { useTranslation } from 'react-i18next';
import { typography } from '../../theme/typography';
import LinearProgress from '@mui/material/LinearProgress';

const TRIAL_WORD_LIMIT = 1500;

export const TrialPlan: FC = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUid = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUid(currentUser.uid);
      }
    };

    fetchUid();
  }, []);

  useEffect(() => {
    const fetchContentData = async (uid: string) => {
      if (!uid) return;

      // Fetch the user's current plan from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        console.error(`User document not found for UID: ${uid}`);
        return;
      }

      const userData = userDoc.data();
      const currentPlan = userData?.plan;

      if (currentPlan !== 'Trial') {
        return; // Only process if the user is on a Trial plan
      }

      const contentQuery = query(collection(db, `users/${uid}/content`));
      const contentSnapshot = await getDocs(contentQuery);

      let totalWordCount = 0;
      contentSnapshot.forEach(doc => {
        const data = doc.data();
        const htmlContent = data.htmlContent; // Assuming content is stored in a field called 'htmlContent'
        if (htmlContent) {
          const words = htmlContent.split(/\s+/).filter((word: string) => word.length > 0).length;
          totalWordCount += words;
        }
      });

      setProgress((totalWordCount / TRIAL_WORD_LIMIT) * 100);

      // Check if the user has reached the trial word limit
      if (totalWordCount >= TRIAL_WORD_LIMIT) {
        await updateDoc(doc(db, 'users', uid), {
          plan: 'Expired'
        });
        console.log(`User ${uid}'s trial has expired due to reaching the word limit.`);
      }
    };

    if (uid) {
      fetchContentData(uid);
    }
  }, [uid]);

  return (
    <div>
      <Typography sx={{ ...typography.body2, textAlign: 'left', pl: 2, mb: 2 }}>
        {t(tokens.form.trialPlanProgress)}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: '15px', borderRadius: '5px' }}  // You can increase the height as needed
      />

    </div>
  );
};
