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
import usePlagSubmit from './plagiarism-submit';
import Typography from "@mui/material/Typography";
import {saveDoc} from "../buttons/saveDoc";
import {useProtectedPage} from "../../../hooks/use-protectedpage";











export const PlagiarismChecker: FC = () => {
  useProtectedPage();
  const { t } = useTranslation();
  const { handleSubmit, plagResponse, isLoading } = usePlagSubmit();

  const [text, setText] = useState<string>('');

  const submitToCopyscape = () => {
    if (text) {
      handleSubmit(text)
        .then(() => {
          // Handle successful submission if needed
        })
        .catch(error => {
          console.error("Error submitting to Copyscape:", error);
        });
    } else {
      console.error("Text is empty, cannot submit.");
    }
  };

  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
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
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button
          onClick={submitToCopyscape}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}  // Disable the button while loading
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>

      {plagResponse && (
        <Box sx={{ mt: 3 }}>
          <label>Plagiarism Report:</label>
          <Paper elevation={3} style={{ padding: '30px', overflow: 'auto', lineHeight: '1.5' }}>
            <pre>{plagResponse}</pre>
          </Paper>
        </Box>
      )}
    </Box>
  );
};
