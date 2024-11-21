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
import {useProtectedPage} from "../../../hooks/use-protectedpage";
import {saveDoc} from "../buttons/saveDoc";

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

const inOrOutOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.indoors, value: tokens.form.outdoors },
  { label: tokens.form.outdoors, value: tokens.form.outdoors },



  // ... add more as needed
];

const blueOrWhiteOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.blueCollar, value: tokens.form.blueCollar },
  { label: tokens.form.whiteCollar, value: tokens.form.whiteCollar },



  // ... add more as needed
];




const experienceOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.lessThanYear, value: tokens.form.lessThanYear },
  { label: tokens.form.Between1N3, value: tokens.form.Between1N3 },
  { label: tokens.form.Between3N5, value: tokens.form.Between3N5 },
  { label: tokens.form.Between5N10, value: tokens.form.Between5N10 },
  { label: tokens.form.moreThan10, value: tokens.form.moreThan10 },
    // ... add more as needed
];



export const StartABusiness: FC = () => {
  useProtectedPage();


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [industry, setIndustry] = useState<string>('');
  const [hasBusinessIdea, setHasBusinessIdea] = useState('');
  const [typeofBusiness, setTypeofBusiness] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const[targetMarket, setTargetMarket] = useState<string>('');
  const [inOrOut, setInOrOut] = useState<string>('');
  const [blueOrWhite, setBlueOrWhite] = useState<string>('');
  const [workExperience, setWorkExperience] = useState<string>('');
  const [budget, setBudget]= useState<string>('');
  const [title, setTitle] = useState<string>('');
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

  useEffect(() => {

    if (industry && skills && budget) {

    let newPrompt = t(tokens.form.startABusinessPrompts);

    const industryText = industry ? `${t(industry)} ` : '';
    const inOrOutText = inOrOut ? `${t(inOrOut)} ` : '';
    const blueOrWhiteText = blueOrWhite ? `${t(blueOrWhite)} ` : '';
    const skillsText = skills ? `${t(skills)} ` : '';
    const targetMarketText = targetMarket ? `${t(targetMarket)} ` : '';
    const interestsText = interests ? `${t(interests)} ` : '';
    const workExperienceText = workExperience ? `${t(workExperience)} ` : '';
    const budgetText = budget ? `${t(budget)} ` : '';
    const typeofBusinessText = typeofBusiness ? `${t(typeofBusiness)} ` : '';

    const industryWords = industryText.split(' ').filter(word => word.length > 0);
      const skillsWords = skillsText.split(' ').filter(word => word.length > 0);
      const budgetWords = budgetText.split(' ').filter(word => word.length > 0);

    const title = [...industryWords.slice(0, 1),...skillsWords.slice(0, 1),...budgetWords.slice(0, 1)].join(' ');


    newPrompt = newPrompt
        .replace('[industry]', industryText)
        .replace('[inOrOut]', inOrOutText)
        .replace('[blueOrWhite]', blueOrWhiteText)
        .replace('[skills]', skillsText)
        .replace('[targetMarket]', targetMarketText)
        .replace('[interests]', interestsText)
        .replace('[experience]', workExperienceText)
        .replace('[budget]', budgetText)
        .replace('[typeofBusiness]', typeofBusinessText);

    setPrompt(newPrompt.trim());
    setTitle(title);
  } else {
    setPrompt('');
    setTitle('');
  }
  }, [industry, inOrOut, blueOrWhite, skills, targetMarket, interests, workExperience, budget, typeofBusiness, t]);





  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

        <Stack spacing={3}>

          <Typography variant="body2" sx={{ pb: 4 }}>
            {t(tokens.form.startBusinessTip)}
          </Typography>



          {/* Industry selection - always shown */}
          <TextField
              fullWidth
              label={t(tokens.form.industry)}
              name="industry"
              select
              SelectProps={{ native: true }}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
          >
            {industryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
            ))}
          </TextField>

          {/* Radio buttons for business idea */}
          <FormControl component="fieldset">
            <FormLabel component="legend">{t(tokens.form.haveBusinessIdea)}</FormLabel>
            <RadioGroup
                row
                aria-label="hasBusinessIdea"
                name="hasBusinessIdea"
                value={hasBusinessIdea}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHasBusinessIdea(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {/* TextField for 'typeofBusiness' appears when 'yes' is selected */}
          {hasBusinessIdea === 'yes' && (
              <>
          <TextField
              fullWidth
              label={t(tokens.form.typeofBusiness)}
              name="typeofBusiness"
              value={typeofBusiness}
              onChange={(e) => setTypeofBusiness(e.target.value)}
              multiline
              rows={2}
          />

            <TextField
            fullWidth
            label={t(tokens.form.fieldExperience)}
          name="workExperience"
          value={workExperience}
          onChange={(e) => setWorkExperience(e.target.value)}
          multiline
          rows={1}
        />
                <TextField
                    fullWidth
                    label={t(tokens.form.skills)}
                    name="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    multiline // Enables multiline input
                    rows={1} // Sets the number of rows
                />
                <TextField
                    fullWidth
                    label={t(tokens.form.targetMarket)}
                    name="targetMarket"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    multiline // Enables multiline input
                    rows={1} // Sets the number of rows
                />

                <TextField
                    fullWidth
                    label={t(tokens.form.budget)}
                    name="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    multiline
                    rows={1}
                />
              </>

          )}

          {/* Conditional fields based on radio button selection */}
          {hasBusinessIdea === 'no' && (
              <>






                <Stack direction="row" spacing={2}>
                  <TextField
                      label={t(tokens.form.inOrOut)}
                      name="inOrOut"
                      select
                      SelectProps={{ native: true }}
                      value={inOrOut}
                      onChange={(e) => setInOrOut(e.target.value)}
                      fullWidth
                      sx={{ width: 'calc(50% - 8px)' }}
                  >
                    {inOrOutOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(option.label)}
                        </option>
                    ))}
                  </TextField>

                  <TextField
                      label={t(tokens.form.blueOrWhite)}
                      name="blueOrWhite"
                      select
                      SelectProps={{ native: true }}
                      value={blueOrWhite}
                      onChange={(e) => setBlueOrWhite(e.target.value)}
                      fullWidth
                      sx={{ width: 'calc(50% - 8px)' }}
                  >
                    {blueOrWhiteOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(option.label)}
                        </option>
                    ))}
                  </TextField>
                </Stack>

                <TextField
                    fullWidth
                    label={t(tokens.form.skills)}
                    name="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    multiline // Enables multiline input
                    rows={1} // Sets the number of rows
                />

                <TextField
                    fullWidth
                    label={t(tokens.form.interests)}
                    name="interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    multiline
                    rows={1}
                />

                <TextField
                    fullWidth
                    label={t(tokens.form.budget)}
                    name="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    multiline
                    rows={1}
                />
              </>
          )}
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
              <label>{t(tokens.form.yourBusinessPlan)}</label>
              <Button onClick={handleCopyText} title="Copy response text">
                <FileCopyIcon />
              </Button>
          <Paper elevation={3} ref={textRef}
                 style={{padding: '30px', overflow: 'auto', lineHeight: '1.5'}}>
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
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.BusinessPlans))}
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


