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

const genreOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Rock, value: tokens.form.Rock },
  { label: tokens.form.Pop, value: tokens.form.Pop },
  { label: tokens.form.Jazz, value: tokens.form.Jazz },
  { label: tokens.form.HipHop, value: tokens.form.HipHop },
  { label: tokens.form.Rap, value: tokens.form.Rap },
  { label: tokens.form.Classical, value: tokens.form.Classical },
  { label: tokens.form.Country, value: tokens.form.Country },
  { label: tokens.form.Reggae, value: tokens.form.Reggae },
  { label: tokens.form.Blues, value: tokens.form.Blues },
  { label: tokens.form.Latin, value: tokens.form.Latin },
  { label: tokens.form.Salsa, value: tokens.form.Salsa },
  { label: tokens.form.Soul, value: tokens.form.Soul },
  { label: tokens.form.Electronic, value: tokens.form.Electronic },
  { label: tokens.form.Folk, value: tokens.form.Folk },
  { label: tokens.form.RnB, value: tokens.form.RnB },
  { label: tokens.form.Metal, value: tokens.form.Metal },
    // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Adventure, value: tokens.form.Adventure },
  { label: tokens.form.Mystery, value: tokens.form.Mystery },
  { label: tokens.form.Romantic, value: tokens.form.Romantic },
  { label: tokens.form.LoveSong, value: tokens.form.LoveSong },
  { label: tokens.form.Ballad, value: tokens.form.Ballad },
  { label: tokens.form.Anthem, value: tokens.form.Anthem },
    // ... add more as needed
];

const moodOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Happy, value: tokens.form.Happy },
  { label: tokens.form.Sad, value: tokens.form.Sad },
  { label: tokens.form.Excited, value: tokens.form.Excited },
  { label: tokens.form.Relaxed, value: tokens.form.Relaxed },
  { label: tokens.form.Angry, value: tokens.form.Angry },
  { label: tokens.form.Serene, value: tokens.form.Serene },
  { label: tokens.form.Nostalgic, value: tokens.form.Nostalgic },
  { label: tokens.form.Energetic, value: tokens.form.Energetic },
    // ... add more as needed
];




export const LyricWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {
    const maxTokens = 1000;
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
      let newPrompt = t(tokens.form.writeSong);

      const genreText = genre !== '' ? `${t(genre)} ` : '';
      const styleText = style !== '' ? `${t(style)} , ` : '';
      const moodText = mood !== '' ? `${t(mood)} , ` : '';
      const durationText = `${duration} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[genre]', genreText)
        .replace('[style]', styleText)
        .replace('[mood]', moodText)
        .replace('[duration]', durationText);


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
            min={1}
            max={4}
            step={0.5}
            onChange={(_, newValue) => setDuration(newValue as number)}
            sx={{ width: '95%' }}
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
            <label>{t(tokens.form.yourLyrics)}</label>
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

