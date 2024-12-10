import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGrokSubmit from './grok-submit';
import Typography from "@mui/material/Typography";
import {saveDoc} from "../buttons/saveDoc";
import {useProtectedPage} from "../../../hooks/use-protectedpage";

type Option = {
    label: string;
    value: string;
};

const industryOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.retail, value: tokens.form.retail },
    { label: tokens.form.hospitality, value: tokens.form.hospitality },
  { label: tokens.form.realEstate, value: tokens.form.realEstate },
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


const investmentExperienceOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.none, value: tokens.form.none },
  { label: tokens.form.lessThanYear, value: tokens.form.lessThanYear },
  { label: tokens.form.Between1N3, value: tokens.form.Between1N3 },
  { label: tokens.form.Between3N5, value: tokens.form.Between3N5 },
  { label: tokens.form.Between5N10, value: tokens.form.Between5N10 },
  { label: tokens.form.moreThan10, value: tokens.form.moreThan10 },
    // ... add more as needed
];



export const InvestmentAdvisor: FC = () => {
  useProtectedPage();


  const { handleSubmit, grokResponse, isLoading } = useGrokSubmit();

  const [hasInvestmentGoals, setHasInvestmentGoals] = useState('');
  const [investmentGoals, setInvestmentGoals] = useState('');
  const [title, setTitle] = useState<string>('');
  const [industryExperience, setIndustryExperience] = useState('');
    const [industry, setIndustry] = useState<string>('');
    const [why, setWhy] = useState<string>('');
    const [time, setTime] = useState<string>('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [investmentExperience, setInvestmentExperience] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [budget, setBudget]= useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {
    const maxTokens = 3000;
    if (prompt) {
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
    if (hasInvestmentGoals === 'yes' && investmentGoals && industry && industryExperience && investmentExperience && annualIncome && time && riskTolerance && budget) {
    let newPrompt = t(tokens.form.investmentAdvicePrompts);

    const investmentGoalsText = investmentGoals ? `${t(investmentGoals)} ` : '';
    const whyText = why ? `${t(why)} ` : '';
    const industryText = industry ? `${t(industry)} ` : '';
    const industryExperienceText = industryExperience ? `${t(industryExperience)} ` : '';
    const investmentExperienceText = investmentExperience ? `${t(investmentExperience)} ` : '';
    const annualIncomeText = annualIncome ? `${t(annualIncome)} ` : '';
    const timeText = time ? `${t(time)} ` : '';
    const budgetText = budget ? `${t(budget)} ` : '';
    const riskToleranceText = riskTolerance ? `${t(riskTolerance)} ` : '';



    const goalsWords = investmentGoalsText.split(' ');
    const title = goalsWords.slice(0, 3).join(' ');


    newPrompt = newPrompt
      .replace('[investmentGoals]', investmentGoalsText)
        .replace('[why]', whyText)
      .replace('[industry]', industryText)
      .replace('[industryExperience]', industryExperienceText)
      .replace('[investmentGoals]', investmentGoalsText)
      .replace('[investmentExperience]', investmentExperienceText)
      .replace('[annualIncome]', annualIncomeText)
      .replace('[time]', timeText)
      .replace('[budget]', budgetText)
      .replace('[riskTolerance]', riskToleranceText);

    setPrompt(newPrompt.trim());
    setTitle(title);
  } else{
    // If not all selections are made, keep the prompt empty
    setPrompt('');
    setTitle('');
  }
  }, [investmentGoals, why,  industry, industryExperience,  investmentGoals, time, annualIncome, riskTolerance, budget, t]);



  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>

        <Typography variant="body2" sx={{ pb: 4 }}>
          {t(tokens.form.investmentAdviceTip)}
        </Typography>



        {/* InvestmentGoal selection - always shown */}







        {/* Radio buttons for business idea */}
          <FormControl component="fieldset">
              <FormLabel component="legend">{t(tokens.form.hasInvestmentGoals)}</FormLabel>
              <RadioGroup
                  row
                  aria-label="hasInvestmentGoals"
                  name="hasInvestmentGoals"
                  value={hasInvestmentGoals}
                  onChange={(e) => setHasInvestmentGoals(e.target.value)}
              >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
          </FormControl>


        {/* TextField for 'riskTolerance' appears when 'yes' is selected */}
        {hasInvestmentGoals === 'yes' && (
          <>

              <TextField

                  label={t(tokens.form.investmentGoals)}
                  name="investmentGoals"

                  value={investmentGoals}
                  onChange={(e) => setInvestmentGoals(e.target.value)}
                  multiline
                  rows={2}
              />
              <TextField
                  fullWidth

                  label={t(tokens.form.investmentExperience)}
                  name="investmentExperience"
                  select
                  SelectProps={{ native: true }}
                  value={investmentExperience}
                  onChange={(e) => setInvestmentExperience(e.target.value)}
              >
                  {investmentExperienceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)}
                      </option>
                  ))}
              </TextField>
              <TextField
                  fullWidth

                  label={t(tokens.form.desiredIndustry)}
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
              <TextField
                  fullWidth
                  label={t(tokens.form.fieldExperience)}
                  name="industryExperience"
                  value={industryExperience}
                  onChange={(e) => setIndustryExperience(e.target.value)}
                  multiline
                  rows={1}
              />

              <TextField
                  fullWidth

                  label={t(tokens.form.timeFrame)}
                  name="time"
                  select
                  SelectProps={{ native: true }}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
              >
                  {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)}
                      </option>
                  ))}
              </TextField>



              <TextField
                  label={t(tokens.form.riskTolerance)}
                  name="riskTolerance"
                  select
                  SelectProps={{ native: true }}
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  fullWidth

              >
                  {riskToleranceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)}
                      </option>
                  ))}
              </TextField>




              <Stack direction="row" spacing={2}>
                  <TextField
                      fullWidth
                      label={t(tokens.form.annualIncome)}
                      name="annualIncome"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      multiline
                      rows={1}
                      sx={{ width: 'calc(50% - 8px)' }}
                  />

                  <TextField
                      label={t(tokens.form.budget)}
                      name="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      multiline
                      rows={1}
                      sx={{ width: 'calc(50% - 8px)' }}
                  />
              </Stack>
          </>

        )}

        {/* Conditional fields based on radio button selection */}
          {hasInvestmentGoals === 'no' && (
              <>
                  <TextField
                      fullWidth
                      label={t(tokens.form.whyInvest)}
                      name="why"
                      value={why}
                      onChange={(e) => setWhy(e.target.value)}
                      multiline
                      rows={1}
                  />
                  <TextField
                      fullWidth

                      label={t(tokens.form.investmentExperience)}
                      name="investmentExperience"
                      select
                      SelectProps={{ native: true }}
                      value={investmentExperience}
                      onChange={(e) => setInvestmentExperience(e.target.value)}
                  >
                      {investmentExperienceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                              {t(option.label)}
                          </option>
                      ))}
                  </TextField>
                  <TextField
                      fullWidth

                      label={t(tokens.form.desiredIndustry)}
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
                  <TextField
                      fullWidth
                      label={t(tokens.form.fieldExperience)}
                      name="industryExperience"
                      value={industryExperience}
                      onChange={(e) => setIndustryExperience(e.target.value)}
                      multiline
                      rows={1}
                  />

                  <TextField
                      fullWidth

                      label={t(tokens.form.timeFrame)}
                      name="time"
                      select
                      SelectProps={{ native: true }}
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                  >
                      {timeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                              {t(option.label)}
                          </option>
                      ))}
                  </TextField>


                  <TextField
                      fullWidth
                      label={t(tokens.form.investmentGoals)}
                      name="investmentGoals"
                      value={investmentGoals}
                      onChange={(e) => setInvestmentGoals(e.target.value)}
                      multiline // Enables multiline input
                      rows={1} // Sets the number of rows
                  />

                  <TextField
                      label={t(tokens.form.riskTolerance)}
                      name="riskTolerance"
                      select
                      SelectProps={{ native: true }}
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(e.target.value)}
                      fullWidth

                  >
                      {riskToleranceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                              {t(option.label)}
                          </option>
                      ))}
                  </TextField>




                  <Stack direction="row" spacing={2}>
                      <TextField
                          fullWidth
                          label={t(tokens.form.annualIncome)}
                          name="annualIncome"
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(e.target.value)}
                          multiline
                          rows={1}
                          sx={{ width: 'calc(50% - 8px)' }}
                      />

                      <TextField
                          label={t(tokens.form.budget)}
                          name="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          multiline
                          rows={1}
                          sx={{ width: 'calc(50% - 8px)' }}
                      />
                  </Stack>
              </>
          )}

          {/* Fields always visible: 'riskTolerance' and 'budget' */}

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

        {grokResponse && (
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourInvestmentPlan)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
            </Button>
            <Paper elevation={3} ref={textRef}
                   style={{padding: '30px', overflow: 'auto', lineHeight: '1.5'}}>
              {grokResponse.split('\n').map((str, index, array) => (
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
                onClick={() => saveDoc(grokResponse, title, t(tokens.form.investments))}
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
