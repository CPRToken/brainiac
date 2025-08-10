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
import useGPT4Submit from './gpt4-submit';
import Typography from "@mui/material/Typography";
import { saveDoc } from 'src/sections/components/buttons/saveDoc';




export const BiblicalFigures: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [figure, setFigure] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {

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
        if (figure) {
            let newPrompt = t(tokens.form.blibicalPrompts);

              const figureText =  figure !== '' ? `${t(figure)} ` : '';


               newPrompt = newPrompt
                .replace('[figure]', figureText)

          newPrompt = newPrompt.replace(/,+\s*$/, '');


          const biblicalTitle = figureText.split(' ');
          const title = biblicalTitle.slice(0, 3).join(' ');




          setPrompt(newPrompt.trim());
          setTitle(title);
        } else {
          setPrompt('');
          setTitle('');
        }
    }, [figure,  t]);




// Corrected maxTokens calculation
  const maxTokens = 1500 - prompt.length;




    return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
        <Typography variant="body2" sx={{ paddingTop: 'value', paddingBottom: '30px' }}>
          {t(tokens.form.blibicalInst)}
        </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.figure)}
          name="figure"
          value={figure}
          onChange={(e) => setFigure(e.target.value)}
          multiline // Enables multiline input
          rows={1} // Sets the number of rows
        />





      </Stack>
        <Box sx={{ mt: 4 }}>
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
              <label>{t(tokens.form.yourResponse)}</label>
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
          <div style={{textAlign: 'center', paddingTop: '20px'}}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.figures))}
              style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
            >
              {t(tokens.form.saveText)}
            </Button>
          </div>
        </Box>
        )}
      </Box>
    );
}
