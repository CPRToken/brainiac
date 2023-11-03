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
import useHandleSubmit from './handle-submit';

type Option = {
    label: string;
    value: string;
};

const genreOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Rock', value: 'rock' },
    { label: 'Pop', value: 'pop' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Hip-Hop', value: 'hip-hop' },
    { label: 'Classical', value: 'classical' },
    { label: 'Country', value: 'country' },
    { label: 'Reggae', value: 'reggae' },
    { label: 'Blues', value: 'blues' },
    { label: 'Electronic', value: 'electronic' },
    { label: 'Folk', value: 'folk' },
    { label: 'R&B', value: 'r&b' },
    { label: 'Metal', value: 'metal' },
    // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'Romantic', value: 'romantic' },
    { label: 'Action', value: 'action' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Horror', value: 'horror' },
    { label: 'Love Song', value: 'love-song' },
    { label: 'Ballad', value: 'ballad' },
    { label: 'Anthem', value: 'anthem' },
    // ... add more as needed
];

const moodOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Happy', value: 'happy' },
    { label: 'Sad', value: 'sad' },
    { label: 'Excited', value: 'excited' },
    { label: 'Relaxed', value: 'relaxed' },
    { label: 'Angry', value: 'angry' },
    { label: 'Serene', value: 'serene' },
    { label: 'Nostalgic', value: 'nostalgic' },
    { label: 'Energetic', value: 'energetic' },
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



  const { handleSubmit, openAIResponse } = useHandleSubmit();
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
      // Call getArticle as a normal function
      const genreText = genre !== '' ? `${getArticle(genre)} ${t(genre)} genre` : '';
      const styleText = style !== '' ? `${getArticle(style)} ${t(style)} style` : '';
      const moodText = mood !== '' ? `${getArticle(mood)} ${t(mood)} mood` : '';


      const components = [genreText, styleText, moodText].filter(Boolean).join(', ');

      newPrompt = newPrompt
        .replace('[genre][style][mood]', components)
        .replace('[duration]', `${duration} ${t('minutes')}`);

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
          label="Genre"
          name="genre"
          select
          SelectProps={{ native: true }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genreOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Style"
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
          label="Mood"
          name="mood"
          select
          SelectProps={{ native: true }}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>Duration (minutes)</label>
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
              label="Prompt"
              name="prompt"
              value={prompt}
              multiline
              rows={4}
          />


      </Stack>
        <Box sx={{ mt: 3 }}>
          <Button
            onClick={() => handleSubmit(prompt)}
            type="submit"
            variant="contained"
            fullWidth
          >
            Submit
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

