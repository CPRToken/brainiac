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
import Typography from "@mui/material/Typography";

type Option = {
    label: string;
    value: string;
};



const listOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Joyful, value: tokens.form.Joyful },

];




export const TemplateReplicator: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [text, setText] = useState<string>('');

  const [list, setList] = useState<string>('');

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
    if (text && list ) {
      let newPrompt = t(tokens.form.replicaPrompts);

      const textText = list !== '' ? `${t(text)} ` : '';
      const listText = list !== '' ? `${t(list)} ` : '';





      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[text]', textText)
        .replace('[list]', listText)

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [text, list,  t]);











  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>



        <Stack spacing={3}>
          <TextField
            fullWidth
            label={t(tokens.form.pasteText)}
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={5}
          />

          <TextField
            fullWidth
            label={t(tokens.form.pasteList)}
            name="list"

            value={list}
            onChange={(e) => setList(e.target.value)}
            multiline
            rows={5}
          />






        </Stack>
        <Box sx={{mt: 3}}>
          <Button
            onClick={submitToOpenAI}
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24}/> : 'Submit'}
          </Button>
        </Box>

        {openAIResponse && (
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourRevisions)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
            </Button>
            <Paper elevation={3} ref={textRef}
                   style={{padding: '30px', overflow: 'auto', lineHeight: '1.5'}}>
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

