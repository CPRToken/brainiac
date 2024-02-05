import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';



import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';
import Typography from "@mui/material/Typography";

type Option = {
    label: string;
    value: string;
};

const industryOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.retail, value: tokens.form.retail },
    { label: tokens.form.hospitality, value: tokens.form.hospitality },
    { label: tokens.form.fashion, value: tokens.form.fashion },
    { label: tokens.form.services, value: tokens.form.services }, // Services like beauty or cleaning
    { label: tokens.form.technology, value: tokens.form.technology },
    { label: tokens.form.manufacturing, value: tokens.form.manufacturing },
    { label: tokens.form.agriculture, value: tokens.form.agriculture },
    { label: tokens.form.healthcare, value: tokens.form.healthcare },
    { label: tokens.form.construction, value: tokens.form.construction },
    { label: tokens.form.educationIndustry, value: tokens.form.educationIndustry },
    { label: tokens.form.finance, value: tokens.form.finance },


    // ... add more as needed
];

const riskToleranceOptions: Option[] = [
  { label: '', value: '' },
    { label: tokens.form.lessThan5Percent, value: tokens.form.lessThan5Percent },
    { label: tokens.form.between5And10Percent, value: tokens.form.between5And10Percent },
    { label: tokens.form.between10And20Percent, value: tokens.form.between10And20Percent },
    { label: tokens.form.moreThan20Percent, value: tokens.form.moreThan20Percent },



  // ... add more as needed
];





    // ... add more as needed


const timeOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.lessThanYear, value: tokens.form.lessThanYear },
    { label: tokens.form.Between1N3, value: tokens.form.Between1N3 },
    { label: tokens.form.Between3N5, value: tokens.form.Between3N5 },
    { label: tokens.form.Between5N10, value: tokens.form.Between5N10 },
    { label: tokens.form.moreThan10, value: tokens.form.moreThan10 },
    // ... add more as needed
];






export const WhatJob: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [talentArea, setTalentArea] = useState('');
  const [visualArts, setVisualArts] = useState('');
  const [visualArtsTimes, setVisualArtsTimes] = useState('');
  const [music, setMusic] = useState('');
  const [musicTimes, setMusicTimes] = useState('');


  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();







  const submitToOpenAI = () => {
    const maxTokens = 2000;
    if (prompt) {
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



  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>

        <Typography variant="body2" sx={{ pb: 4 }}>
          {t(tokens.form.investmentAdviceTip)}
        </Typography>



        {/* Radio buttons for business idea */}

        <FormControl component="fieldset">
          <FormLabel component="legend">
            Place a check mark beside the areas in which you feel you have more talent, ability, or training than the average person.
          </FormLabel>
          <RadioGroup
            aria-label="talentArea"
            name="talentArea"
            value={talentArea}
            onChange={(e) => setTalentArea(e.target.value)}
          >
            <FormControlLabel value="visualArts" control={<Radio />} label="Visual Arts (painting, sculpture)" />
            <FormControlLabel value="music" control={<Radio />} label="Music" />
            <FormControlLabel value="dance" control={<Radio />} label="Dance" />
            <FormControlLabel value="individualSports" control={<Radio />} label="Individual Sports (tennis, golf)" />
            <FormControlLabel value="teamSports" control={<Radio />} label="Team Sports" />
            <FormControlLabel value="architecturalDesign" control={<Radio />} label="Architectural Design" />
            <FormControlLabel value="entrepreneurialVentures" control={<Radio />} label="Entrepreneurial Ventures" />
            <FormControlLabel value="creativeWriting" control={<Radio />} label="Creative Writing" />
            <FormControlLabel value="humor" control={<Radio />} label="Humor" />
            <FormControlLabel value="inventions" control={<Radio />} label="Inventions" />
            <FormControlLabel value="scientificInquiry" control={<Radio />} label="Scientific Inquiry" />
            <FormControlLabel value="theaterAndFilm" control={<Radio />} label="Theater and Film" />
            <FormControlLabel value="culinaryArts" control={<Radio />} label="Culinary Arts" />
          </RadioGroup>
        </FormControl>




        {/* TextField for 'riskTolerance' appears when 'yes' is selected */}
        {talentArea === 'visualArts' && (
          <FormControl component="fieldset">
            <FormLabel component="legend">Visual Arts (painting, sculpture)</FormLabel>
            <RadioGroup
              aria-label="visualArts"
              name="visualArts"
              value={visualArts}
              onChange={(e) => setVisualArts(e.target.value)}
            >
              <FormControlLabel value="0" control={<Radio />} label="0. I have no training or recognized talent in this area. (Skip to Music)." />
              <FormControlLabel value="1" control={<Radio />} label="1. I have taken lessons in this area." />
              <FormControlLabel value="2" control={<Radio />} label="2. People have commented on my talent in this area." />
              <FormControlLabel value="3" control={<Radio />} label="3. I have won a prize or prizes at a juried art show." />
              <FormControlLabel value="4" control={<Radio />} label="4. I have had a showing of my work in a gallery." />
              <FormControlLabel value="5" control={<Radio />} label="5. I have sold a piece of my work." />
              <FormControlLabel value="6" control={<Radio />} label="6. My work has been critiqued in local publications." />
              <FormControlLabel value="7" control={<Radio />} label="7. My work has been critiqued in national publications." />
            </RadioGroup>
            {visualArts === 'talentArea' && (
              <TextField
                label="Number of times this applies"
                name="visualArtsTimes"
                value={visualArtsTimes}
                onChange={(e) => setVisualArtsTimes(e.target.value)}
              />
            )}
          </FormControl>
        )}

        {/* Music Section */}
        {talentArea === 'music' && (
          <FormControl component="fieldset">
            <FormLabel component="legend">Music</FormLabel>
            <RadioGroup
              aria-label="music"
              name="music"
              value={music}
              onChange={(e) => setMusic(e.target.value)}
            >
              <FormControlLabel value="0" control={<Radio />} label="0. I have no training or recognized talent in this area. (Skip to Dance)." />
              {/* Add all options similarly */}
            </RadioGroup>
            {music === '7' && (
              <TextField
                label="Number of times this applies"
                name="musicTimes"
                value={musicTimes}
                onChange={(e) => setMusicTimes(e.target.value)}
              />
            )}
          </FormControl>
        )}

      </Stack>

        {/* Submit button */}
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
                <label>{t(tokens.form.yourInvestmentPlan)}</label>
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
}
