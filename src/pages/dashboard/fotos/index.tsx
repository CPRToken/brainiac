import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { ImageViewer } from "../../../sections/components/modals/modal-image";
import { FotosUploader } from '../../../sections/dashboard/fotos/fotos-uploader';
import { ThumbnailCard } from '../../../sections/dashboard/fotos/thumbnail-card';
import { auth, storage } from 'src/libs/firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { Grid, Box } from '@mui/material';
import { useSettings } from "../../../hooks/use-settings";
import { useDialog } from "../../../hooks/use-dialog";
import { StorageStats } from "../../../sections/dashboard/file-manager/storage-stats";

const Page: NextPage = () => {
    const [imageUrls, setImageUrls] = useState<Array<{ url: string, name: string }>>([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const settings = useSettings();
    const uploadDialog = useDialog();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    const handleClickOpen = (url: string) => {
        setSelectedImage(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchFotos = () => {
        const fotosListRef = ref(storage, `/${uid}/fotos/`);
        setImageUrls([]);
        listAll(fotosListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageUrls((prev) => [...prev, { url: url, name: item.name }]);
                }).catch((error) => console.log("Error getting URL:", error));
            });
        }).catch((error) => console.log("Error in listAll:", error));
    };

    useEffect(() => {
        if (uid) fetchFotos();
    }, [uid]);



  return (
    <>
      <Seo title="Dashboard: Fotos" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid container
                spacing={2}>

            <Grid item
                  xs={12}>

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">Fotos</Typography>
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
                  >
                    Upload Fotos
                    </Button>
                </Stack>
              </Stack>
            </Grid>
              <Grid item xs={12} md={8}>
                  <Stack
                      spacing={{
                          xs: 3,
                          lg: 4,
                      }}
                  >



                  </Stack>
                  <Grid container
                        spacing={1}>
                      {imageUrls.map((imageObj, index) => (
                          <Grid item
                                xs={3}
                                key={index}>
                              <ThumbnailCard
                                  item={{
                                      id: index.toString(),
                                      size: 0,
                                      type: 'file',
                                      isFavorite: false,
                                      name: imageObj.name // Use name from imageObj
                                  }}
                                  imageUrls={imageObj.url} // Use url from imageObj
                                  onDelete={() => console.log("Delete")}
                                  onFavorite={() => console.log("Favorite")}
                                  onOpen={() => handleClickOpen(imageObj.url)} // Use url from imageObj
                              />
                          </Grid>
                      ))}
                  </Grid>

                  {/* Add this block to show ImageViewer when open is true */}
                  {open && selectedImage && (
                      <ImageViewer
                          imageUrl={selectedImage}
                          onClose={handleClose}
                      />
                  )}


              </Grid>
              <Grid item xs={12} md={4}>
                  <StorageStats />
              </Grid>
          </Grid>
        </Container>
      </Box>
        <FotosUploader
            onClose={uploadDialog.handleClose}
            open={uploadDialog.open}
             onUploadSuccess={fetchFotos}
        />
    </>
  );
}
  Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

  export default Page;
