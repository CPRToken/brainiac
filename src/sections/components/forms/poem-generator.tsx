import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {CustomSlider} from "../slider/slider";
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';

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



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [poet, setPoet] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(200);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  const maxTokens = 1000;
  const submitToOpenAI = () => {
    // Construct a prompt that OpenAI can use to generate an article
    const  newPrompt = t(tokens.form.writeSong);
    setPrompt(newPrompt); // Update the prompt state
    handleSubmit(newPrompt, maxTokens)
      .then(() => {
        // Handle successful submission if needed
      })
      .catch(error => {
        console.error("Error submitting to OpenAI:", error);
      });
  };


  useEffect(() => {
    // Check if all selections are made
    if (genre && style && mood && duration) {

      let newPrompt = t(tokens.form.writePoem, {

        duration: `${duration} mins`,
        genre: t(genre),
        style: t(style),
        mood: t(mood),
      });



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
          <CustomSlider
            value={duration / 200} // Convert the word count to the slider's scale
            min={50}
            max={1000}
            step={50} // The slider's step
            onChange={(_, newValue) => setDuration(newValue as number * 100)} // Convert back to words on change
          />
        </div>



      </Stack>
        <Box sx={{ mt: 3 }}>
          <Button
            onClick={submitToOpenAI}
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>

        {openAIResponse && (
          <Box sx={{ mt: 3 }}>
            <label>{t(tokens.form.yourPoem)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon />
            </Button>
            <Paper elevation={3} ref={textRef} style={{ padding: '10px', overflow: 'auto', lineHeight: '1.5' }}>
              {openAIResponse.split('\n').map((str, index, array) => (
                <React.Fragment key={index}>
                  {str}
                  {index < array.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </Paper>
          </Box>
        )}
      </Box>
  );

};

