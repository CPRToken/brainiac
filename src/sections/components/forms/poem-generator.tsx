import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ReponseText from '../clipboards/response-text';
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
  { label: 'Sonnet', value: 'sonnet' },
  { label: 'Haiku', value: 'haiku' },
  { label: 'Limerick', value: 'limerick' },
  { label: 'Epic', value: 'epic' },
  { label: 'Free Verse', value: 'free-verse' },
  { label: 'Ode', value: 'ode' },
  { label: 'Ballad', value: 'ballad' },
  { label: 'Villanelle', value: 'villanelle' },
  { label: 'Sestina', value: 'sestina' },
  { label: 'Acrostic', value: 'acrostic' },
  { label: 'Cinquain', value: 'cinquain' },
];

const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Romantic', value: 'romantic' },
  { label: 'Narrative', value: 'narrative' },
  { label: 'Descriptive', value: 'descriptive' },
  { label: 'Reflective', value: 'reflective' },
  { label: 'Symbolic', value: 'symbolic' },
  { label: 'Modernist', value: 'modernist' },
  { label: 'Surreal', value: 'surreal' },
  { label: 'Humorous', value: 'humorous' },
  { label: 'Satirical', value: 'satirical' },
];

const moodOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Joyful', value: 'joyful' },
  { label: 'Melancholic', value: 'melancholic' },
  { label: 'Inspirational', value: 'inspirational' },
  { label: 'Serene', value: 'serene' },
  { label: 'Nostalgic', value: 'nostalgic' },
  { label: 'Passionate', value: 'passionate' },
  { label: 'Triumphant', value: 'triumphant' },
  { label: 'Pensive', value: 'pensive' },
  { label: 'Optimistic', value: 'optimistic' },
];




export const PoemGenerator: FC = () => {



  const { handleSubmit, openAIResponse } = useHandleSubmit();
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(2.5);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ReponseText();




  useEffect(() => {
    let newPrompt = t(tokens.form.writePoem);
    const genreText = genre !== '' ? ` ${t(genre)} ` : '';
    const styleText = style !== '' ? ` ${t('in a')} ${t(style)} ${t('style')} ` : '';
    const moodText = mood !== '' ? ` ${t('with a')} ${t(mood)} ${t('mood')} ` : '';

    newPrompt = newPrompt
      .replace('[genre]', genreText)
      .replace('[style]', styleText)
      .replace('[mood]', moodText)
      .replace('[duration]', `${duration} ${t('minutes')}`);

    setPrompt(newPrompt.trim());
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
              onClick={() => handleSubmit(prompt, 1000)}
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
              <label>Your Poem:</label>
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

