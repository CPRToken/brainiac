import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ref, listAll } from 'firebase/storage';
import { auth, storage } from 'src/libs/firebase';
import { paths } from 'src/paths';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {tokens} from "../../../locales/tokens";
import {useTranslation} from "react-i18next";


const TIME_PER_IMAGE = 30; // Average time in minutes spent on creating and editing an image
const COST_PER_IMAGE = 5.0; // Cost per image in dollars

export const OverviewDoneImages: FC = () => {
  const [imageCount, setImageCount] = useState(0);
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
    const fetchImageCount = async () => {
      if (!uid) return;
      try {
        const imagesRef = ref(storage, `/${uid}/images/`);
        const imagesList = await listAll(imagesRef);

        const totalImages = imagesList.items.length;
        const moneySaved = totalImages * COST_PER_IMAGE;
        const totalTimeSavedInMinutes = totalImages * TIME_PER_IMAGE;

        setImageCount(totalImages);
        setMoneySaved(moneySaved);
        setTimeSaved(totalTimeSavedInMinutes);
      } catch (error) {
        console.error('Error fetching image count:', error);
      }
    };

    if (uid) {
      fetchImageCount();
    }
  }, [uid]);

  const formatTimeSaved = (timeInMinutes: number) => {
    if (timeInMinutes < 60) {
      return `${timeInMinutes.toFixed(2)} minutes`;
    } else {
      const hours = timeInMinutes / 60;
      return `${hours.toFixed(2)} hrs`;
    }
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
        {/* Image Icon */}
        <div>
          <img src="/assets/iconly/iconly-glass-video.svg" width={48} />
        </div>

        {/* Combined Metrics */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="text.secondary" variant="body1">
            <Link href={paths.dashboard.myImages} underline="hover">
              <a style={{ textDecoration: 'none', color: 'inherit' }}>
                {t(tokens.nav.myImages)}
              </a>
            </Link>
          </Typography>
          <Typography
            color="text.primary"
            align={"center"}
            variant="h5"sx={{ mt: 1 }}>
            {imageCount}
          </Typography>
          <Typography color="text.secondary"
                      variant="body2"
                      align={"center"}
                      sx={{ mt: 1 }} >
            ${moneySaved.toFixed(2)} {t(tokens.form.moneySaved)}
          </Typography>
          <Typography
            color="text.secondary"
            align={"center"}
            variant="body2">
            {formatTimeSaved(timeSaved)} {t(tokens.form.timeSaved)}
          </Typography>
        </Box>
      </Stack>




    </Card>
  );
};

OverviewDoneImages.propTypes = {
  amount: PropTypes.number,
};
