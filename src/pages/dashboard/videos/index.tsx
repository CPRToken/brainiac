import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { Grid, Box,  Stack, Button, Typography, Container, SvgIcon } from '@mui/material';
import { Seo } from 'src/components/seo';
import { VideoUploader } from '../../../sections/dashboard/videos/video-uploader';
import { db, auth, storage } from 'src/libs/firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { useSettings } from 'src/hooks/use-settings';
import { useDialog } from 'src/hooks/use-dialog';
import { StorageStats } from 'src/sections/dashboard/file-manager/storage-stats';
import { useRouter } from 'next/router'
import { getMetadata } from 'firebase/storage';
import { usePopover } from "src/hooks/use-popover"
import Popover from '@mui/material/Popover';



// Get the current user





type View = 'grid' | 'list';




const Page: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const settings = useSettings();
  const uploadDialog = useDialog();
  const user = auth.currentUser;
  const uid = user ? user.uid : null;
  const { anchorRef, handleOpen, handleClose, open: popoverOpen } = usePopover();
    const [videoUrls, setVideoUrls] = useState<{ url: string; videoId: string; }[]>([]);

  const [userUrl, setUserUrl] = useState('');


  useEffect(() => {
    const fetchUserDetails = async () => {
      if (uid) {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.userUrl) {
            setUserUrl(data.userUrl);
          }
        }
      }
    };
    fetchUserDetails();
  }, [uid]);


    const handleItemOpen = (url: string, videoId: string) => {
    if (!url) return console.error('URL is undefined');
    handleOpen();
    const videoName = decodeURIComponent(url.split('/').pop()?.split('?')[0] || '').split('/').pop();
    if (videoName) router.push(`/${userUrl}/videos/${videoName}`, undefined, { shallow: true });
  };

  const fetchVideos = () => {
    if (!uid) return;
    const videosListRef = ref(storage, `/${uid}/videos/`);
      setVideoUrls([]);
      let totalSize = 0;

    listAll(videosListRef).then(response => {
      response.items.forEach(item => {
        getDownloadURL(item).then(url => {
          setVideoUrls(prev => [...prev, { url, videoId: item.name }]);
        });

          getMetadata(item).then(metadata => {
              totalSize += metadata.size; // Add to total size
          });
      });

    });
  };

    useEffect(fetchVideos, [uid]);


  return (
    <>
      <Seo title="Dashboard: Videos" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
            <Grid
                container
                spacing={3}>

            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">Videos</Typography>
                </div>
                  <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                  >
                      <Button
                          onClick={uploadDialog.handleOpen}
                          startIcon={
                              <SvgIcon>
                                  <Upload01Icon />
                              </SvgIcon>
                          }
                          variant="contained"
                          sx={{
                              fontSize: {
                                  xs: '0.8rem',  // Smaller text on extra-small screens
                                  md: '0.9rem'  // Normal text on medium screens and up
                              },
                              padding: {
                                  xs: '6px 12px',  // Smaller padding on extra-small screens
                                  md: '8px 20px'  // Normal padding on medium screens and up
                              }
                          }}
                      >
                          Subir Video
                      </Button>
                  </Stack>
              </Stack>
            </Grid>
                <Grid item xs={12} md={8}>
                    <Stack
                        spacing={{
                            xs: 2,
                            lg: 4,
                        }}
                    >
                    </Stack>

                    <Grid container spacing={0}>
                        {videoUrls.map(({ url, videoId }, index) => (
                            <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
                                <div onClick={() => {

                                    handleItemOpen(url, videoId);
                                } }
                                     style={{ padding: '8px' }}>
                                    <video
                                        style={{
                                            width: '100%', // Takes the full width of the container
                                            height: 'auto', // Adjusts the height automatically
                                            objectFit: 'cover',
                                            aspectRatio: '1/1',
                                            borderRadius: '0.3rem'
                                        }}
                                    >
                                        <source src={url} type="video/mp4" />
                                    </video>
                                </div>
                            </Grid>

                        ))}
                        <Popover
                            open={popoverOpen}
                            anchorEl={anchorRef.current}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'center',
                            }}
                        >
                            <div style={{ maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden' }}>


                            </div>
                        </Popover>


                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{
                        padding: {
                            xs: '8px',  // Smaller padding on extra-small screens
                            md: '0px'  // Normal padding on medium screens and up
                        }
                    }}>
                        <StorageStats />
                    </Box>
                </Grid>
            </Grid>
        </Container>
      </Box>

        <VideoUploader

          title={title}
          description={description}
            onClose={uploadDialog.handleClose}
            open={uploadDialog.open}
            onUploadSuccess={fetchVideos}

        />
    </>

);
}
  Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

  export default Page;
