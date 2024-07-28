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

import {useProtectedPage} from "../../../hooks/use-protectedpage";
import useGPT4Submit from "./gpt4-submit";

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




export const TravelAgent: FC = () => {
  useProtectedPage();


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [destination, setDestination] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mode, setMode] = useState<string>('');
  const [budget, setBudget] = useState<number>(100);
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
        if (destination && style && mode && budget) {
            let newPrompt = t(tokens.form.writeItinerary);

              const destinationText =  destination !== '' ? `${t(destination)} ` : '';
              const styleText = style !== '' ? `${t(style)} ` : '';
              const modeText = mode !== '' ? `${t(mode)} ` : '';
              const budgetText = `${budget} ${t('')}`;


               newPrompt = newPrompt
                .replace('{destination}', destinationText)
                .replace('{style}', styleText)
                .replace('{mode}', modeText)
                .replace('{budget}', budgetText);

          newPrompt = newPrompt.replace(/,+\s*$/, '');

            setPrompt(newPrompt.trim());
        } else {
            setPrompt('');
        }
    }, [destination, style, mode, budget, t]);


  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    // If newValue is an array, you can decide how to handle it.
    // For a single thumb slider, it should be just a number.
    if (typeof newValue === 'number') {
      setBudget(newValue); // Directly set the new value
    }
  };

// Corrected maxTokens calculation
  const maxTokens = budget * 4; // 1 word is approx. 4 tokens




    return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.destination)}
          name="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          multiline // Enables multiline input
          rows={1} // Sets the number of rows
        />

        <TextField
          fullWidth
          label={t(tokens.form.typeHoliday)}
          name="style"
          select
          SelectProps={{ native: true }}
          value={style}
          onChange={(e) => setTheme(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.modeTransport)}
          name="mode"
          select
          SelectProps={{ native: true }}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.budget)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider
            value={budget}
            min={300}
            max={10000}
            step={100}
            onChange={handleSliderChange} //slider change determines amount of tokens used
            sx={{ width: '95%' }}
          />
        </div>



      </Stack>
        <Box sx={{ mt: 3 }}>
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
              <label>{t(tokens.form.yourItinerary)}</label>
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
