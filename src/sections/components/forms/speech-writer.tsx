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

const topicOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Politics, value: 'politics' },
  { label: tokens.form.Environment, value: 'environment' },


  // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: 'Informative', value: 'informative' },
  { label: 'Engaging', value: 'engaging' },
  { label: 'Persuasive', value: 'persuasive' },
  { label: 'Educational', value: 'educational' },
  { label: 'Entertaining', value: 'entertaining' },
  { label: 'Inspirational', value: 'inspirational' },
  { label: 'Technical', value: 'technical' },
  { label: 'Storytelling', value: 'storytelling' },
  { label: 'Conversational', value: 'conversational' },
  { label: 'Formal', value: 'formal' },
  { label: 'Casual', value: 'casual' },
  { label: 'Humorous', value: 'humorous' },
  { label: 'Professional', value: 'professional' },
  { label: 'Opinionated', value: 'opinionated' },
  { label: 'Sensational', value: 'sensational' },
  { label: 'Thought-provoking', value: 'thought-provoking' },
    // ... add more as needed
];

const themeOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.keynote, value: 'keynote' },
  { label: tokens.form.Ceremonial, value: 'ceremonial' },
  { label: tokens.form.Debate, value: 'debate' },
  { label: tokens.form.Expository, value: 'expository' },
  { label: tokens.form.Demonstrative, value: 'demonstrative' },
  { label: tokens.form.Narrative, value: 'narrative' },
  { label: tokens.form.Entertaining, value: 'entertaining' },
  { label: tokens.form.Impromptu, value: 'impromptu' },
  { label: tokens.form.Forensic, value: 'forensic' },
  { label: tokens.form.Farewell, value: 'farewell' },
  { label: tokens.form.Commencement, value: 'commencement' },
  { label: tokens.form.Tribute, value: 'tribute' },
  { label: tokens.form.Eulogy, value: 'eulogy' },
  { label: tokens.form.Acceptance, value: 'acceptance' },
  { label: tokens.form.Inaugural, value: 'inaugural' },
  { label: tokens.form.Lecture, value: 'lecture' },
  { label: tokens.form.PanelDiscussion, value: 'paneldiscussion' },
  { label: tokens.form.Toast, value: 'toast' },

];




export const SpeechWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [topic, setTopic] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [duration, setDuration] = useState<number>(5);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  useEffect(() => {
    if (topic && style && theme && duration) {
      let newPrompt = t(tokens.form.writeSpeech);

      const topicText = topic !== '' ? `${t(topic)} ` : '';
      const styleText = style !== '' ? `${t(style)}  ` : '';
      const themeText = theme !== '' ? `${t(theme)}  ` : '';
      const durationText = `${duration} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[topic]', topicText)
        .replace('[style]', styleText)
        .replace('[theme]', themeText)
        .replace('[duration]', durationText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [topic, style, theme, duration, t]);











  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.topic)}
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          multiline
          rows={1}
        >
          {topicOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.type)}
          name="theme"
          select
          SelectProps={{ native: true }}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themeOptions.map((option) => (
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
          onChange={(e) => setStyle(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <div>
          <label>{t(tokens.form.duration)}</label>

          <Slider
            value={duration}
            min={5}
            max={60}
            step={5}
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
              <label>Your Speech:</label>
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

