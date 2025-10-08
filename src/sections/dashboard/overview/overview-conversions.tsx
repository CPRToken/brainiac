import React, { FC, useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, auth } from 'src/libs/firebase';
import { Card, Typography, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import {useTranslation} from "react-i18next";
import {tokens} from "../../../locales/tokens";
import Link from "@mui/material/Link";
import {paths} from "../../../paths";




export const OverviewConversions: FC = () => {
  const [contentCount, setContentCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
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
    const fetchContentData = async (uid: string) => {
      const contentQuery = query(collection(db, `users/${uid}/content`));
      const contentSnapshot = await getDocs(contentQuery);

      let totalWordCount = 0;
      contentSnapshot.forEach((doc) => {
        const data = doc.data();
        const htmlContent = data.htmlContent;
        if (htmlContent) {
          const words = htmlContent.split(/\s+/).filter((word: string) => word.length > 0).length;
          totalWordCount += words;
        }
      });

      const contentCount = contentSnapshot.size;
      const moneySaved = totalWordCount * 0.1;
      const writingTimeSavedInMinutes = totalWordCount / 40;
      const totalResearchTimeInMinutes = contentCount * 30;
      const totalTimeSavedInMinutes = writingTimeSavedInMinutes + totalResearchTimeInMinutes;

      setContentCount(contentCount);
      setWordCount(totalWordCount);
      setMoneySaved(moneySaved);
      setTimeSaved(totalTimeSavedInMinutes);
    };

    if (uid) {
      fetchContentData(uid);
    }
  }, [uid]);



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

        <div>
          <img src="/assets/iconly/iconly-glass-chart.svg" width={48}/>
          </div>


        {/* Combined Metrics */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="text.primary"

            variant="body1">
           Conversions
          </Typography>

          <Typography
            color="text.primary"
            align={"center"}
            variant="h5"sx={{ mt: 1, mb: 1 }}>

            {contentCount}</Typography>


            {/* Right Column */}




        </Box>
      </Stack>
    </Card>
  );
}
