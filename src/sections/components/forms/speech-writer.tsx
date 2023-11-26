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
  { label: tokens.form.informative, value: 'informative' },
  { label: tokens.form.academic, value: 'academic' },
  { label: tokens.form.analytical, value: 'analytical' },
  { label: tokens.form.argumentative, value: 'argumentative' },
  { label: tokens.form.articulate, value: 'articulate' },
  { label: tokens.form.essay, value: 'essay' },
  { label: tokens.form.blog, value: 'blog' },
  { label: tokens.form.biographical, value: 'biographical' },
  { label: tokens.form.conversational, value: 'conversational' },
  { label: tokens.form.Didactic, value: 'didactic' },
  { label: tokens.form.Educational, value: 'educational' },
  { label: tokens.form.Eloquent, value: 'eloquent' },
  { label: tokens.form.Empathetic, value: 'empathetic' },
  { label: tokens.form.Entertaining, value: 'entertaining' },
  { label: tokens.form.Epic, value: 'epic' },
  { label: tokens.form.Evocative, value: 'evocative' },
  { label: tokens.form.Explanatory, value: 'explanatory' },
  { label: tokens.form.Factual, value: 'factual' },
  { label: tokens.form.Figurative, value: 'figurative' },
  { label: tokens.form.Inspirational, value: 'inspirational' },
  { label: tokens.form.Investigative, value: 'investigative' },
  { label: tokens.form.Lyrical, value: 'lyrical' },
  { label: tokens.form.Motivational, value: 'motivational' },
  { label: tokens.form.Objective, value: 'objective' },
  { label: tokens.form.Persuasive, value: 'persuasive' },
  { label: tokens.form.Poetic, value: 'poetic' },
  { label: tokens.form.Pragmatic, value: 'pragmatic' },
  { label: tokens.form.Provocative, value: 'provocative' },
  { label: tokens.form.Quirky, value: 'quirky' },
  { label: tokens.form.Rhetorical, value: 'rhetorical' },
  { label: tokens.form.Scholarly, value: 'scholarly' },
  { label: tokens.form.Simplistic, value: 'simplistic' },
  { label: tokens.form.Speculative, value: 'speculative' },
  { label: tokens.form.Subjective, value: 'subjective' },
  { label: tokens.form.Succinct, value: 'succinct' },
  { label: tokens.form.Technical, value: 'technical' },
  { label: tokens.form.Casual, value: 'casual' },
  { label: tokens.form.Colloquial, value: 'colloquial' },
  { label: tokens.form.Comparative, value: 'comparative' },
  { label: tokens.form.Concise, value: 'concise' },
  { label: tokens.form.Creative, value: 'creative' },
  { label: tokens.form.Critical, value: 'critical' },
  { label: tokens.form.Descriptive, value: 'descriptive' },
  { label: tokens.form.Dramatic, value: 'dramatic' },
  { label: tokens.form.Editorial, value: 'editorial' },
  { label: tokens.form.Expository, value: 'expository' },
  { label: tokens.form.Formal, value: 'formal' },
  { label: tokens.form.Humorous, value: 'humorous' },
  { label: tokens.form.Informative, value: 'informative' },
  { label: tokens.form.Journalistic, value: 'journalistic' },
  { label: tokens.form.Narrative, value: 'narrative' },
  { label: tokens.form.Opinionated, value: 'opinionated' },
  { label: tokens.form.Persuasive, value: 'persuasive' },
  { label: tokens.form.Professional, value: 'professional' },
  { label: tokens.form.Reflective, value: 'reflective' },
  { label: tokens.form.Satirical, value: 'satirical' },
  { label: tokens.form.Scientific, value: 'scientific' },
  { label: tokens.form.SEO, value: 'seo' },
  { label: tokens.form.Technical, value: 'technical' },
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

