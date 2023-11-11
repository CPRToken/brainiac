import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { ImageViewer } from "../../../sections/components/modals/modal-image";
import { ImagesUploader } from '../../../sections/dashboard/images/images-uploader';
import { ThumbnailCard } from '../../../sections/dashboard/images/thumbnail-card';
import { auth, storage } from 'src/libs/firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { Grid, Box } from '@mui/material';
import { useSettings } from "../../../hooks/use-settings";
import { useDialog } from "../../../hooks/use-dialog";
import { MyImages } from "../../../sections/dashboard/file-manager/my-images";
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";

const Page: NextPage = () => {
    const [imageUrls, setImageUrls] = useState<Array<{ url: string, name: string }>>([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { t } = useTranslation();

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

    const fetchImages = () => {
        const imagesListRef = ref(storage, `/${uid}/images/`);
        setImageUrls([]);
        listAll(imagesListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageUrls((prev) => [...prev, { url: url, name: item.name }]);
                }).catch((error) => console.log("Error getting URL:", error));
            });
        }).catch((error) => console.log("Error in listAll:", error));
    };

    useEffect(() => {
        if (uid) fetchImages();
    }, [uid]);



  return (
    <>
      <Seo title="Dashboard: Images" />
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
                  <Typography variant="h4">{t(tokens.headings.myImages)}</Typography>
                </div>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >

                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={9} sx={{ flexGrow: 1 }}> {/* Adjusted for thumbnail area */}
              <Grid container spacing={1} justifyContent="center">
                {imageUrls.map((imageObj, index) => (
                  <Grid item key={index} style={{ flexBasis: '20%', flexGrow: 1, maxWidth: '20%' }}> {/* Inline style for 5 thumbnails per row */}
                    <ThumbnailCard
                      item={{
                        id: index.toString(),
                        size: 0,
                        type: 'file',
                        isFavorite: false,
                        name: imageObj.name
                      }}
                      imageUrls={imageObj.url}
                      onDelete={() => console.log("Delete")}
                      onFavorite={() => console.log("Favorite")}
                      onOpen={() => handleClickOpen(imageObj.url)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* ImageViewer block */}
              {open && selectedImage && (
                <ImageViewer
                  imageUrl={selectedImage}
                  onClose={handleClose}
                />
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              <MyImages />
            </Grid>
          </Grid>
        </Container>
      </Box>
        <ImagesUploader
            onClose={uploadDialog.handleClose}
            open={uploadDialog.open}
             onUploadSuccess={fetchImages}
        />
    </>
  );
}
  Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

  export default Page;
