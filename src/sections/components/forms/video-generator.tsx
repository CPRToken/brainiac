// src/sections/components/forms/video-generator.tsx
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import useVideoSubmit from './video-submit';

export const VideoGenerator: FC = () => {
  const { videoSubmit, videoUrl, isLoading } = useVideoSubmit();
  const { t } = useTranslation();

  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(4); // ✅ fixed useState

  const [extra, setExtra] = useState('');

  useEffect(() => {
    if (extra) {
      const newPrompt = `Create a cinematic video of: ${extra}`;
      setPrompt(newPrompt);
    } else {
      setPrompt('');
    }
  }, [extra]);


  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>

        <Typography variant="body2">
          {t(tokens.form.videoInstructions)}
        </Typography>
        <TextField
          label={t(tokens.form.videoText)}
          name="extra"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          multiline
          rows={2}
          fullWidth
        />



        <Box sx={{ mt: 3 }}>
          <Button
            onClick={() => videoSubmit(prompt, duration)} // ✅ send duration properly
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Generate Video'}
          </Button>
        </Box>

        {videoUrl && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t(tokens.form.yourVideo) || 'Your Video:'}
            </Typography>
            <video
              src={videoUrl}
              controls
              style={{
                width: '100%',
                maxHeight: 480,
                borderRadius: 8,
                background: '#000',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                const a = document.createElement('a');
                a.href = videoUrl;
                a.download = 'sora-video.mp4';
                a.click();
              }}
            >
              {t(tokens.form.saveVideo)}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
