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



const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.informative, value: tokens.form.informative },
  { label: tokens.form.academic, value: tokens.form.academic },
  { label: tokens.form.analytical, value: tokens.form.analytical },
  { label: tokens.form.argumentative, value: tokens.form.argumentative },
  { label: tokens.form.articulate, value: tokens.form.articulate },
  { label: tokens.form.blog, value: tokens.form.blog },
  { label: tokens.form.biographical, value: tokens.form.biographical },
  { label: tokens.form.conversational, value: tokens.form.conversational },
  { label: tokens.form.Didactic, value: tokens.form.Didactic },
  { label: tokens.form.Educational, value: tokens.form.Educational },
  { label: tokens.form.Eloquent, value: tokens.form.Eloquent },
  { label: tokens.form.Empathetic, value: tokens.form.Empathetic },
  { label: tokens.form.Entertaining, value: tokens.form.Entertaining },
  { label: tokens.form.epic, value: tokens.form.epic },
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




const refOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.APA7, value: tokens.form.APA7 },
    { label: tokens.form.MLA, value: tokens.form.MLA },
  { label: tokens.form.ChicagoTurabian, value: tokens.form.ChicagoTurabian },
  { label: tokens.form.Harvard, value: tokens.form.Harvard },
  { label: tokens.form.Vancouver, value: tokens.form.Vancouver },
    { label: tokens.form.AMA, value: tokens.form.AMA },
  { label: tokens.form.OSCOLA, value: tokens.form.OSCOLA },
  { label: tokens.form.ACS, value: tokens.form.ACS },
  { label: tokens.form.APSA, value: tokens.form.APSA },
];




export const EssayWriter: FC = () => {
  useProtectedPage();


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [title, setTitle] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [duration, setDuration] = useState<number>(300);
  const [extra , setExtra] = useState<string>('');
const [ref , setRef] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  const submitToOpenAI = () => {
    const maxTokens = 4096;
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
    if (title && style && duration) {
      let newPrompt = t(tokens.form.writeEssay);

      const titleText = title !== '' ? `${t(title)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const extraText = extra !== '' ? `${t(extra)} ` : '';
      const durationText = `${duration} ${t('')}`;
      const refText = ref !== '' ? `${t(ref)} ` : '';

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[title]', titleText)
        .replace('[style]', styleText)
        .replace('[extra]', extraText)
        .replace('[referencing]', refText)
        .replace('[duration]', durationText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [title, style, duration, extra, ref, t]);











  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.topic)}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          multiline
          rows={1}
        >

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

          <TextField
            fullWidth
            label={t(tokens.form.extraTextInfo)}
            name="extra"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            multiline
            rows={2}
          >
          </TextField>
        <Stack spacing={1}>
          <TextField
            label={t(tokens.form.referencingType)}
            name="ref"
            select
            SelectProps={{ native: true }}
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            fullWidth

          >
            {refOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.words)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider

            value={duration}
            min={300}
            max={2000}
            step={100}
            onChange={(_, newValue) => setDuration(newValue as number)}
            sx={{ width: '93%' }}
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
            <label>{t(tokens.form.yourEssay)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
            </Button>
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
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.essays))}
                style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
              >
                {t(tokens.form.saveText)}
              </Button>
            </div>
          </Box>
        )}
      </Box>
  );

};

