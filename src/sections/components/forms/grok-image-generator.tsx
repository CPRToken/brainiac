//src/sections/components/forms/image-generator.tsx
import type { FC } from 'react';
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGrokImageSubmit from './grok-image-submit';
import { handleSaveImage } from 'src/sections/components/buttons/saveImage';
import {useProtectedPage} from "src/hooks/use-protectedpage";




export const GrokImageGenerator: FC = () => {
  useProtectedPage();


  const { imageSubmit, grokResponse, isLoading } = useGrokImageSubmit();

  const [extra , setExtra] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const { t } = useTranslation();


  useEffect(() => {
    const extraText = extra.trim() || 'default info'; // Fallback for empty input
    const newPrompt = t(tokens.form.imagePrompts).replace('[extra]', extraText);

    console.log('New Prompt:', newPrompt); // Debugging
    setPrompt(newPrompt.trim());
  }, [extra, t]);





  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions */}
        <Typography variant="body2">
          {t(tokens.form.imageInstructions)}
        </Typography>



        <Stack spacing={1}>
          <TextField
            fullWidth
            label={t(tokens.form.extraInfo)} // Label for the text box
            name="extra"
            value={extra} // Controlled component bound to `extra` state
            onChange={(e) => setExtra(e.target.value)} // Update `extra` on user input
            multiline
            rows={3} // Allows multiline input
          />
        </Stack>





      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button
          onClick={() => imageSubmit(prompt)} // Remove the second argument
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>

      </Box>
      {grokResponse.map((url, index) => (
        <Box key={`${url}-${index}`} sx={{ mt: 2 }}>
          <Image
            src={url}
            alt={`Generated Art ${index + 1}`}
            width={500}
            height={500}
            style={{ width: '100%', marginBottom: '30px' }}
          />

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveImage(url, index)}
              style={{ marginTop: '20px', width: '200px' }}
            >
              {t(tokens.form.saveImage)}
            </Button>

            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: '10px', textAlign: 'center' }}
            >
              You have reached your memory limit. Please delete some images to save new ones.
            </Typography>
        </Box>
      ))}
      {grokResponse.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            {t(tokens.form.Images)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}




