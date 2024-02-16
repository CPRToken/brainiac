import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from "react-i18next";
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage'; // Firebase storage methods
import { storage } from 'src/libs/firebase'; // Ensure this path is correct
import { customLocale } from 'src/utils/date-locale';


interface Image {
  id: string;
  size: number;
  content: string;
  createdAt: number;
  imageAvatar: string;
  imageName: string;
}

export const ImageList: FC<{ uid: string }> = ({ uid }) => {
  const [images, setImages] = useState<Image[]>([]);
  const { t } = useTranslation();
  const router = useRouter();

  const fetchImages = async () => {
    const imagesListRef = ref(storage, `/${uid}/images/`);
    try {
      const response = await listAll(imagesListRef);
      const lastTenItems = response.items.slice(-7);
      const imagePromises = lastTenItems.map(async (item) => {
        try {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return {
            id: item.name,
            size: metadata.size,
            createdAt: new Date(metadata.timeCreated).getTime(),
            imageAvatar: url,
          };
        } catch (error) {
          console.error("Error getting image data:", error);
          return null;
        }
      });

      const fetchedImages = await Promise.all(imagePromises);
      setImages(fetchedImages.filter((image): image is Image => image !== null)
        .sort((a, b) => b.createdAt - a.createdAt)); // Sort images by createdAt in descending order
    } catch (error) {
      console.error("Error in listAll:", error);
    }
  };


  useEffect(() => {
    if (uid) fetchImages();
  }, [uid]);

  const handleItemClick = (imageId: string) => {
    router.push(`${paths.dashboard.images}`);
  };


  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };




  return (
    <Box
      sx={{

        display: 'flex',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          minWidth: 330, // Set a minimum width for the card
          margin: '0 auto',
          my: 2
        }}
      >
        <CardHeader
          title={
            <Link href={paths.dashboard.images} passHref>
              <Button component="a" style={{ textDecoration: 'none' }}>
                <Typography variant="h6" color="inherit">
                  {t(tokens.headings.myImages)}
                </Typography>
              </Button>
            </Link>
          }
          titleTypographyProps={{ align: 'center' }}
        />
        <List disablePadding sx={{ paddingBottom: 3 }}>
        {images.map((image) => {
            const ago = formatDistanceStrict(image.createdAt, new Date(), {
              addSuffix: true,
              locale: customLocale,
            });

            return (
              <ListItem
                key={image.id}
                onClick={() => handleItemClick(image.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                  px: 3, // Horizontal padding for the ListItem
                  py: 1, // Vertical padding for the ListItem
                  display: 'flex', // Ensuring flex layout
                  alignItems: 'center', // Align items vertically
                  gap: 2, // Space between elements
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={image.imageAvatar}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '10%', // Adjust for desired roundness
                      marginRight: 2, // Adds right margin to the Avatar
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      // ... existing styling ...
                      variant="subtitle2"
                    >
                      {formatBytes(image.size)}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      variant="body2"
                    >
                      {image.content}
                    </Typography>
                  }
                  sx={{ pr: 2 }}
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  {ago}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Card>
    </Box>
  );
};
