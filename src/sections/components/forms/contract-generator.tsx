import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Button, Paper, MenuItem } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import useGPT4Submit from './gpt4-submit';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from "@mui/material/CircularProgress";
import {saveDoc} from "../buttons/saveDoc";
import {useProtectedPage} from "../../../hooks/use-protectedpage";

interface Option {
  label: string;
  value: string;
}

const countryOptions: Option[] = [
  { label: '', value: '' },

  { label: tokens.form.USA, value: tokens.form.USA },
  { label: tokens.form.UK, value: tokens.form.UK },
  { label: tokens.form.UK, value: tokens.form.UK },
  { label: tokens.form.Australia, value: tokens.form.Australia },
  { label: tokens.form.Canada, value: tokens.form.Canada },
  { label: tokens.form.Germany, value: tokens.form.Germany },
  { label: tokens.form.France, value: tokens.form.France },
  { label: tokens.form.thailand, value: tokens.form.thailand },

  { label: tokens.form.India, value: tokens.form.India }
];

const contractTypes: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.employmentContract, value: tokens.form.employmentContract },
  { label: tokens.form.serviceAgreement, value: tokens.form.serviceAgreement },
  { label: tokens.form.salesAgreement, value: tokens.form.salesAgreement },
  { label: tokens.form.rentalContract, value: tokens.form.rentalContract },
  { label: tokens.form.NDA, value: tokens.form.NDA }
];

const languageOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.English, value: tokens.form.English },
  { label: tokens.form.Spanish, value: tokens.form.Spanish },
  { label: tokens.form.French, value: tokens.form.French },
  { label: tokens.form.German, value: tokens.form.German },
  { label: tokens.form.Italian, value: tokens.form.Italian },
  { label: tokens.form.Portuguese, value: tokens.form.Portuguese },
  { label: tokens.form.Thai, value: tokens.form.Thai },
  { label: tokens.form.Japanese, value: tokens.form.Japanese }
];



export const ContractGenerator: FC = () => {
  useProtectedPage();


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [title, setTitle] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');
  const [language, setLanguage] = useState<string>('');

  const [parties, setParties] = useState<string>('');
  const [terms, setTerms] = useState<string>('');
  const [ref , setRef] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  const submitToOpenAI = () => {
    const maxTokens = 4096;
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
    if (title && country && contractType && language && parties && terms) {
      let newPrompt = t(tokens.form.genContractPrompts);

      const titleText  = title !== '' ? `${t(title)} ` : '';
      const countryText = country !== '' ? `${t(country)} ` : '';
      const contractTypeText = contractType !== '' ? `${t(contractType)} ` : '';
      const languageText = language !== '' ? `${t(language)} ` : '';
      const partiesText = parties !== '' ? `Parties involved: ${parties} ` : '';
      const termsText = terms !== '' ? `Terms: ${terms} ` : '';
      // Replace placeholders with the actual values

      newPrompt = newPrompt
        .replace('[title]', titleText)
        .replace('[country]', countryText)
        .replace('[contractType]', contractTypeText)
        .replace('[language]', languageText)
        .replace('[parties]', partiesText)
        .replace('[terms]', termsText);


      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [title, country, contractType, language, parties, terms, t]);


  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        {/* Country */}
        <TextField

          fullWidth
          label={t(tokens.form.country)}
          name="country"
           select
          SelectProps={{ native: true }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <TextField
          fullWidth
          label={t(tokens.form.contractType)}
          name="contractType"
          select
          SelectProps={{ native: true }}
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
        >
          {contractTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </TextField>

        {/* Primary Language */}
        <TextField
          fullWidth
          label={t(tokens.form.language)}
          name="language"
          select
          SelectProps={{ native: true }}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </TextField>

        {/* Secondary Language */}

        {/* Parties */}
        <TextField
          fullWidth
          label={t(tokens.form.partiesInvolved)}
          name="parties"
          multiline
          rows={2}
          value={parties}
          onChange={(e) => setParties(e.target.value)}
        />

        {/* Terms */}
        <TextField
          fullWidth
          label={t(tokens.form.terms)}
          name="terms"
          multiline
          rows={4}
        >
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
          <label>{t(tokens.form.yourEssay)}</label>
          <Button onClick={handleCopyText} title="Copy response text">
            <FileCopyIcon/>
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
              onClick={() => saveDoc(openAIResponse, title, t(tokens.form.contracts))}
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

