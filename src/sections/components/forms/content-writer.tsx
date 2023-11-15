import React from 'react';
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



const languageOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.English, value: 'english' },
  { label: tokens.form.Spanish, value: 'spanish' },
  { label: tokens.form.French, value: 'french' },
  { label: tokens.form.German, value: 'german' },
  { label: tokens.form.Italian, value: 'italian' },
  { label: tokens.form.Portuguese, value: 'portuguese' },
  { label: tokens.form.Russian, value: 'russian' },
  { label: tokens.form.Japanese, value: 'japanese' },
  { label: tokens.form.Korean, value: 'korean' },
  { label: tokens.form.Arabic, value: 'arabic' },
  { label: tokens.form.Hindi, value: 'hindi' },
  { label: tokens.form.Turkish, value: 'turkish' },
  { label: tokens.form.Dutch, value: 'dutch' },
  { label: tokens.form.Swedish, value: 'swedish' },
  { label: tokens.form.Finnish, value: 'finnish' },
  { label: tokens.form.Danish, value: 'danish' },
  { label: tokens.form.Norwegian, value: 'norwegian' },
  { label: tokens.form.Polish, value: 'polish' },
  { label: tokens.form.Greek, value: 'greek' },
  { label: tokens.form.Hungarian, value: 'hungarian' },
  { label: tokens.form.Czech, value: 'czech' },
  { label: tokens.form.Slovak, value: 'slovak' },
  { label: tokens.form.Romanian, value: 'romanian' },
  { label: tokens.form.Bulgarian, value: 'bulgarian' },
  { label: tokens.form.Serbian, value: 'serbian' },
  { label: tokens.form.Croatian, value: 'croatian' },
  { label: tokens.form.Bosnian, value: 'bosnian' },
  { label: tokens.form.Slovenian, value: 'slovenian' },
  { label: tokens.form.Albanian, value: 'albanian' },
  { label: tokens.form.Lithuanian, value: 'lithuanian' },
  { label: tokens.form.Latvian, value: 'latvian' },
  { label: tokens.form.Estonian, value: 'estonian' },
  { label: tokens.form.Maltese, value: 'maltese' },
  { label: tokens.form.Thai, value: 'thai' },
  { label: tokens.form.Filipino, value: 'filipino' },
  { label: tokens.form.Vietnamese, value: 'vietnamese' },
  { label: tokens.form.Indonesian, value: 'indonesian' },
  { label: tokens.form.Malay, value: 'malay' },
  { label: tokens.form.Persian, value: 'persian' },
  { label: tokens.form.Hebrew, value: 'hebrew' },
  { label: tokens.form.Zulu, value: 'zulu' },
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

  { label: tokens.form.Vivid, value: 'vivid' },

    // ... add more as needed
];

const toneOptions: Option[] = [
  { label: '', value: '' },
    { label: tokens.form.Formal, value: 'formal' },
    { label: tokens.form.Assertive, value: 'assertive' },
    { label: tokens.form.Friendly, value: 'friendly' },
    { label: tokens.form.Informal, value: 'informal' },
    { label: tokens.form.Inspiring, value: 'inspiring' },
    { label: tokens.form.Professional, value: 'professional' },
    { label: tokens.form.Warm, value: 'warm' },
    { label: tokens.form.Candid, value: 'candid' },
    { label: tokens.form.Cheerful, value: 'cheerful' },
    { label: tokens.form.Compassionate, value: 'compassionate' },
    { label: tokens.form.Confident, value: 'confident' },
    { label: tokens.form.Conversational, value: 'conversational' },
    { label: tokens.form.Encouraging, value: 'encouraging' },
    { label: tokens.form.Enthusiastic, value: 'enthusiastic' },
    { label: tokens.form.Honest, value: 'honest' },
    { label: tokens.form.Hopeful, value: 'hopeful' },
    { label: tokens.form.Humorous, value: 'humorous' },
    { label: tokens.form.Inquisitive, value: 'inquisitive' },
    { label: tokens.form.Intimate, value: 'intimate' },
    { label: tokens.form.Lighthearted, value: 'lighthearted' },
    { label: tokens.form.Optimistic, value: 'optimistic' },
    { label: tokens.form.Passionate, value: 'passionate' },
    { label: tokens.form.Placid, value: 'placid' },
    { label: tokens.form.Playful, value: 'playful' },
    { label: tokens.form.Poignant, value: 'poignant' },
    { label: tokens.form.Provocative, value: 'provocative' },
    { label: tokens.form.Reassuring, value: 'reassuring' },
    { label: tokens.form.Reflective, value: 'reflective' },
    { label: tokens.form.Respectful, value: 'respectful' },
    { label: tokens.form.Reverent, value: 'reverent' },
    { label: tokens.form.Sarcastic, value: 'sarcastic' },
    { label: tokens.form.Sincere, value: 'sincere' },
    { label: tokens.form.Solemn, value: 'solemn' },
    { label: tokens.form.Thoughtful, value: 'thoughtful' },
    { label: tokens.form.Uplifting, value: 'uplifting' },
    { label: tokens.form.Whimsical, value: 'whimsical' },
    { label: tokens.form.Witty, value: 'witty' },
    { label: tokens.form.Zealous, value: 'zealous' },
    { label: tokens.form.Neutral, value: 'neutral' },
    { label: tokens.form.Melancholic, value: 'melancholic' },
    { label: tokens.form.Eloquent, value: 'eloquent' },
    { label: tokens.form.Empathetic, value: 'empathetic' },
    { label: tokens.form.Gentle, value: 'gentle' },
    // ... add more as needed
];




export const ContentWriter: FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [language, setLanguage] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [duration, setDuration] = useState<number>(500);
  const [title, setTitle] = useState<string>(''); // New state for the title
  const [keywords, setKeywords] = useState<string>(''); // New state for the keywords
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();


  const maxTokensForResume = 2000;

  const submitToOpenAI = () => {
    // Construct a prompt that OpenAI can use to generate an article
    const newPrompt = `Write a ${duration}-word article titled "${title}" in ${t(language)} ${t(style)} style and ${t(tone)} tone, using the following keywords: ${keywords}`;
    setPrompt(newPrompt); // Update the prompt state
    handleSubmit(newPrompt, maxTokensForResume)
        .then(() => {
          // Handle successful submission if needed
        })
        .catch(error => {
          console.error("Error submitting to OpenAI:", error);
        });
  };




  useEffect(() => {
    if (language && style && tone && duration && title && keywords) {
      // Use the translation tokens to create the prompt
      let newPrompt = t(tokens.form.writeContent, {
        duration: `${duration} words`,
        language: t(language),
        style: t(style),
        tone: t(tone),
        title: title,
        keywords: keywords
      });

      // Update the prompt state with the new prompt
      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [language, style, tone, duration, title, keywords, t]);





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

        <div>
          <label>{t(tokens.form.words)}</label>
          <Slider
            value={duration / 500} // Convert the word count to the slider's scale
            getAriaValueText={(value) => `${value * 500} words`} // For accessibility
            valueLabelDisplay="on" // This enables the value label
            valueLabelFormat={(value) => `${value * 500}`} // This formats the label to show the word count
            min={1}
            max={4}
            step={0.5} // The slider's step
            marks // This adds marks at each step
            onChange={(_, newValue) => setDuration(newValue as number * 500)} // Convert back to words on change
          />

        </div>
        {/* Removed the TextField for Prompt as per your instructions */}
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
        <Box sx={{ mt: 3 }}>
          <label>Your Content:</label>
          <Button onClick={handleCopyText} title="Copy response text">
            <FileCopyIcon />
          </Button>
          <Paper elevation={3} ref={textRef} style={{ padding: '10px', overflow: 'auto', lineHeight: '1.5' }}>
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

