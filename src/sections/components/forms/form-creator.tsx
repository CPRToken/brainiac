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
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";



type Option = {
  label: string;
  value: string;
};



const codeLanguageOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.ReactJS, value: tokens.form.ReactJS },


  // ... add more as needed
];



const languageOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Spanish, value: tokens.form.Spanish },




  // ... add more as needed
];



export const FormCreator: FC = () => {

  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [textFields, setTextFields] = useState<string>('');

  const [needTranslation, setNeedTranslation] = useState('');
 const [language, setLanguage] = useState<string>('');
  const [labelCode, setLabelCode] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  useEffect(() => {
    let newPrompt = t(tokens.form.formCreatorPrompts);

    const codeLanguageText = codeLanguage ? `${t(codeLanguage)} ` : '';
    const languageText = language ? `${t(language)} ` : '';
   const textFieldsText = textFields ? `${t(textFields)} ` : '';
    const labelCodeText = labelCode ? `${t(labelCode)} ` : '';
    const promptText = prompt ? `${t(prompt)} ` : '';

    newPrompt = newPrompt.replace('{language}', languageText);
    newPrompt = newPrompt.replace('{codeLanguage}', codeLanguageText);
    newPrompt = newPrompt.replace('{textFields}', textFieldsText);
    newPrompt = newPrompt.replace('{labelCode}', labelCodeText);
    newPrompt = newPrompt.replace('{prompt}', promptText);

    setPrompt(newPrompt);

  } , [codeLanguage, language, textFields, labelCode, prompt, t]);

  const submitToOpenAI = () => {
    const maxTokens = 2000;
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


  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>


        <TextField
          fullWidth
          label={t(tokens.form.codeLanguage)} // Translates the label
          name="language"
          select
          SelectProps={{ native: true }}
          value={codeLanguage}
          onChange={(e) => setCodeLanguage(e.target.value)}
        >
          {codeLanguageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>



        <TextField
          fullWidth
          label={t(tokens.form.writeOptions)}
          name="labelCode"
          value={labelCode}
          onChange={(e) => setLabelCode(e.target.value)}
          multiline
          rows={2}
        />


        <TextField
          fullWidth
          label={t(tokens.form.textFields)}
          name="textFields"
          value={textFields}
          onChange={(e) => setTextFields(e.target.value)}
          multiline
          rows={2}
        />


            <FormControl component="fieldset">
              <FormLabel component="legend">{t(tokens.form.needTranslation)}</FormLabel>
              <RadioGroup
                row
                aria-label="needTranslation"
                name="needTranslation"
                value={needTranslation}
                onChange={(e) => setNeedTranslation(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>



            {/* Conditional drop-down and text box for translation */}
            {needTranslation === 'yes' && (
              <>
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












          </>
        )}
      </Stack>








      <Box sx={{ mt: 3 }}>
        {/* Button to submit the prompt to OpenAI */}
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
        <Box sx={{ mt: 3 }}>
          <label>Your Translation:</label>
          <Button onClick={handleCopyText} title="Copy response text">
            <FileCopyIcon />
          </Button>
          <Paper elevation={3} ref={textRef} style={{ padding: '30px', overflow: 'auto', lineHeight: '1.5' }}>
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

