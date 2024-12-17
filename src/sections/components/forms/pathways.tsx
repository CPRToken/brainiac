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
import {saveDoc} from "../buttons/saveDoc";

type Option = {
    label: string;
    value: string;
};




const experienceOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.lessThanYear, value: tokens.form.lessThanYear },
  { label: tokens.form.Between1N3, value: tokens.form.Between1N3 },
  { label: tokens.form.Between3N5, value: tokens.form.Between3N5 },
  { label: tokens.form.Between5N10, value: tokens.form.Between5N10 },
  { label: tokens.form.moreThan10, value: tokens.form.moreThan10 },
    // ... add more as needed
];

const developmentOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.careerAdvancement, value: tokens.form.careerAdvancement },
  { label: tokens.form.careerChange, value: tokens.form.careerChange },
  { label: tokens.form.networking, value: tokens.form.networking },

  // ... add more as needed
];


export const Pathways: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [industry, setIndustry] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
 const [title, setTitle] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [development, setDevelopment] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {
    const maxTokens = 1000;
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
    if (industry && profession && experience && development) {
      let newPrompt = t(tokens.form.careerDevelopmentPrompts);

      const industryText = industry !== '' ? `${t(industry)} ` : '';
      const professionText = profession !== '' ? `${t(profession)} ` : '';
      const experienceText = `${t(experience)} `;
      const developmentText = `${t(development)} `;

      const industryWords = industryText.split(' ');
      const professionWords = professionText.split(' ');

// Slice the first two words from each and combine
      const title = industryWords.slice(0, 2).concat(professionWords.slice(0, 2)).join(' ');

      newPrompt = newPrompt
        .replace('[industry]', industryText)
        .replace('[profession]', professionText)
        .replace('[experience]', experienceText)
        .replace('[development]', developmentText);

      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [industry, profession, experience, development]);








    return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.industry)}
          name="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          multiline // Enables multiline input
          rows={1} // Sets the number of rows
        />

        <TextField
          fullWidth
          label={t(tokens.form.profession)}
          name="profession"
         value={profession}
          onChange={(e) => setProfession(e.target.value)}
          multiline // Enables multiline input
          rows={1} // Sets the number of rows
        />


        <TextField
          fullWidth
          label={t(tokens.form.experience)}
          name="experience"
          select
          SelectProps={{ native: true }}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          {experienceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <TextField
          fullWidth
          label={t(tokens.form.development)}
          name="development"
          select
          SelectProps={{ native: true }}
          value={development}
          onChange={(e) => setDevelopment(e.target.value)}
        >
          {developmentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>



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
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourCareerDevelopment)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
            </Button>
            <Paper elevation={3} ref={textRef}
                   style={{padding: '10px', overflow: 'auto', lineHeight: '1.5'}}>
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
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.careerDev))}
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
