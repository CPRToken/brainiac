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
import useHandleSubmit from './handle-submit';
import Typography from "@mui/material/Typography";

type Option = {
    label: string;
    value: string;
};



const styleOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Adventure, value: tokens.form.Adventure },
  { label: tokens.form.Holiday, value: tokens.form.Holiday },
  { label: tokens.form.GetAway, value: tokens.form.GetAway },
  { label: tokens.form.Honeymoon, value: tokens.form.Honeymoon },
  { label: tokens.form.Business, value: tokens.form.Business },
  { label: tokens.form.Leisure, value: tokens.form.Leisure },
  { label: tokens.form.Family, value: tokens.form.Family },
  { label: tokens.form.Cultural, value: tokens.form.Cultural },
  { label: tokens.form.EcoTourism, value: tokens.form.EcoTourism },
  { label: tokens.form.Luxury, value: tokens.form.Luxury }

    // ... add more as needed
];

const modeOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Air, value: tokens.form.Air },
  { label: tokens.form.Train, value: tokens.form.Train },
  { label: tokens.form.Bus, value: tokens.form.Bus },
  { label: tokens.form.Car, value: tokens.form.Car },
  { label: tokens.form.Boat, value: tokens.form.Boat },
  { label: tokens.form.Bicycle, value: tokens.form.Bicycle },
  { label: tokens.form.Motorcycle, value: tokens.form.Motorcycle },
  { label: tokens.form.Walking, value: tokens.form.Walking },
  { label: tokens.form.Subway, value: tokens.form.Subway },
  { label: tokens.form.Tram, value: tokens.form.Tram }
    // ... add more as needed
];




export const BlibicalFigures: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [figure, setFigure] = useState<string>('');

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
        .catch(error => {
          console.error("Error submitting to OpenAI:", error);
        });
    } else {
      console.error("Prompt is empty or not updated, cannot submit.");
    }
  };





  useEffect(() => {
        if (figure) {
            let newPrompt = t(tokens.form.blibicalPrompts);

              const figureText =  figure !== '' ? `${t(figure)} ` : '';


               newPrompt = newPrompt
                .replace('[figure]', figureText)


          newPrompt = newPrompt.replace(/,+\s*$/, '');

            setPrompt(newPrompt.trim());
        } else {
            setPrompt('');
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
        </Box>
        )}
      </Box>
    );

};
