import type { FC } from 'react';
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {CustomSlider} from "../slider/slider";
import Paper from '@mui/material/Paper';
import ResponseText from '../clipboards/response-text';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CircularProgress from "@mui/material/CircularProgress";
import useGPT4Submit from "./gpt4-submit";

type Option = {
  label: string;
  value: string;
};

const genreOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Drama, value: tokens.form.Drama },
  { label: tokens.form.Comedy, value: tokens.form.Comedy },
  { label: tokens.form.Romance, value: tokens.form.Romance },
  { label: tokens.form.Action, value: tokens.form.Action },
  { label: tokens.form.Adventure, value: tokens.form.Adventure },
  { label: tokens.form.Mystery, value: tokens.form.Mystery },
  { label: tokens.form.ScienceFiction, value: tokens.form.ScienceFiction },
  { label: tokens.form.Fantasy, value: tokens.form.Fantasy },
  { label: tokens.form.Horror, value: tokens.form.Horror },
  { label: tokens.form.Thriller, value: tokens.form.Thriller },
  { label: tokens.form.Historical, value: tokens.form.Historical },
  // ... add more as needed
];

const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Epic, value: tokens.form.Epic },
  { label: tokens.form.SciFi, value: tokens.form.SciFi },
  { label: tokens.form.RomanticComedy, value: tokens.form.RomanticComedy },
  { label: tokens.form.ActionPacked, value: tokens.form.ActionPacked },
  { label: tokens.form.Musical, value: tokens.form.Musical },
  { label: tokens.form.Surreal, value: tokens.form.Surreal },
  { label: tokens.form.DarkComedy, value: tokens.form.DarkComedy },
  { label: tokens.form.FantasyAdventure, value: tokens.form.FantasyAdventure },
  { label: tokens.form.HistoricalDrama, value: tokens.form.HistoricalDrama },
  { label: tokens.form.SuperNatural, value: tokens.form.SuperNatural },
  { label: tokens.form.Lighthearted, value: tokens.form.Lighthearted },
  // Adding more styles
  { label: tokens.form.PsychologicalThriller, value: tokens.form.PsychologicalThriller },
  { label: tokens.form.Biographical, value: tokens.form.Biographical },
  { label: tokens.form.FamilyDrama, value: tokens.form.FamilyDrama },
  { label: tokens.form.CrimeThriller, value: tokens.form.CrimeThriller },
  { label: tokens.form.MysteryThriller, value: tokens.form.MysteryThriller },
  { label: tokens.form.RoadMovie, value: tokens.form.RoadMovie },
  { label: tokens.form.WarStory, value: tokens.form.WarStory },
  // ... add more as needed
];

const moodOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Joyful, value: tokens.form.Joyful },
  { label: tokens.form.Tense, value: tokens.form.Tense },
  { label: tokens.form.Reflective, value: tokens.form.Reflective },
  { label: tokens.form.Intense, value: tokens.form.Intense },
  { label: tokens.form.Quirky, value: tokens.form.Quirky },
  { label: tokens.form.Sentimental, value: tokens.form.Sentimental },
  { label: tokens.form.Energetic, value: tokens.form.Energetic },
  { label: tokens.form.Mysterious, value: tokens.form.Mysterious },
  { label: tokens.form.Romantic, value: tokens.form.Romantic },
  { label: tokens.form.Melancholic, value: tokens.form.Melancholic },
  { label: tokens.form.Humorous, value: tokens.form.Humorous },
  { label: tokens.form.Suspenseful, value: tokens.form.Suspenseful },
  { label: tokens.form.Inspirational, value: tokens.form.Inspirational },
  { label: tokens.form.Nostalgic, value: tokens.form.Nostalgic },
  { label: tokens.form.Dramatic, value: tokens.form.Dramatic },
  // ... add more as needed
];
export const ScreenPlays: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {
    const maxTokens = 1500;
    if (prompt) {
      // Submit the prompt that is updated by the useEffect hook
      handleSubmit(prompt, maxTokens)
        .then(() => {
          // Handle successful submission if needed
        })
        .catch(error => {
          console.error("Error submitting to OpenAI:", error);
        });
    } else {
      console.error("Prompt is empty or not updated, cannot submit.");
    }
  };

  useEffect(() => {
    if (genre && style && mood && duration) {
      let newPrompt = t(tokens.form.writeScript, {
        duration: `${duration} mins`,
        genre: t(genre),
        style: t(style),
        mood: t(mood),
      });

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
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.duration)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider
            value={duration}
            min={30}
            max={90}
            step={15}
            onChange={(_, newValue) => setDuration(newValue as number)}
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

          <label>{t(tokens.form.yourScript)}</label>
        <Button onClick={handleCopyText} title="Copy response text">
          <FileCopyIcon />
        </Button>

          <Paper elevation={3} ref={textRef} style={{ padding: '30px', overflow: 'auto', lineHeight: '1.5' }}>
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

