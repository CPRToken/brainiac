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
import useGPT4Submit from './gpt4-submit';
import CircularProgress from "@mui/material/CircularProgress";

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


const getArticle = (word: string) => {
  if (!word) return "";
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  // Check for special cases like "hip-hop" which sounds like it starts with a vowel
  const specialCases = ['hip-hop'];
  return vowels.includes(word[0].toLowerCase()) || specialCases.includes(word) ? 'an' : 'a';
};


export const ScriptWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
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
      const genreText = genre ? `${t(genre)}` : '';
      const styleText = style ? `${t(style)}` : '';
      const moodText = mood ? `${t(mood)}` : '';

      newPrompt = newPrompt
          .replace('[genre]', genreText)
          .replace('[style]', styleText)
          .replace('[mood]', moodText)
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
          onClick={() => handleSubmit(prompt, 2000)}
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

