import React from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import useHandleSubmit from './handle-submit';





export const UniAnswers: FC = () => {



  const { handleSubmit, openAIResponse } = useHandleSubmit();

  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };








  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.pasteQuestion)}
          name="prompt"
          value={prompt}
          onChange={handlePromptChange}
          multiline
          rows={10}
        />
      </Stack>
        <Box sx={{ mt: 3 }}>
            <Button
                onClick={() => handleSubmit(prompt, 1000)}
                type="submit"
                variant="contained"
                fullWidth
            >
                Submit
            </Button>
        </Box>
      <Box sx={{ mt: 3 }}>
        {openAIResponse && (
          <>
            <label>Your Answers:</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon />
            </Button>
          </>
        )}
        <Paper elevation={3} ref={textRef} style={{ padding: '10px', height: '100%', overflow: 'auto', lineHeight: '1.5' }}>
          {openAIResponse && openAIResponse.split('\n').map((str, index, array) =>
            index === array.length - 1 ? str : (
              <React.Fragment key={index}>
                {str}
                <br />
              </React.Fragment>
            )
          )}
        </Paper>
      </Box>
    </Box>
  );
};
