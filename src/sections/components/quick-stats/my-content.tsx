
import React, { FC } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';
import { db, storage, auth } from 'src/libs/firebase';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import {typography} from "../../../theme/typography";
import {tokens} from "../../../locales/tokens";
import { useTheme } from '@mui/material/styles';
import {useTranslation} from "react-i18next";
import SvgColor from "src/components/svg-color";

const COST_PER_WORD = 0.10; // Cost per word in dollars
const AVERAGE_WPM = 40; // Average Words Per Minute
const RESEARCH_TIME_PER_ARTICLE = 30; // Research and thinking time per article in minutes

export const MyContent: FC = () => {
  const [contentCount, setContentCount] = useState(0);

  const [wordCount, setWordCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  const [uid, setUid] = useState<string | null>(null);
  const { t } = useTranslation();
  const theme = useTheme();

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
      contentSnapshot.forEach(doc => {
        const data = doc.data();
        const htmlContent = data.htmlContent; // Assuming content is stored in a field called 'htmlContent'
        if (htmlContent) {
          const words = htmlContent.split(/\s+/).filter((word: string) => word.length > 0).length;
          totalWordCount += words;
        }
      });

      const contentCount = contentSnapshot.size;
      const moneySaved = totalWordCount * COST_PER_WORD;
      const writingTimeSavedInMinutes = totalWordCount / AVERAGE_WPM; // Time saved in minutes for writing
      const totalResearchTimeInMinutes = contentCount * RESEARCH_TIME_PER_ARTICLE; // Total research time for all articles
      const totalTimeSavedInMinutes = writingTimeSavedInMinutes + totalResearchTimeInMinutes; // Total time saved in minutes

      console.log(`Total Word Count: ${totalWordCount}`);
      console.log(`Money Saved: ${moneySaved}`);
      console.log(`Total Writing Time Saved (minutes): ${writingTimeSavedInMinutes}`);
      console.log(`Total Research Time (minutes): ${totalResearchTimeInMinutes}`);
      console.log(`Total Time Saved (minutes): ${totalTimeSavedInMinutes}`);

      setContentCount(contentCount);
      setWordCount(totalWordCount);
      setMoneySaved(moneySaved);
      setTimeSaved(totalTimeSavedInMinutes);
    };

    const fetchImageCount = async () => {
      if (!uid) return;
      try {
        const imagesRef = ref(storage, `/${uid}/images/`);
        const imagesList = await listAll(imagesRef);

        console.log(`Fetched ${imagesList.items.length} images`);
        console.log(imagesList.items); // Log the items array
      } catch (error) {
        console.error('Error fetching image count:', error);
      }
    };

    if (uid) {
      fetchContentData(uid);
      fetchImageCount();
    }
  }, [uid]);

  const formatTimeSaved = (timeInMinutes: number) => {
    if (timeInMinutes < 80) {
      return `${timeInMinutes.toFixed(2)} minutes`;
    } else {
      const hours = timeInMinutes / 80;
      return `${hours.toFixed(2)} hours`;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
        p: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={6} lg={3}>
          <Card elevation={0} sx={{ boxShadow: 'none', p: 0 }}>
          <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography sx={{ ...typography.subtitle1,  textAlign: 'left' ,mb: 2}}>
                  {t(tokens.form.numberArticles)}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ ...typography.subtitle2, textAlign: 'left' }}>{contentCount}</Typography>
                </Stack>
              </Stack>
              <Box
                sx={{
                  height: 80,
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <SvgColor src="/assets/icons/article.svg" sx={{ width: '90%', height: '90%' }} color={theme.palette.primary.main} />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <Card>
            <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography sx={{ ...typography.subtitle1, textAlign: 'left',mb: 2 }}>
                  {t(tokens.form.wordCount)}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ ...typography.subtitle2, textAlign: 'left' }}>{wordCount}</Typography>
                </Stack>
              </Stack>
              <Box
                sx={{
                  height: 80,
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <SvgColor src="/assets/icons/calculator.svg" sx={{ width: '100%', height: '100%' }} color={theme.palette.primary.main} />
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <Card>
            <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography sx={{ ...typography.subtitle1, textAlign: 'left',mb: 2 }}>
                  {t(tokens.form.moneySaved)}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ ...typography.subtitle2, textAlign: 'left' }}>${moneySaved.toFixed(2)}</Typography>
                </Stack>
              </Stack>
              <Box
                sx={{
                  height: 80,
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <SvgColor src="/assets/icons/dollar.svg" sx={{ width: '100%', height: '100%' }} color={theme.palette.primary.main} />
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <Card>
            <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography sx={{ ...typography.subtitle1, textAlign: 'left',mb: 2 }}>
                  {t(tokens.form.timeSaved)}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ ...typography.subtitle2, textAlign: 'left' }}>{formatTimeSaved(timeSaved)}</Typography>
                </Stack>
              </Stack>
              <Box
                sx={{
                  height: 80,
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <SvgColor src="/assets/icons/clock.svg" sx={{ width: '100%', height: '100%' }} color={theme.palette.primary.main} />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
