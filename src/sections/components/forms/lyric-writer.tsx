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
import { saveDoc } from 'src/sections/components/buttons/saveDoc';
import {useProtectedPage} from "src/hooks/use-protectedpage";

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
  { label: tokens.form.Uplifting, value: tokens.form.Uplifting },
  { label: tokens.form.Melancholic, value: tokens.form.Melancholic },
  { label: tokens.form.Energetic, value: tokens.form.Energetic },
  { label: tokens.form.Soothing, value: tokens.form.Soothing },
  { label: tokens.form.Acoustic, value: tokens.form.Acoustic },
  { label: tokens.form.Synthetic, value: tokens.form.Synthetic },
  { label: tokens.form.Experimental, value: tokens.form.Experimental },
  { label: tokens.form.Nostalgic, value: tokens.form.Nostalgic },
  { label: tokens.form.Groovy, value: tokens.form.Groovy },
  { label: tokens.form.Rhythmic, value: tokens.form.Rhythmic },
  { label: tokens.form.Orchestral, value: tokens.form.Orchestral },
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
  { label: tokens.form.Romantic, value: tokens.form.Romantic },
  { label: tokens.form.Melancholic, value: tokens.form.Melancholic },
  { label: tokens.form.Motivational, value: tokens.form.Motivational },

  { label: tokens.form.Mysterious, value: tokens.form.Mysterious },
  { label: tokens.form.Intense, value: tokens.form.Intense },
 { label: tokens.form.Soothing, value: tokens.form.Soothing },
  { label: tokens.form.Groovy, value: tokens.form.Groovy },
  { label: tokens.form.Chill, value: tokens.form.Chill }
    // ... add more as needed
];

const tempoOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.slow, value: tokens.form.slow },
  { label: tokens.form.medium, value: tokens.form.medium },
  { label: tokens.form.fast, value: tokens.form.fast },

];


export const LyricWriter: FC = () => {
  useProtectedPage();


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [title, setTitle] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
   const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [tempo, setTempo] = useState<string>('');
  const [duration, setDuration] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {

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
    if (title && genre && style && mood && tempo && duration) {
      let newPrompt = t(tokens.form.writeSong);

       const titleText = title !== '' ? `${t(title)} ` : '';
      const genreText = genre !== '' ? `${t(genre)} ` : '';
      const styleText = style !== '' ? `${t(style)} , ` : '';
      const moodText = mood !== '' ? `${t(mood)} , ` : '';
      const tempoText = tempo !== '' ? `${t(tempo)} , ` : '';
      const durationText = `${duration} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[title]', titleText)
        .replace('[genre]', genreText)
        .replace('[style]', styleText)
        .replace('[mood]', moodText)
        .replace('[tempo]', tempoText)
        .replace('[duration]', durationText);


      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [title, genre, style, mood, tempo, duration, t]);



  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    // If newValue is an array, you can decide how to handle it.
    // For a single thumb slider, it should be just a number.
    if (typeof newValue === 'number') {
      setDuration(newValue); // Directly set the new value
    }
  };

// Corrected maxTokens calculation
  const maxTokens = duration * 4; // 1 word is approx. 4 tokens



  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.songTitle)}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          multiline
          rows={1}
        >

        </TextField>

        <TextField
          label={t(tokens.form.genre)}
          name="genre"
          select
          SelectProps={{ native: true }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          fullWidth

        >
          {genreOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>


        <TextField

          label={t(tokens.form.style)}
          name="style"
          select
          SelectProps={{ native: true }}
          value={style}
          onChange={(e) => setTheme(e.target.value)}
          fullWidth

        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>


        <TextField

          label={t(tokens.form.mood)}
          name="mood"
          select
          SelectProps={{ native: true }}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          fullWidth

        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <TextField
          label={t(tokens.form.tempo)}
          name="tempo"
          select
          SelectProps={{ native: true }}
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          fullWidth

        >
          {tempoOptions.map((option) => (
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
            max={5}
            step={0.5}
            onChange={handleSliderChange}
            sx={{ width: '100%' }}
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
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourLyrics)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
            </Button>
            {/* Save Document Button */}

            <Paper elevation={3} ref={textRef}
                   style={{padding: '30px', overflow: 'auto', lineHeight: '1.5'}}>
              {openAIResponse.split('\n').map((str, index, array) => (
                <React.Fragment key={index}>
                  {str}
                  {index < array.length - 1 ? <br/> : null}
                </React.Fragment>
              ))}
            </Paper>
            <div style={{textAlign: 'center', paddingTop: '20px'}}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.lyrics))}
                style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
              >
                {t(tokens.form.saveText)}
              </Button>
            </div>
          </Box>
        )}
      </Box>
  );
}
