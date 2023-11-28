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



const poetOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.noPoet, value: 'neutral' },
  { label: 'William Shakespeare', value: 'William Shakespeare' },
  { label: 'Pablo Neruda', value: 'Pablo Neruda' },
  { label: 'Emily Dickinson', value: 'Emily Dickinson' },
  { label: 'Rumi', value: 'Rumi' },
  { label: 'Maya Angelou', value: 'Maya Angelou' },
  { label: 'Robert Frost', value: 'Robert Frost' },
  { label: 'Langston Hughes', value: 'Langston Hughes' },
  { label: 'Sylvia Plath', value: 'Sylvia Plath' },
  { label: 'Walt Whitman', value: 'Walt Whitman' },
  { label: 'Rabindranath Tagore', value: 'Rabindranath Tagore' },
  { label: 'John Keats', value: 'John Keats' },
  { label: 'Lord Byron', value: 'Lord Byron' },
  { label: 'Edgar Allan Poe', value: 'Edgar Allan Poe' },
  { label: 'William Wordsworth', value: 'William Wordsworth' },
  { label: 'Emily Bronte', value: 'Emily Bronte' },
  { label: 'Lang Leav', value: 'Lang Leav' },
  { label: 'E.E. Cummings', value: 'E.E. Cummings' },
  { label: 'T.S. Eliot', value: 'T.S. Eliot' },
  // ... add more as needed
];



const genreOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Sonnet, value: tokens.form.Sonnet },
  { label: tokens.form.Haiku, value: tokens.form.Haiku },
  { label: tokens.form.Limerick, value: tokens.form.Limerick },
  { label: tokens.form.Epic, value: tokens.form.Epic },
  { label: tokens.form.FreeVerse, value: tokens.form.FreeVerse },
  { label: tokens.form.Ode, value: tokens.form.Ode },
  { label: tokens.form.Ballad, value: tokens.form.Ballad },
  { label: tokens.form.Villanelle, value: tokens.form.Villanelle },
  { label: tokens.form.Sestina, value: tokens.form.Sestina },
  { label: tokens.form.Acrostic, value: tokens.form.Acrostic },
  { label: tokens.form.Cinquain, value: tokens.form.Cinquain },
  { label: tokens.form.Elegy, value: tokens.form.Elegy },
  { label: tokens.form.Pastoral, value: tokens.form.Pastoral },
  { label: tokens.form.Epigram, value: tokens.form.Epigram },
  { label: tokens.form.Satire, value: tokens.form.Satire },
  { label: tokens.form.Lyric, value: tokens.form.Lyric },

];

const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Romantic, value: tokens.form.Romantic },
  { label: tokens.form.Narrative, value: tokens.form.Narrative },
  { label: tokens.form.Descriptive, value: tokens.form.Descriptive },
  { label: tokens.form.Reflective, value: tokens.form.Reflective },
  { label: tokens.form.Symbolic, value: tokens.form.Symbolic },
  { label: tokens.form.Modernist, value: tokens.form.Modernist },
  { label: tokens.form.Surreal, value: tokens.form.Surreal },
  { label: tokens.form.Humorous, value: tokens.form.Humorous },
  { label: tokens.form.Satirical, value: tokens.form.Satirical },
];

const moodOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Joyful, value: tokens.form.Joyful },
  { label: tokens.form.Melancholic, value: tokens.form.Melancholic },
  { label: tokens.form.Inspirational, value: tokens.form.Inspirational },
  { label: tokens.form.Angry, value: tokens.form.Angry },
  { label: tokens.form.Serene, value: tokens.form.Serene },
  { label: tokens.form.Sad, value: tokens.form.Sad },
  { label: tokens.form.Excited, value: tokens.form.Excited },
  { label: tokens.form.Relaxed, value: tokens.form.Relaxed },
  { label: tokens.form.Nostalgic, value: tokens.form.Nostalgic },
  { label: tokens.form.Energetic, value: tokens.form.Energetic },
  { label: tokens.form.Passionate, value: tokens.form.Passionate },
  { label: tokens.form.Optimistic, value: tokens.form.Optimistic },
];




export const PoemGenerator: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [poet, setPoet] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(100);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();



  useEffect(() => {
    // Check if all selections are made
    if (genre && style && mood && duration) {
      let newPrompt = t(tokens.form.writePoem);
      const poetText = ` ${t(poet)} `;
      const genreText = ` ${t(genre)} `;
      const styleText = ` ${t('')} ${t(style)} ${t('')} `;
      const moodText = ` ${t('')} ${t(mood)} ${t('')} `;

      newPrompt = newPrompt
        .replace('[poet]', poetText)
        .replace('[genre]', genreText)
        .replace('[style]', styleText)
        .replace('[mood]', moodText)
        .replace('[duration]', `${duration} ${t('')}`);

      setPrompt(newPrompt.trim());
    } else {
      // If not all selections are made, keep the prompt empty
      setPrompt('');
    }
  }, [poet,  genre, style, mood, duration, t]);







  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.poet)}
          name="poet"
          select
          SelectProps={{ native: true }}
          value={poet}
          onChange={(e) => setPoet(e.target.value)}
        >
          {poetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
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
          <label>{t(tokens.form.words)}</label>
          <Slider
            value={duration / 100} // Convert the word count to the slider's scale
            min={1}
            max={4}
            step={0.5} // The slider's step
            onChange={(_, newValue) => setDuration(newValue as number * 100)} // Convert back to words on change
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
              <label>{t(tokens.form.yourPoem)}</label>
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

