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
import {useProtectedPage} from "../../../hooks/use-protectedpage";



type Option = {
  label: string;
  value: string;
};



const translationLanguageOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.English, value: tokens.form.English },
  { label: tokens.form.Spanish, value: tokens.form.Spanish },
  { label: tokens.form.Thai, value: tokens.form.Thai },
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

  { label: tokens.form.Filipino, value: tokens.form.Filipino },
  { label: tokens.form.Vietnamese, value: tokens.form.Vietnamese },
  { label: tokens.form.Indonesian, value: tokens.form.Indonesian },
  { label: tokens.form.Malay, value: tokens.form.Malay },
  { label: tokens.form.Persian, value: tokens.form.Persian },
  { label: tokens.form.Hebrew, value: tokens.form.Hebrew },
  { label: tokens.form.Zulu, value: tokens.form.Zulu },

  // ... add more as needed
];






export const Translator: FC = () => {
  useProtectedPage();
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [translationLanguage, setTranslationLanguage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
 const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {
    const maxTokens = 2000;
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

    if (translationLanguage && text) {
      let newPrompt = t(tokens.form.translationPrompts);

      const translationLanguageText = ` ${t(translationLanguage)} `;
      const textText = ` ${t(text)} `;

      const translationtextWords = textText.split(' ');
      const title = translationtextWords.slice(0, 3).join(' ');


      newPrompt = newPrompt
        .replace('[translationLanguage]', translationLanguageText)
        .replace('[text]', textText);


      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      // If not all selections are made, keep the prompt empty
      setPrompt('');
      setTitle('');

    }
  }, [translationLanguage, text, t]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions*/}
        <Typography variant="body2">
          {t(tokens.form.translateInstructions)}
        </Typography>

        <TextField
          fullWidth
          label={t(tokens.form.pasteText)}
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={15}
        />

        <TextField
          fullWidth
          label={t(tokens.form.translationLanguage)} // Translates the label
          name="translationLanguage"
          select
          SelectProps={{ native: true }}
          value={translationLanguage}
          onChange={(e) => setTranslationLanguage(e.target.value)}
        >
          {translationLanguageOptions.map((option) => (
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
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.translations))}
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

