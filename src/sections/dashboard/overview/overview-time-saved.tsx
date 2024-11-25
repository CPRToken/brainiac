import React, { FC, useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';
import { db, auth, storage } from 'src/libs/firebase';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {tokens} from "../../../locales/tokens";
import { useTranslation } from "react-i18next";

const TIME_PER_IMAGE = 30; // Time saved per image in minutes


export const OverviewTimeSaved: FC = () => {
  const [contentTimeSaved, setContentTimeSaved] = useState(0);
  const [imageTimeSaved, setImageTimeSaved] = useState(0);
  const [totalTimeSaved, setTotalTimeSaved] = useState(0);
  const [uid, setUid] = useState<string | null>(null);
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
    const calculateTimeSaved = async (uid: string) => {
      try {
        // Fetch content data (articles)
        const contentQuery = query(collection(db, `users/${uid}/content`));
        const contentSnapshot = await getDocs(contentQuery);

        let totalWordCount = 0;
        contentSnapshot.forEach((doc) => {
          const data = doc.data();
          const htmlContent = data.htmlContent || '';
          totalWordCount += htmlContent.split(/\s+/).filter((word: string) => word.length > 0).length;
        });

        const contentCount = contentSnapshot.size;
        const writingTimeSavedInMinutes = totalWordCount / 40;
        const totalResearchTimeInMinutes = contentCount * 30;
        const contentTimeSavedInMinutes = writingTimeSavedInMinutes + totalResearchTimeInMinutes;

        setContentTimeSaved(contentTimeSavedInMinutes);

        // Fetch image data
        const imagesRef = ref(storage, `/${uid}/images/`);
        const imagesList = await listAll(imagesRef);
        const imageTimeSavedInMinutes = imagesList.items.length * TIME_PER_IMAGE;

        setImageTimeSaved(imageTimeSavedInMinutes);

        // Combine both
        const total = contentTimeSavedInMinutes + imageTimeSavedInMinutes;
        setTotalTimeSaved(total);
      } catch (error) {
        console.error('Error calculating time saved:', error);
      }
    };


    if (uid) {
      calculateTimeSaved(uid);
    }
  }, [uid]);

  const formatTimeSaved = (timeInMinutes: number) => {
    if (timeInMinutes < 60) {
      return `${timeInMinutes.toFixed(2)} minutes`;
    }
    const hours = timeInMinutes / 60;
    return `${hours.toFixed(2)} hrs`;
  };


  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3,
        }}
      >
        {/* Icon */}
        <div>
          <img
            src="/assets/iconly/hour-glass.svg"
            width={55}
          />
        </div>

        {/* Data Rows */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Title Row */}
          <Typography
            color="text.secondary"

            variant="body1"

          >
            {t(tokens.headings.timeSaved)}
          </Typography>

          {/* Row 3: Total Time Saved */}
          <Typography
            color="text.primary"
            align={'center'}

            variant="h5"sx={{ mt: 1 }}>

            {formatTimeSaved(totalTimeSaved)}
          </Typography>

          {/* Row 1: Content Time Saved */}
          <Typography
            color="text.secondary"
            align={'center'}
            variant="body2"
            sx={{ mt: 1 }}
          >
            {t(tokens.form.Content)}: {formatTimeSaved(contentTimeSaved)}
          </Typography>

          {/* Row 2: Image Time Saved */}
          <Typography
            color="text.secondary"
            align={'center'}
            variant="body2"
          >
            {t(tokens.form.Images)}: {formatTimeSaved(imageTimeSaved)}
          </Typography>


        </Box>
      </Stack>
    </Card>
  );
};
