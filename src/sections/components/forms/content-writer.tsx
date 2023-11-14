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
import useHandleSubmit from './handle-submit';



type Option = {
    label: string;
    value: string;
};



const languageOptions: Option[] = [
    { label: '', value: '' },
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'French', value: 'french' },
  { label: 'German', value: 'german' },
  { label: 'Italian', value: 'italian' },
  { label: 'Portuguese', value: 'portuguese' },
  { label: 'Russian', value: 'russian' },
  { label: 'Chinese (Simplified)', value: 'chinese-simplified' },
  { label: 'Chinese (Traditional)', value: 'chinese-traditional' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Korean', value: 'korean' },
  { label: 'Arabic', value: 'arabic' },
  { label: 'Hindi', value: 'hindi' },
  { label: 'Turkish', value: 'turkish' },
  { label: 'Dutch', value: 'dutch' },
  { label: 'Swedish', value: 'swedish' },
  { label: 'Finnish', value: 'finnish' },
  { label: 'Danish', value: 'danish' },
  { label: 'Norwegian', value: 'norwegian' },
  { label: 'Polish', value: 'polish' },
  { label: 'Greek', value: 'greek' },
  { label: 'Hungarian', value: 'hungarian' },
  { label: 'Czech', value: 'czech' },
  { label: 'Slovak', value: 'slovak' },
  { label: 'Romanian', value: 'romanian' },
  { label: 'Bulgarian', value: 'bulgarian' },
  { label: 'Serbian', value: 'serbian' },
  { label: 'Croatian', value: 'croatian' },
  { label: 'Bosnian', value: 'bosnian' },
  { label: 'Slovenian', value: 'slovenian' },
  { label: 'Albanian', value: 'albanian' },
  { label: 'Lithuanian', value: 'lithuanian' },
  { label: 'Latvian', value: 'latvian' },
  { label: 'Estonian', value: 'estonian' },
  { label: 'Maltese', value: 'maltese' },
  { label: 'Thai', value: 'thai' },
  { label: 'Filipino', value: 'filipino' },
  { label: 'Vietnamese', value: 'vietnamese' },
  { label: 'Indonesian', value: 'indonesian' },
  { label: 'Malay', value: 'malay' },
  { label: 'Persian', value: 'persian' },
  { label: 'Hebrew', value: 'hebrew' },
  { label: 'Urdu', value: 'urdu' },
  { label: 'Swahili', value: 'swahili' },
  { label: 'Yoruba', value: 'yoruba' },
  { label: 'Igbo', value: 'igbo' },
  { label: 'Zulu', value: 'zulu' },
    // ... add more as needed
];

const styleOptions: Option[] = [

    { label: '', value: '' },
  { label: tokens.form.informative, value: 'informative' },
  { label: 'Academic', value: 'academic' },
  { label: 'Analytical', value: 'analytical' },
  { label: 'Argumentative', value: 'argumentative' },
  { label: 'Articulate', value: 'articulate' },
  { label: 'Essay', value: 'essay' },
  { label: 'Blog', value: 'blog' },
  { label: 'Biographical', value: 'biographical' },
  { label: 'Conversational', value: 'conversational' },
  { label: 'Didactic', value: 'didactic' },
  { label: 'Educational', value: 'educational' },
  { label: 'Eloquent', value: 'eloquent' },
  { label: 'Empathetic', value: 'empathetic' },
  { label: 'Entertaining', value: 'entertaining' },
  { label: 'Epic', value: 'epic' },
  { label: 'Evocative', value: 'evocative' },
  { label: 'Explanatory', value: 'explanatory' },
  { label: 'Factual', value: 'factual' },
  { label: 'Figurative', value: 'figurative' },
  { label: 'Inspirational', value: 'inspirational' },
  { label: 'Investigative', value: 'investigative' },
  { label: 'Lyrical', value: 'lyrical' },
  { label: 'Motivational', value: 'motivational' },
  { label: 'Objective', value: 'objective' },
  { label: 'Persuasive', value: 'persuasive' },
  { label: 'Poetic', value: 'poetic' },
  { label: 'Pragmatic', value: 'pragmatic' },
  { label: 'Provocative', value: 'provocative' },
  { label: 'Quirky', value: 'quirky' },
  { label: 'Rhetorical', value: 'rhetorical' },
  { label: 'Scholarly', value: 'scholarly' },
  { label: 'Simplistic', value: 'simplistic' },
  { label: 'Speculative', value: 'speculative' },
  { label: 'Subjective', value: 'subjective' },
  { label: 'Succinct', value: 'succinct' },
  { label: 'Technical', value: 'technical' },
    { label: 'Casual', value: 'casual' },
    { label: 'Colloquial', value: 'colloquial' },
  { label: 'Comparative', value: 'comparative' },
  { label: 'Concise', value: 'concise' },
    { label: 'Creative', value: 'creative' },
  { label: 'Critical', value: 'critical' },
  { label: 'Descriptive', value: 'descriptive' },
  { label: 'Dramatic', value: 'dramatic' },
  { label: 'Editorial', value: 'editorial' },
  { label: 'Expository', value: 'expository' },
  { label: 'Formal', value: 'formal' },
  { label: 'Humorous', value: 'humorous' },
  { label: 'Informative', value: 'informative' },
  { label: 'Journalistic', value: 'journalistic' },
  { label: 'Narrative', value: 'narrative' },
  { label: 'Opinionated', value: 'opinionated' },
  { label: 'Persuasive', value: 'persuasive' },
  { label: 'Professional', value: 'professional' },
  { label: 'Reflective', value: 'reflective' },
  { label: 'Satirical', value: 'satirical' },
  { label: 'Scientific', value: 'scientific' },
  { label: 'SEO', value: 'seo' },
  { label: 'Technical', value: 'technical' },
  { label: 'Thought-Provoking', value: 'thought-provoking' },
  { label: 'Vivid', value: 'vivid' },

    // ... add more as needed
];

const toneOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Formal', value: 'formal' },
  { label: 'Assertive', value: 'assertive' },
  { label: 'Friendly', value: 'friendly' },
  { label: 'Informal', value: 'informal' },
  { label: 'Inspiring', value: 'inspiring' },
  { label: 'Professional', value: 'professional' },
  { label: 'Warm', value: 'warm' },
  { label: 'Candid', value: 'candid' },
  { label: 'Cheerful', value: 'cheerful' },
  { label: 'Compassionate', value: 'compassionate' },
  { label: 'Confident', value: 'confident' },
  { label: 'Conversational', value: 'conversational' },
  { label: 'Encouraging', value: 'encouraging' },
  { label: 'Enthusiastic', value: 'enthusiastic' },
  { label: 'Honest', value: 'honest' },
  { label: 'Hopeful', value: 'hopeful' },
  { label: 'Humorous', value: 'humorous' },
  { label: 'Inquisitive', value: 'inquisitive' },
  { label: 'Intimate', value: 'intimate' },
  { label: 'Lighthearted', value: 'lighthearted' },
  { label: 'Optimistic', value: 'optimistic' },
  { label: 'Passionate', value: 'passionate' },
  { label: 'Placid', value: 'placid' },
  { label: 'Playful', value: 'playful' },
  { label: 'Poignant', value: 'poignant' },
  { label: 'Provocative', value: 'provocative' },
  { label: 'Reassuring', value: 'reassuring' },
  { label: 'Reflective', value: 'reflective' },
  { label: 'Respectful', value: 'respectful' },
  { label: 'Reverent', value: 'reverent' },
  { label: 'Sarcastic', value: 'sarcastic' },
  { label: 'Sincere', value: 'sincere' },
  { label: 'Solemn', value: 'solemn' },
  { label: 'Thoughtful', value: 'thoughtful' },
  { label: 'Uplifting', value: 'uplifting' },
  { label: 'Whimsical', value: 'whimsical' },
  { label: 'Witty', value: 'witty' },
  { label: 'Zealous', value: 'zealous' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Melancholic', value: 'melancholic' },
  { label: 'Eloquent', value: 'eloquent' },
  { label: 'Empathetic', value: 'empathetic' },
  { label: 'Gentle', value: 'gentle' },
  // ... add more as needed


  // ... add more as needed
];

// ... rest of the code remains the same



export const ContentWriter: FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse } = useHandleSubmit();
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
    const newPrompt = `Write a ${duration}-word article titled "${title}" in ${language} ${t(style)} style and ${t(tone)} tone, using the following keywords: ${keywords}`;
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
              {option.label}
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
              {option.label}
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
        <Button onClick={submitToOpenAI} type="submit" variant="contained" fullWidth>
          Submit
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

