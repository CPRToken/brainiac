import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from 'src/libs/firebase';
import { typography } from "../../../theme/typography";
import { tokens } from "../../../locales/tokens";
import { paths } from "../../../paths";

const COST_PER_WORD = 0.10; // Cost per word in dollars

interface OverviewContentProps {}

interface ContentData {
  content: string;
  htmlContent: string;
  category: string;
  createdAt: Date;
}

export const OverviewContent: FC<OverviewContentProps> = (props) => {
  const { t } = useTranslation();
  const [contentCount, setContentCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [uid, setUid] = useState<string | null>(null);

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
        const data = doc.data() as ContentData;
        const htmlContent = data.htmlContent;
        if (htmlContent) {
          const words = htmlContent.split(' ').filter((word: string) => word.length > 0).length;
          totalWordCount += words;
        }
      });

      const contentCount = contentSnapshot.size;
      const moneySaved = totalWordCount * COST_PER_WORD;

      setContentCount(contentCount);
      setWordCount(totalWordCount);
      setMoneySaved(moneySaved);
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
        spacing={1}
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{...typography.body2, mb: 1, mt: 1, pl: 2, pr: 0, textAlign: 'left'}}>{t(tokens.headings.myContent)}</Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 2, py: 1 }}>

        <Typography sx={{...typography.body2, mb: 1, mt: 1, pl: 1, pr: 0, textAlign: 'left'}}>
          {contentCount} {t(tokens.form.articlesGen)}  </Typography>

        <Typography sx={{...typography.body2, mb: 1, mt: 1, pl: 1, pr: 0,
          textAlign:''}}>{wordCount} {t(tokens.form.wordsUsed)}
        </Typography>

        <Typography sx={{...typography.body2, mb: 1, mt: 1, pl: 1, pr: 0, textAlign: 'left'}}>
          {t(tokens.form.moneySaved)}: ${moneySaved.toFixed(2)}
        </Typography>
      </CardActions>

    </Card>
  );
};

OverviewContent.propTypes = {
  amount: PropTypes.number.isRequired,
};

