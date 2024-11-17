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

type Option = {
  label: string;
  value: string;
};


const countryOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.USA, value: tokens.form.USA },
  { label: tokens.form.Chile, value: tokens.form.Chile },
  { label: tokens.form.Australia, value: tokens.form.Australia },
  { label: tokens.form.Spain, value: tokens.form.Spanish },
  { label: tokens.form.French, value: tokens.form.French },
  // ... add more
  { label: tokens.form.German, value: tokens.form.German },
  { label: tokens.form.Hungary, value: tokens.form.Hungarian },
  { label: tokens.form.Italy, value: tokens.form.Italian },
  { label: tokens.form.Portugal, value: tokens.form.Portuguese },
  { label: tokens.form.Russia, value: tokens.form.Russian },
  { label: tokens.form.India, value: tokens.form.India },
  { label: tokens.form.Japan, value: tokens.form.Japanese },
  { label: tokens.form.Korea, value: tokens.form.Korean },
  { label: tokens.form.Brazil, value: tokens.form.Brazil },
  { label: tokens.form.Turkish, value: tokens.form.Turkish },
  { label: tokens.form.Dutch, value: tokens.form.Dutch },
  { label: tokens.form.Swedish, value: tokens.form.Swedish },
  { label: tokens.form.Finnish, value: tokens.form.Finnish },
  { label: tokens.form.Danish, value: tokens.form.Danish },
  { label: tokens.form.Norwegian, value: tokens.form.Norwegian },
  { label: tokens.form.Polish, value: tokens.form.Polish },
  { label: tokens.form.Greek, value: tokens.form.Greek },
  { label: tokens.form.Czech, value: tokens.form.Czech },
  { label: tokens.form.Slovak, value: tokens.form.Slovak },
  { label: tokens.form.Romanian, value: tokens.form.Romanian },
  { label: tokens.form.Bulgarian, value: tokens.form.Bulgarian },
  { label: tokens.form.Serbian, value: tokens.form.Serbian },
  { label: tokens.form.Croatian, value: tokens.form.Croatian },
  { label: tokens.form.Bosnian, value: tokens.form.Bosnian },
  { label: tokens.form.Slovenian, value: tokens.form.Slovenian },
  { label: tokens.form.Albanian, value: tokens.form.Albanian },
  { label: tokens.form.Lithuanian, value: tokens.form.Lithuanian },
  { label: tokens.form.Latvian, value: tokens.form.Latvian },
  { label: tokens.form.Estonian, value: tokens.form.Estonian },
  { label: tokens.form.Maltese, value: tokens.form.Maltese },
  { label: tokens.form.Thai, value: tokens.form.Thai },
  { label: tokens.form.Filipino, value: tokens.form.Filipino },
  { label: tokens.form.Vietnamese, value: tokens.form.Vietnamese },
  { label: tokens.form.Indonesian, value: tokens.form.Indonesian },
  { label: tokens.form.Malay, value: tokens.form.Malay },
  { label: tokens.form.Persian, value: tokens.form.Persian },
  { label: tokens.form.Hebrew, value: tokens.form.Hebrew },
  // ... add more
];

export const GovernmentPositions: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [country, setCountry] = useState<string>('');
  const [position, setPosition] = useState<string>('');
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
        .catch(error => {
          console.error("Error submitting to OpenAI:", error);
        });
    } else {
      console.error("Prompt is empty or not updated, cannot submit.");
    }
  };





  useEffect(() => {
        if (position && country) {
            let newPrompt = t(tokens.form.govPositionPrompts);

              const positionText =  position !== '' ? `${t(position)} ` : '';
          const countryText = ` ${t(country)} `;

          const positionWords = positionText.split(' ').filter(word => word.length > 0);
          const countryWords = countryText.split(' ').filter(word => word.length > 0);


          const title = [...countryWords.slice(0, 1), ...positionWords.slice(0, 1)].join(' ');


               newPrompt = newPrompt
                .replace('[position]', positionText)
                .replace('[country]', countryText)




          setPrompt(newPrompt.trim());
          setTitle(title);
        } else {
          setPrompt('');
          setTitle('');
        }
    }, [position, country,  t]);




// Corrected maxTokens calculation
  const maxTokens = 2500 - prompt.length;




    return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
        <Typography variant="body2" sx={{ paddingTop: 'value', paddingBottom: '30px' }}>
          {t(tokens.form.govPositionsInstructions)}
        </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.position)}
          name="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          multiline // Enables multiline input
          rows={1} // Sets the number of rows
        />
        <TextField
          label={t(tokens.form.country)}
          name="artist"
          select
          SelectProps={{native: true}}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          fullWidth

        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>




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
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.position))}
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
