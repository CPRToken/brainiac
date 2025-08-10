import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
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
import useGPT5Submit from './gpt5-submit';
import Typography from "@mui/material/Typography";
import {saveDoc} from "../buttons/saveDoc";
import {useProtectedPage} from "src/hooks/use-protectedpage";






export const Articulate: FC = () => {
  useProtectedPage();



  const { handleSubmit, openAIResponse, isLoading } = useGPT5Submit();

  const [text, setText] = useState<string>('');
   const [title, setTitle] = useState<string>('');

  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();









  const submitToOpenAI = () => {
    const maxTokens = 2000;
    if (prompt) {
      // Submit the prompt that is updated by the useEffect hook
      handleSubmit(prompt, maxTokens)
        .then(() => {
          // Handle successful submission if needed
        })
        .catch(() => {
          // Optionally handle any error logic here, or leave it empty
        });
    }
  };



  useEffect(() => {
    if ( text ) {
      let newPrompt = t(tokens.form.articulatePrompt);

      const textText = text !== '' ? `${t(text)} ` : '';



      const textWords = textText.split(' ');
      const title = textWords.slice(0, 3).join(' ');


      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[text]', textText)




      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
      setTitle(title); // Set the title based on the first 3 words
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [text, t]);












  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
        <Typography variant="body2" sx={{ paddingTop: 'value', paddingBottom: '30px' }}>
          {t(tokens.form.articulateIntro)}
        </Typography>


        <Stack spacing={3}>
          <TextField
            fullWidth
            label={t(tokens.form.pasteText)}
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={10}
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
                  {index < array.length - 1 ? <br/> : null}
                </React.Fragment>
              ))}
            </Paper>
            <div style={{textAlign: 'center', paddingTop: '30px'}}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.expressions))}
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

