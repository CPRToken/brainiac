import React from 'react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';
import Typography from "@mui/material/Typography";
import {saveDoc} from "../buttons/saveDoc";



type Option = {
  label: string;
  value: string;
};



const languageOptions: Option[] = [
  { label: '', value: '' },
  { label: 'React Native', value: 'React Native' },
   { label: 'ReactJS', value: 'ReactJS' },
  { label: 'ReactJS with NextJS using Type Script', value: 'ReactJS with NextJS using Type Script' },
  { label: 'Javascript', value: 'Javascript' },

  // ... add more as needed
];






export const CodeConverter: FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [language, setLanguage] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();




  const submitToOpenAI = () => {
    const maxTokens = 3000;
    if (prompt) {

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
if (language && code) {
  let newPrompt = `Translate the below code '${code}' into ${t(language)}, elements`;

  const codeText = code !== '' ? `${t(code)}` : '';
  const languageText = language !== '' ? `${t(language)}` : '';

  newPrompt = newPrompt
    .replace( '[language]', languageText)
    .replace( '[code]', codeText);

  newPrompt = newPrompt.replace(/,+\s*$/, '');

  setPrompt(newPrompt.trim());
  setTitle(title); // Set the title based on the first 3 words
} else {
  setPrompt('');
  setTitle('');
}
  }, [language, code]);


  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions*/}




        <TextField
          fullWidth
          label={t(tokens.form.pasteCode)}
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          multiline
          rows={15}
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
        <Box sx={{mt: 3}}>
          <label>Your Translation:</label>
          <Button onClick={handleCopyText} title="Copy response code">
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
              onClick={() => saveDoc(openAIResponse, title, 'code')}
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

