import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useHandleSubmit from './handle-submit';

type Option = {
    label: string;
    value: string;
};



const styleOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Adventure', value: 'adventurous' },
    { label: 'Holiday', value: 'holiday' },
    { label: 'Get away', value: 'get away' },
    { label: 'Honeymoon', value: 'honeymoon' },

    // ... add more as needed
];

const modeOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Air', value: 'air' },
  { label: 'Train', value: 'train' },
    // ... add more as needed
];

const getArticle = (word: string) => {
  if (!word) return "";
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  // Check for special cases like "hip-hop" which sounds like it starts with a vowel
  const specialCases = ['hip-hop'];
  return vowels.includes(word[0].toLowerCase()) || specialCases.includes(word) ? 'an' : 'a';
};


export const TravelAgent: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [destination, setDestination] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mode, setMode] = useState<string>('');
  const [budget, setBudget] = useState<number>(100);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  useEffect(() => {
    if (destination && style && mode && budget) {
      let newPrompt = t(tokens.form.writeItinerary);

      // Assuming tokens.form.writeItinerary is like "Write an itinerary for [destination] using [mode] with a budget of [budget] dollars"
      newPrompt = newPrompt
        .replace('[destination]', destination)
        .replace('[style]', style)
        .replace('[mode]', mode)
        .replace('[budget]', `${budget} ${t('dollars')}`);

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [destination, style, mode, budget, t]);









  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.destination)}
          name="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          multiline // Enables multiline input
          rows={1} // Sets the number of rows
        />

        <TextField
          fullWidth
          label={t(tokens.form.style)}
          name="style"
          select
          SelectProps={{ native: true }}
          value={style}
          onChange={(e) => setTheme(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.mode)}
          name="mode"
          select
          SelectProps={{ native: true }}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>{t(tokens.form.budget)}</label>
          <Slider
            value={budget}
            min={300}
            max={2000}
            step={100}
            onChange={(_, newValue) => setBudget(newValue as number)}
          />
        </div>
          <TextField
              fullWidth
              label={t(tokens.form.prompts)}
              name="prompt"
              value={prompt}
              multiline
              rows={4}
          />


      </Stack>
          <Box sx={{ mt: 3 }}>
              <Button
                  onClick={() => handleSubmit(prompt, 1000)}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}  // Disable the button while loading
              >
                  {isLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
          </Box>

        <Box sx={{ mt: 3 }}>
          {openAIResponse && (
            <>
              <label>{t(tokens.form.yourItinerary)}</label>
              <Button onClick={handleCopyText} title="Copy response text">
                <FileCopyIcon />
              </Button>
            </>
          )}

          <Paper elevation={3} ref={textRef} style={{ padding: '10px', height: '100%', overflow: 'auto', lineHeight: '1.5' }}>
            {openAIResponse && openAIResponse.split('\n').map((str, index, array) =>
              index === array.length - 1 ? str : <>
                {str}
                <br />
              </>
            )}
          </Paper>
        </Box>


      </Box>

);
};

