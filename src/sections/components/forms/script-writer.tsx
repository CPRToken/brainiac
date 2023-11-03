import type { FC } from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import ResponseText from '../clipboards/response-text';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import FileCopyIcon from "@mui/icons-material/FileCopy";
import useHandleSubmit from './handle-submit';

type Option = {
  label: string;
  value: string;
};

const genreOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Drama', value: 'drama' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Romance', value: 'romance' },
  { label: 'Action', value: 'action' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Mystery', value: 'mystery' },
  { label: 'Science Fiction', value: 'science-fiction' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Horror', value: 'horror' },
  { label: 'Thriller', value: 'thriller' },
  { label: 'Historical', value: 'historical' },
  // ... add more as needed
];

const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Epic', value: 'epic' },
  { label: 'Romantic Comedy', value: 'romantic-comedy' },
  { label: 'Action-Packed', value: 'action-packed' },
  { label: 'Musical', value: 'musical' },
  { label: 'Surreal', value: 'surreal' },
  { label: 'Dark Comedy', value: 'dark-comedy' },
  { label: 'Fantasy Adventure', value: 'fantasy-adventure' },
  { label: 'Historical Drama', value: 'historical-drama' },
  { label: 'Supernatural', value: 'supernatural' },
  // ... add more as needed
];

const moodOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Joyful', value: 'joyful' },
  { label: 'Tense', value: 'tense' },
  { label: 'Lighthearted', value: 'lighthearted' },
  { label: 'Reflective', value: 'reflective' },
  { label: 'Intense', value: 'intense' },
  { label: 'Quirky', value: 'quirky' },
  { label: 'Sentimental', value: 'sentimental' },
  { label: 'Energetic', value: 'energetic' },
  // ... add more as needed
];


const useArticle = (word: string) => {
  if (!word) return "";
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  // Check for special cases like "hip-hop" which sounds like it starts with a vowel
  const specialCases = ['hip-hop'];
  return vowels.includes(word[0].toLowerCase()) || specialCases.includes(word) ? 'an' : 'a';
};




export const ScriptWriter: FC = () => {



  const { handleSubmit, openAIResponse } = useHandleSubmit();
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  useEffect(() => {
    if (genre && style && mood && duration !== 2.5) {
      let newPrompt = t(tokens.form.writeScript);
      const genreText = genre ? `${useArticle(genre)} ${t(genre)} genre` : '';
      const styleText = style ? `${useArticle(style)} ${t(style)} style` : '';
      const moodText = mood ? `${useArticle(mood)} ${t(mood)} mood` : '';

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
            min={30}
            max={90}
            step={15}
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
        <label>Your Script:</label>
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

