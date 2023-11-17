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
import CircularProgress from "@mui/material/CircularProgress";

type Option = {
  label: string;
  value: string;
};

const genreOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Drama, value: 'drama' },
  { label: tokens.form.Comedy, value: 'comedy' },
  { label: tokens.form.Romance, value: 'romance' },
  { label: tokens.form.Action, value: 'action' },
  { label: tokens.form.Adventure, value: 'adventure' },
  { label: tokens.form.Mystery, value: 'mystery' },
  { label: tokens.form.ScienceFiction, value: 'science-fiction' },
  { label: tokens.form.Fantasy, value: 'fantasy' },
  { label: tokens.form.Horror, value: 'horror' },
  { label: tokens.form.Thriller, value: 'thriller' },
  { label: tokens.form.Historical, value: 'historical' },
  // ... add more as needed
];

const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Epic, value: 'epic' },
  { label: tokens.form.SciFi, value: 'sci-fi' },
  { label: tokens.form.RomanticComedy, value: 'romantic-comedy' },
  { label: tokens.form.ActionPacked, value: 'action-packed' },
  { label: tokens.form.Musical, value: 'musical' },
  { label: tokens.form.Surreal, value: 'surreal' },
  { label: tokens.form.DarkComedy, value: 'dark-comedy' },
  { label: tokens.form.FantasyAdventure, value: 'fantasy-adventure' },
  { label: tokens.form.HistoricalDrama, value: 'historical-drama' },
  { label: tokens.form.SuperNatural, value: 'supernatural' },
  { label: tokens.form.Lighthearted, value: 'lighthearted' },
  // ... add more as needed
];

const moodOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Joyful, value: 'joyful' },
  { label: tokens.form.Tense, value: 'tense' },
  { label: tokens.form.Reflective, value: 'reflective' },
  { label: tokens.form.Intense, value: 'intense' },
  { label: tokens.form.Quirky, value: 'quirky' },
  { label: tokens.form.Sentimental, value: 'sentimental' },
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


export const ScriptWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
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
      const genreText = genre ? `${getArticle(genre)} ${t(genre)} genre` : '';
      const styleText = style ? `${getArticle(style)} ${t(style)} style` : '';
      const moodText = mood ? `${getArticle(mood)} ${t(mood)} mood` : '';

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
            min={30}
            max={90}
            step={15}
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

