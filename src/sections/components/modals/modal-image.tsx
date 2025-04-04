import { Box, Paper, Stack, Typography, IconButton, SvgIcon } from '@mui/material';
import { FC } from 'react';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface ImageViewerProps {
  imageUrl: string;
  onClose?: () => void;
}

export const ImageViewer: FC<ImageViewerProps> = ({ imageUrl, onClose }) => {




  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract the file name from the URL before the '?' and decode it
      const fileNameWithQuery = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      const fileName = decodeURIComponent(fileNameWithQuery.split('?')[0]);

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const { t } = useTranslation();

  return (
    <Box>
      <Paper
        elevation={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: 3,
          maxWidth: '100%',
          mx: 'auto',
          outline: 'none',
          width: 700,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          sx={{ px: 2, py: 1 }}
        >
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', cursor: 'pointer' }}
            variant="h6"
            onClick={handleDownload}
          >
            {t(tokens.form.downloadImage)}
          </Typography>
          <IconButton onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Image
          src={imageUrl}
          alt="Modal content"
          width={1024}
          height={1024}
          layout="responsive"
        />
      </Paper>
    </Box>
  );
};
