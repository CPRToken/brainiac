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
import {saveDoc} from "../buttons/saveDoc";
type Option = {
    label: string;
    value: string;
};




const languageOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.English, value: tokens.form.English },
  { label: tokens.form.Spanish, value: tokens.form.Spanish },
  { label: tokens.form.French, value: tokens.form.French },
  { label: tokens.form.German, value: tokens.form.German },
  { label: tokens.form.Italian, value: tokens.form.Italian },
  { label: tokens.form.Portuguese, value: tokens.form.Portuguese },
  { label: tokens.form.Russian, value: tokens.form.Russian },
  { label: tokens.form.Japanese, value: tokens.form.Japanese },
  { label: tokens.form.Korean, value: tokens.form.Korean },
  { label: tokens.form.Arabic, value: tokens.form.Arabic },
  { label: tokens.form.Hindi, value: tokens.form.Hindi },
  { label: tokens.form.Turkish, value: tokens.form.Turkish },
  { label: tokens.form.Dutch, value: tokens.form.Dutch },
  { label: tokens.form.Swedish, value: tokens.form.Swedish },
  { label: tokens.form.Finnish, value: tokens.form.Finnish },
  { label: tokens.form.Danish, value: tokens.form.Danish },
  { label: tokens.form.Norwegian, value: tokens.form.Norwegian },
  { label: tokens.form.Polish, value: tokens.form.Polish },
  { label: tokens.form.Greek, value: tokens.form.Greek },
  { label: tokens.form.Hungarian, value: tokens.form.Hungarian },
  { label: tokens.form.Czech, value: tokens.form.Czech },
  { label: tokens.form.Slovak, value: tokens.form.Slovak },
  { label: tokens.form.Romanian, value: tokens.form.Romanian },
  { label: tokens.form.Bulgarian, value: tokens.form.Bulgarian },
  { label: tokens.form.Serbian, value: tokens.form.Serbian },
  { label: tokens.form.Croatian, value: tokens.form.Croatian },
  { label: tokens.form.Bosnian, value: tokens.form.Bosnian },
  { label: tokens.form.Slovenian, value: tokens.form.Slovenian },
  { label: tokens.form.Albanian, value: tokens.form.Albanian },
  { label: tokens.form.Lithuanian, value: tokens.form.Lithuanian },
  { label: tokens.form.Latvian, value: tokens.form.Latvian },
  { label: tokens.form.Estonian, value: tokens.form.Estonian },
  { label: tokens.form.Maltese, value: tokens.form.Maltese },
  { label: tokens.form.Thai, value: tokens.form.Thai },
  { label: tokens.form.Filipino, value: tokens.form.Filipino },
  { label: tokens.form.Vietnamese, value: tokens.form.Vietnamese },
  { label: tokens.form.Indonesian, value: tokens.form.Indonesian },
  { label: tokens.form.Malay, value: tokens.form.Malay },
  { label: tokens.form.Persian, value: tokens.form.Persian },
  { label: tokens.form.Hebrew, value: tokens.form.Hebrew },
  { label: tokens.form.Zulu, value: tokens.form.Zulu },
  // ... add more as needed
];



// ... add more as needed


const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.informative, value: tokens.form.informative },
  { label: tokens.form.Humorous, value: tokens.form.Humorous },
  { label: tokens.form.analytical, value: tokens.form.analytical },
  { label: tokens.form.argumentative, value: tokens.form.argumentative },
  { label: tokens.form.articulate, value: tokens.form.articulate },
  { label: tokens.form.blog, value: tokens.form.blog },
  { label: tokens.form.biographical, value: tokens.form.biographical },
  { label: tokens.form.conversational, value: tokens.form.conversational },
   { label: tokens.form.Educational, value: tokens.form.Educational },
  { label: tokens.form.Eloquent, value: tokens.form.Eloquent },
  { label: tokens.form.Empathetic, value: tokens.form.Empathetic },
  { label: tokens.form.Entertaining, value: tokens.form.Entertaining },
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
  { label: tokens.form.Journalistic, value: tokens.form.Journalistic },
  { label: tokens.form.Narrative, value: tokens.form.Narrative },
  { label: tokens.form.Opinionated, value: tokens.form.Opinionated },
  { label: tokens.form.Persuasive, value: tokens.form.Persuasive },
  { label: tokens.form.Professional, value: tokens.form.Professional },
  { label: tokens.form.Reflective, value: tokens.form.Reflective },
  { label: tokens.form.Satirical, value: tokens.form.Satirical },
  { label: tokens.form.Technical, value: tokens.form.Technical },
    // ... add more as needed
];






export const TweetGenerator: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [title, setTitle] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [options, setOptions] = useState<number>(3);
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
    if (language && title && style && options) {
      let newPrompt = t(tokens.form.generateTweets);

      const titleText = title !== '' ? `${t(title)} ` : '';
      const languageText = language !== '' ? `${t(language)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const optionsText = `${options} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[title]', titleText)
        .replace('[language]', languageText)
        .replace('[style]', styleText)
        .replace('[options]', optionsText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [title, language, style, options, t]);











  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>

        <TextField
          fullWidth
          label={t(tokens.form.topic)}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          label={t(tokens.form.language)} // Translates the label
          name="language"
          select
          SelectProps={{ native: true }}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.options)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider

            value={options}
            min={1}
            max={5}
            step={1}
            onChange={(_, newValue) => setOptions(newValue as number)}
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
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.tweets))}
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

