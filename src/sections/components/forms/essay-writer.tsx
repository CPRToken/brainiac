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

const topicOptions: Option[] = [
    { label: '', value: '' },



  // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.informative, value: tokens.form.informative },
  { label: tokens.form.academic, value: tokens.form.academic },
  { label: tokens.form.analytical, value: tokens.form.analytical },
  { label: tokens.form.argumentative, value: tokens.form.argumentative },
  { label: tokens.form.articulate, value: tokens.form.articulate },
  { label: tokens.form.essay, value: tokens.form.essay },
  { label: tokens.form.blog, value: tokens.form.blog },
  { label: tokens.form.biographical, value: tokens.form.biographical },
  { label: tokens.form.conversational, value: tokens.form.conversational },
  { label: tokens.form.Didactic, value: tokens.form.Didactic },
  { label: tokens.form.Educational, value: tokens.form.Educational },
  { label: tokens.form.Eloquent, value: tokens.form.Eloquent },
  { label: tokens.form.Empathetic, value: tokens.form.Empathetic },
  { label: tokens.form.Entertaining, value: tokens.form.Entertaining },
  { label: tokens.form.Epic, value: tokens.form.Epic },
  { label: tokens.form.Evocative, value: tokens.form.Evocative },
  { label: tokens.form.Explanatory, value: tokens.form.Explanatory },
  { label: tokens.form.Factual, value: tokens.form.Factual },
  { label: tokens.form.Figurative, value: tokens.form.Figurative },
  { label: tokens.form.Inspirational, value: tokens.form.Inspirational },
  { label: tokens.form.Investigative, value: tokens.form.Investigative },
  { label: tokens.form.Lyrical, value: tokens.form.Lyrical },
  { label: tokens.form.Motivational, value: tokens.form.Motivational },
  { label: tokens.form.Objective, value: tokens.form.Objective },
  { label: tokens.form.Persuasive, value: tokens.form.Persuasive },
  { label: tokens.form.Poetic, value: tokens.form.Poetic },
  { label: tokens.form.Pragmatic, value: tokens.form.Pragmatic },
  { label: tokens.form.Provocative, value: tokens.form.Provocative },
  { label: tokens.form.Quirky, value: tokens.form.Quirky },
  { label: tokens.form.Rhetorical, value: tokens.form.Rhetorical },
  { label: tokens.form.Scholarly, value: tokens.form.Scholarly },
  { label: tokens.form.Simplistic, value: tokens.form.Simplistic },
  { label: tokens.form.Speculative, value: tokens.form.Speculative },
  { label: tokens.form.Subjective, value: tokens.form.Subjective },
  { label: tokens.form.Succinct, value: tokens.form.Succinct },
  { label: tokens.form.Technical, value: tokens.form.Technical },
  { label: tokens.form.Casual, value: tokens.form.Casual },
  { label: tokens.form.Colloquial, value: tokens.form.Colloquial },
  { label: tokens.form.Comparative, value: tokens.form.Comparative },
  { label: tokens.form.Concise, value: tokens.form.Concise },
  { label: tokens.form.Creative, value: tokens.form.Creative },
  { label: tokens.form.Critical, value: tokens.form.Critical },
  { label: tokens.form.Descriptive, value: tokens.form.Descriptive },
  { label: tokens.form.Dramatic, value: tokens.form.Dramatic },
  { label: tokens.form.Editorial, value: tokens.form.Editorial },
  { label: tokens.form.Expository, value: tokens.form.Expository },
  { label: tokens.form.Formal, value: tokens.form.Formal },
  { label: tokens.form.Humorous, value: tokens.form.Humorous },
  { label: tokens.form.Informative, value: tokens.form.Informative },
  { label: tokens.form.Journalistic, value: tokens.form.Journalistic },
  { label: tokens.form.Narrative, value: tokens.form.Narrative },
  { label: tokens.form.Opinionated, value: tokens.form.Opinionated },
  { label: tokens.form.Persuasive, value: tokens.form.Persuasive },
  { label: tokens.form.Professional, value: tokens.form.Professional },
  { label: tokens.form.Reflective, value: tokens.form.Reflective },
  { label: tokens.form.Satirical, value: tokens.form.Satirical },
  { label: tokens.form.Scientific, value: tokens.form.Scientific },
  { label: tokens.form.SEO, value: tokens.form.SEO },
  { label: tokens.form.Technical, value: tokens.form.Technical },
    // ... add more as needed
];






export const EssayWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [topic, setTopic] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [duration, setDuration] = useState<number>(300);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  useEffect(() => {
    if (topic && style && duration) {
      let newPrompt = t(tokens.form.writeEssay);

      const topicText = topic !== '' ? `${t(topic)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const durationText = `${duration} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[topic]', topicText)
        .replace('[style]', styleText)
        .replace('[duration]', durationText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [topic, style, duration, t]);











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
          <label>{t(tokens.form.words)}</label>

          <CustomSlider

            value={duration}
            min={300}
            max={2000}
            step={100}
            onChange={(_, newValue) => setDuration(newValue as number)}
          />
        </div>



      </Stack>
          <Box sx={{ mt: 3 }}>
              <Button
                  onClick={() => handleSubmit(prompt, 1300)}
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
              <label>{t(tokens.form.yourEssay)}</label>
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

