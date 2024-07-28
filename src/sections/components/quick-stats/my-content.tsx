import type { FC } from 'react';
import CurrencyDollarIcon from '@untitled-ui/icons-react/build/esm/CurrencyDollar';
import FolderIcon from '@untitled-ui/icons-react/build/esm/Folder';

import { collection, query, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';
import { db, storage, auth } from 'src/libs/firebase';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';



export const MyContent: FC = () => {
  const [contentCount, setContentCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
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
    const fetchContentCount = async () => {
      if (!uid) return;
      try {
        const contentQuery = query(collection(db, `users/${uid}/content`));
        const contentSnapshot = await getDocs(contentQuery);
        setContentCount(contentSnapshot.size);
      } catch (error) {
        console.error('Error fetching content count:', error);
      }
    };

    const fetchImageCount = async () => {
      if (!uid) return;
      try {
        const imagesRef = ref(storage, `/${uid}/images/`);
        const imagesList = await listAll(imagesRef);
        setImageCount(imagesList.items.length);
        console.log(`Fetched ${imagesList.items.length} images`);
        console.log(imagesList.items); // Log the items array
      } catch (error) {
        console.error('Error fetching image count:', error);
      }
    };

    if (uid) {
      fetchContentCount();
      fetchImageCount();
    }
  }, [uid]);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
        p: 3,
      }}
    >
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ p: 3 }}
            >
              <Stack
                spacing={1}
                sx={{ flexGrow: 1 }}
              >
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Number of Articles
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="h5">{contentCount}</Typography>
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
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ p: 3 }}
            >
              <Stack
                spacing={1}
                sx={{ flexGrow: 1 }}
              >
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Number of Images
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
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
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ p: 3 }}
            >
              <Stack
                spacing={1}
                sx={{ flexGrow: 1 }}
              >
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Money Saved
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="h5">123</Typography>
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
      </Grid>
    </Box>
  );
};
