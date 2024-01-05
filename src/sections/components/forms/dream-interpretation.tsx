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
import useHandleSubmit from './handle-submit';
import Typography from "@mui/material/Typography";



type Option = {
    label: string;
    value: string;
};








export const DreamInterpretation: FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();

  const [dream, setDream] = useState<string>(''); // New state for the dream

  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();


  const maxTokensForResume = 1000;

  const submitToOpenAI = () => {
    // Use the existing prompt state, which is already translated
    handleSubmit(prompt, maxTokensForResume)
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
      let newPrompt = t(tokens.form.dreamInterpretation, {
        dream: dream,
        // other properties like keywords can be removed if they are not used
      });

      // Update the prompt state with the new prompt
      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
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
        <Box sx={{ mt: 3 }}>
          <label>{t(tokens.form.interpretation)}</label>
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

