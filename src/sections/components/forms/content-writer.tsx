import React from 'react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
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
  { label: tokens.form.Vivid, value: tokens.form.Vivid },


    // ... add more as needed
];

const toneOptions: Option[] = [
  { label: '', value: '' },
   { label: tokens.form.Formal, value: tokens.form.Formal },
    { label: tokens.form.Assertive, value: tokens.form.Assertive },
    { label: tokens.form.Authoritative, value: tokens.form.Authoritative },
    { label: tokens.form.Friendly, value: tokens.form.Friendly },
    { label: tokens.form.Informal, value: tokens.form.Informal },
    { label: tokens.form.Inspirational, value: tokens.form.Inspirational },
    { label: tokens.form.Professional, value: tokens.form.Professional },
    { label: tokens.form.Warm, value: tokens.form.Warm },
    { label: tokens.form.Candid, value: tokens.form.Candid },
    { label: tokens.form.Cheerful, value: tokens.form.Cheerful },
    { label: tokens.form.Compassionate, value: tokens.form.Compassionate },
    { label: tokens.form.Confident, value: tokens.form.Confident },
    { label: tokens.form.Conversational, value: tokens.form.Conversational },
    { label: tokens.form.Encouraging, value: tokens.form.Encouraging },
    { label: tokens.form.Enthusiastic, value: tokens.form.Enthusiastic },
    { label: tokens.form.Humorous, value: tokens.form.Humorous },
    { label: tokens.form.Inquisitive, value: tokens.form.Inquisitive },
    { label: tokens.form.Intimate, value: tokens.form.Intimate },
    { label: tokens.form.Lighthearted, value: tokens.form.Lighthearted },
    { label: tokens.form.Optimistic, value: tokens.form.Optimistic },
    { label: tokens.form.Passionate, value: tokens.form.Passionate },
    { label: tokens.form.Playful, value: tokens.form.Playful },
    { label: tokens.form.Poignant, value: tokens.form.Poignant },
    { label: tokens.form.Provocative, value: tokens.form.Provocative },
    { label: tokens.form.Romantic, value: tokens.form.Romantic },
    { label: tokens.form.Reflective, value: tokens.form.Reflective },
   { label: tokens.form.Sarcastic, value: tokens.form.Sarcastic },
    { label: tokens.form.Sincere, value: tokens.form.Sincere },
    { label: tokens.form.Skeptical, value: tokens.form.Skeptical },
    { label: tokens.form.Sympathetic, value: tokens.form.Sympathetic },
    { label: tokens.form.Whimsical, value: tokens.form.Whimsical },
    { label: tokens.form.Witty, value: tokens.form.Witty },
    { label: tokens.form.Zealous, value: tokens.form.Zealous },
   { label: tokens.form.Melancholic, value: tokens.form.Melancholic },
    { label: tokens.form.Eloquent, value: tokens.form.Eloquent },
    { label: tokens.form.Empathetic, value: tokens.form.Empathetic },

    // ... any other entries you have


  // ... add more as needed
];




export const ContentWriter: FC = () => {

  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [language, setLanguage] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [words, setWords] = useState<number>(500);
  const [title, setTitle] = useState<string>(''); // New state for the title
  const [keywords, setKeywords] = useState<string>(''); // New state for the keywords
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
    if (language && style && tone && words && title && keywords) {
     let newPrompt = t(tokens.form.writeContent);

      const languageText= language !== '' ? `${t(language)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const toneText = tone !== '' ? `${t(tone)} ` : '';
       const wordsText = `${words} ${t('')}`;


      newPrompt = newPrompt
        .replace('[language]', languageText)
        .replace('[style]', styleText)
        .replace('[tone]', toneText)
        .replace('[words]', wordsText)
        .replace('[title]', title)
        .replace('[keywords]', keywords);

      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [language, style, tone, words, title, keywords, t]);



  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    // If newValue is an array, you can decide how to handle it.
    // For a single thumb slider, it should be just a number.
    if (typeof newValue === 'number') {
      setWords(newValue); // Directly set the new value
    }
  };

// Corrected maxTokens calculation
  const maxTokens = words * 4; // 1 word is approx. 4 tokens



  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* New TextField for Title */}
        <TextField
          fullWidth
          label={t(tokens.form.title)}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* New TextField for Keywords */}
        <TextField
          fullWidth
          label={t(tokens.form.keywords)}
          name="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
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
              {option.label ? t(option.label) : ''} {/* Translate the label here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.tone)}
          name="tone"
          select
          SelectProps={{ native: true }}
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          {toneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.words)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider
            value={words}
            min={500}
            max={2000}
            step={100} // The slider's step
            marks // This adds marks at each step
            onChange={handleSliderChange} //slider change determines amount of tokens used
            sx={{ width: '95%' }}
          />

        </div>


      </Stack>
      <Box sx={{ mt: 3 }}>
        {/* Button to submit the prompt to OpenAI */}
        <Button
          onClick={submitToOpenAI}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}  // Disable the button while loading
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>


      {openAIResponse && (
        <Box sx={{mt: 3}}>
          <label>{t(tokens.form.yourContent)}</label>
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
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.articles))}
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
