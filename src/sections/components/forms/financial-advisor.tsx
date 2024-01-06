import type { FC } from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Paper from '@mui/material/Paper';
import ResponseText from '../clipboards/response-text';
import {useTranslation} from "react-i18next";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { tokens } from "../../../locales/tokens";
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';
import React from 'react';

type Option = {
  label: string;
  value: string;
};



const shortGoalsOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];

const longGoalsOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];

const incomeOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];

const expensesOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];


const assetsOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];


const liabilitiesOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];




const maritalStatusOptions: Option[] = [
    { label: '', value: '' },


    // ... add more
];

const dependentsOptions: Option[] = [


];

export const FinancialAdvisor: FC = () => {



    const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [shortGoals, setShortGoals] = useState<string>('');
  const [longGoals, setLongGoals] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [liabilities, setLiabilities] = useState<string>('');
  const [assets, setAssets] = useState<string>('');
 const [maritalStatus , setMaritalStatus] = useState<string>('');
  const [dependents , setDependents] = useState<string>('');

  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();




    const maxTokens = 3000;

    const submitToOpenAI = () => {
        if (prompt) {
            handleSubmit(prompt, maxTokens)
                .then(() => {
                    // Handle successful submission if needed
                })
                .catch(error => {
                    console.error("Error submitting to OpenAI:", error);
                });
        }
    };
    useEffect(() => {
        // Constructing the new prompt with dynamic values
        let newPrompt = t(tokens.form.createFinancialPlan)
            .replace('[shortGoals]', shortGoals)
            .replace('[longGoals]', longGoals)
            .replace('[income]', income)
            .replace('[expenses]', expenses)
            .replace('[assets]', assets)
            .replace('[liabilities]', liabilities)
            .replace('[maritalStatus]', maritalStatus)
            .replace('[dependents]', dependents);

        // Only update the prompt if all fields have values
        if (shortGoals || longGoals || income || expenses || liabilities || assets || maritalStatus || dependents) {
            setPrompt(newPrompt.trim());
        } else {
            setPrompt('');
        }
    }, [shortGoals, longGoals, income, expenses, liabilities, assets, maritalStatus, dependents, t, tokens.form.createFinancialPlan]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.shortGoals)}
            name="shortGoals"
            value={shortGoals}
            onChange={(e) => setShortGoals(e.target.value)}
            multiline
            rows={2}
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {shortGoalsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.longGoals)}
            name="longGoals"
            value={longGoals}
            onChange={(e) => setLongGoals(e.target.value)}
            multiline
            rows={2}
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {longGoalsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.monthlyIncome)}
            name="income"
             value={income}
            onChange={(e) => setIncome(e.target.value)}
            multiline
            rows={2}
            sx={{ width: 'calc(50% - 8px)' }}
          >
              {incomeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {t(option.label)} {/* Apply translation here */}
                  </option>
              ))}
          </TextField>
          <TextField
             label={t(tokens.form.listExpenses)}
            name="expenses"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
             multiline
             rows={2}
             sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
            {expensesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>
          <Stack direction="row" spacing={2}>
              <TextField
                  label={t(tokens.form.listAssets)}
                  name="assets"
                  value={assets}
                  onChange={(e) => setAssets(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ width: 'calc(50% - 8px)' }}
              >
                  {assetsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)} {/* Apply translation here */}
                      </option>
                  ))}
              </TextField>
              <TextField
                  label={t(tokens.form.listLiabilities)}
                  name="liabilities"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
              >
                  {liabilitiesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)} {/* Apply translation here */}
                      </option>
                  ))}
              </TextField>
          </Stack>
          <Stack direction="row" spacing={2}>
              <TextField
                  label={t(tokens.form.maritalStatus)}
                  name="maritalStatus"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  multiline
                  rows={1}
                  sx={{ width: 'calc(50% - 8px)' }}
              >
                  {maritalStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)} {/* Apply translation here */}
                      </option>
                  ))}
              </TextField>
              <TextField
                  label={t(tokens.form.anyDependents)}
                  name="dependents"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  multiline
                  rows={1}
                  sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
              >
                  {dependentsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)} {/* Apply translation here */}
                      </option>
                  ))}
              </TextField>
          </Stack>




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
                <label>{t(tokens.form.yourFinancialPlan)}</label>
                <Button onClick={handleCopyText} title="Copy response text">
                    <FileCopyIcon />
                </Button>
                <Paper elevation={3} ref={textRef} style={{ padding: '10px', overflow: 'auto', lineHeight: '1.5' }}>
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
