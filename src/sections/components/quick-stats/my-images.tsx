import type { FC } from 'react';
import CurrencyDollarIcon from '@untitled-ui/icons-react/build/esm/CurrencyDollar';
import FolderIcon from '@untitled-ui/icons-react/build/esm/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ref, listAll } from 'firebase/storage';
import { auth, storage } from 'src/libs/firebase';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

const TIME_PER_IMAGE = 30; // Average time in minutes spent on creating and editing an image
const COST_PER_IMAGE = 5.00; // Cost per image in dollars

export const MyImages: FC = () => {
  const [imageCount, setImageCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
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
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography color="text.secondary" variant="overline">
                  Number of Images
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="h5">{imageCount}</Typography>
                </Stack>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  height: 48,
                  width: 48,
                }}
              >
                <SvgIcon>
                  <FolderIcon />
                </SvgIcon>
              </Avatar>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography color="text.secondary" variant="overline">
                  Money Saved
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="h5">${moneySaved.toFixed(2)}</Typography>
                </Stack>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  height: 48,
                  width: 48,
                }}
              >
                <SvgIcon>
                  <CurrencyDollarIcon />
                </SvgIcon>
              </Avatar>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography color="text.secondary" variant="overline">
                  Time Saved
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="h5">{formatTimeSaved(timeSaved)}</Typography>
                </Stack>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  height: 48,
                  width: 48,
                }}
              >
                <SvgIcon>
                  <AccessTimeIcon />
                </SvgIcon>
              </Avatar>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
