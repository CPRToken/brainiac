import type { FC } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

import { typography } from 'src/theme/typography';
import { tokens } from 'src/locales/tokens';

export const HomeCta: FC = () => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const videos = ['video1', 'video2', 'video3'];

  return (
    <Box sx={{ backgroundImage: 'url("/assets/gradient-bg.svg")', pt: 8, pb: 12 }}>
      <Container maxWidth="lg">
        <Box maxWidth="sm" sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{ ...typography.h4, pb: 2 }}>
            {t(tokens.form.HowitWorks)}
          </Typography>
          <Typography sx={{ ...typography.body1 , pb: 4 }}>
            {t(tokens.form.HowitWorksParagraph)}
          </Typography>
        </Box>


        {/* Grid of 3 thumbnails */}

        <Box maxWidth="sm" sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{ mt: 3, mb: 0, color: 'text.secondary', textAlign: 'center' }}
          >
            {t(tokens.form.clickToExpand)}
          </Typography>


        <Grid
          container
          spacing={3}
          sx={{ mt: 6, justifyContent: 'center' }} // center the whole row
        >
          {videos.map((v, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={v}
              sx={{
                display: 'flex',
                justifyContent: 'center', // center each cell
              }}
            >

              <Box
                sx={{
                  width: 150, // thumbnail size
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                }}
                onClick={() => setOpenIdx(idx)}
              >
                <video width="100%" muted preload="metadata">
                  <source
                    src={t(tokens.form[v as keyof typeof tokens.form])}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </Grid>
          ))}
        </Grid>
        </Box>
        {/* Modal for full video */}
        <Modal
          open={openIdx !== null}
          onClose={() => setOpenIdx(null)}
          aria-labelledby="demo-video"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box sx={{ position: 'relative', width: '90%', maxWidth: 500 }}>
            <IconButton
              onClick={() => setOpenIdx(null)}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}
            >
              <CloseIcon />
            </IconButton>
            {openIdx !== null && (
              <video width="100%" controls autoPlay>
                <source
                  src={t(tokens.form[videos[openIdx] as keyof typeof tokens.form])}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};
