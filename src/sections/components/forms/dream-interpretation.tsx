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

import Typography from "@mui/material/Typography";
import {saveDoc} from "../buttons/saveDoc";
import useGPT4Submit from "./gpt4-submit";











export const DreamInterpretation: FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [dream, setDream] = useState<string>(''); // New state for the dream
const [title, setTitle] = useState<string>(''); // New state for the dream
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();


  const maxTokens = 1000;

  const submitToOpenAI = () => {
    // Use the existing prompt state, which is already translated
    handleSubmit(prompt, maxTokens)
        .then(() => {
          // Handle successful submission if needed
        })
        .catch(error => {
          console.error("Error submitting to OpenAI:", error);
        });
  };





  useEffect(() => {
    if (dream) {
      // Use the translation tokens to create the prompt
      let newPrompt = t(tokens.form.dreamInterpretation);

        const dreamText = ` ${t(dream)} `;

      newPrompt = newPrompt
        .replace('[dream]', dreamText);


      const dreamIntro = dreamText.split(' ');
      const title = dreamIntro.slice(0, 3).join(' ');



      // Update the prompt state with the new prompt
      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [dream, t]); // Include only the dependencies that are used in the effect






  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions*/}
        <Typography variant="body2">
          {t(tokens.form.dreamInstructions)}
        </Typography>

        <TextField
          fullWidth
          label={t(tokens.form.yourDream)}
          name="dream"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          multiline
          rows={5}
        />
        {/* New TextField for Keywords */}




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
          <label>{t(tokens.form.interpretation)}</label>
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
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.dreams))}
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

