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











export const FruitsNVeges: FC = () => {
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [fruit, setFruit] = useState<string>(''); // New state for the fruit

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
    if (fruit) {
      // Use the translation tokens to create the prompt
      let newPrompt = t(tokens.form.fruitBenefits, {
        fruit: fruit,
        // other properties like keywords can be removed if they are not used
      });

      // Update the prompt state with the new prompt
      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [fruit, t]); // Include only the dependencies that are used in the effect






  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions*/}
        <Typography variant="body2">
          {t(tokens.form.fruitInstructions)}
        </Typography>

        <TextField
          fullWidth
          label={t(tokens.form.fruitOrVege)}
          name="fruit"
          value={fruit}
          onChange={(e) => setFruit(e.target.value)}
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
          <label>{t(tokens.form.healthBenefits)}</label>
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

