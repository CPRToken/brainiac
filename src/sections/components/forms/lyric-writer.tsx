import type { FC } from 'react';
import { useEffect, useState } from 'react';
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

const genreOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Rock, value: 'rock' },
  { label: tokens.form.Pop, value: 'pop' },
  { label: tokens.form.Jazz, value: 'jazz' },
  { label: tokens.form.HipHop, value: 'hip-hop' },
  { label: tokens.form.Rap, value: 'rap' },
  { label: tokens.form.Classical, value: 'classical' },
  { label: tokens.form.Country, value: 'country' },
  { label: tokens.form.Reggae, value: 'reggae' },
  { label: tokens.form.Blues, value: 'blues' },
  { label: tokens.form.Latin, value: 'latin' },
  { label: tokens.form.Salsa, value: 'salsa' },
  { label: tokens.form.Soul, value: 'soul' },
  { label: tokens.form.Electronic, value: 'electronic' },
  { label: tokens.form.Folk, value: 'folk' },
  { label: tokens.form.RnB, value: 'RnB' },
  { label: tokens.form.Metal, value: 'metal' },
    // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Adventure, value: 'adventure' },
  { label: tokens.form.Mystery, value: 'mystery' },
  { label: tokens.form.Romantic, value: 'romantic' },
   { label: tokens.form.LoveSong, value: 'love-song' },
  { label: tokens.form.Ballad, value: 'ballad' },
  { label: tokens.form.Anthem, value: 'anthem' },
    // ... add more as needed
];

const moodOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Happy, value: 'happy' },
  { label: tokens.form.Sad, value: 'sad' },
  { label: tokens.form.Excited, value: 'excited' },
  { label: tokens.form.Relaxed, value: 'relaxed' },
  { label: tokens.form.Angry, value: 'angry' },
  { label: tokens.form.Serene, value: 'serene' },
  { label: tokens.form.Nostalgic, value: 'nostalgic' },
  { label: tokens.form.Energetic, value: 'energetic' },
    // ... add more as needed
];

const getArticle = (word: string) => {
  if (!word) return "";
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  // Check for special cases like "hip-hop" which sounds like it starts with a vowel
  const specialCases = ['hip-hop'];
  return vowels.includes(word[0].toLowerCase()) || specialCases.includes(word) ? 'an' : 'a';
};


export const LyricWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(2.5);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  useEffect(() => {
    if (genre && style && mood && duration) {
      let newPrompt = t(tokens.form.writeSong);

      const genreText = genre !== '' ? `${getArticle(genre)} ${t(genre)} ` : '';
      const styleText = style !== '' ? `${t(style)} , ` : '';
      const moodText = mood !== '' ? `${t(mood)} , ` : '';
      const durationText = `${duration} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[genre]', genreText)
        .replace('[style]', styleText)
        .replace('[mood]', moodText)
        .replace('[duration]', durationText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [genre, style, mood, duration, t]);











  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.genre)}
          name="genre"
          select
          SelectProps={{ native: true }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genreOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
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
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.mood)}
          name="mood"
          select
          SelectProps={{ native: true }}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <div>
          <label>{t(tokens.form.duration)}</label>

          <Slider
            value={duration}
            min={1}
            max={4}
            step={0.5}
            onChange={(_, newValue) => setDuration(newValue as number)}
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
              <label>Your Lyrics:</label>
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

