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
import useGPT4Submit from './gpt4-submit';
import {useProtectedPage} from "../../../hooks/use-protectedpage";

type Option = {
    label: string;
    value: string;
};

const branchOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Metaphysics, value: tokens.form.Metaphysics },
  { label: tokens.form.Epistemology, value: tokens.form.Epistemology },
  { label: tokens.form.Ethics, value: tokens.form.Ethics },
  { label: tokens.form.Aesthetics, value: tokens.form.Aesthetics },
  { label: tokens.form.Logic, value: tokens.form.Logic },
  { label: tokens.form.PoliticalPhilosophy, value: tokens.form.PoliticalPhilosophy },
  { label: tokens.form.PhilosophyOfMind, value: tokens.form.PhilosophyOfMind },
  { label: tokens.form.PhilosophyOfScience, value: tokens.form.PhilosophyOfScience },
  { label: tokens.form.PhilosophyOfLanguage, value: tokens.form.PhilosophyOfLanguage },
  { label: tokens.form.PhilosophyOfReligion, value: tokens.form.PhilosophyOfReligion },
  { label: tokens.form.Existentialism, value: tokens.form.Existentialism },
  { label: tokens.form.Phenomenology, value: tokens.form.Phenomenology },
  { label: tokens.form.Stoicism, value: tokens.form.Stoicism },
  { label: tokens.form.Utilitarianism, value: tokens.form.Utilitarianism },
  { label: tokens.form.Marxism, value: tokens.form.Marxism },
  { label: tokens.form.AnalyticPhilosophy, value: tokens.form.AnalyticPhilosophy },
];


const traditionOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Stoicism, value: tokens.form.Stoicism },
  { label: tokens.form.Existentialism, value: tokens.form.Existentialism },
  { label: tokens.form.Utilitarianism, value: tokens.form.Utilitarianism },
  { label: tokens.form.Buddhism, value: tokens.form.Buddhism },
  { label: tokens.form.Platonism, value: tokens.form.Platonism },
  { label: tokens.form.Aristotelianism, value: tokens.form.Aristotelianism },
  { label: tokens.form.Confucianism, value: tokens.form.Confucianism },
  { label: tokens.form.Taoism, value: tokens.form.Taoism },
  { label: tokens.form.Humanism, value: tokens.form.Humanism },
  { label: tokens.form.Rationalism, value: tokens.form.Rationalism },
  { label: tokens.form.Empiricism, value: tokens.form.Empiricism },
  { label: tokens.form.Nihilism, value: tokens.form.Nihilism },
  { label: tokens.form.Feminism, value: tokens.form.Feminism },
  { label: tokens.form.Anarchism, value: tokens.form.Anarchism },
    // ... add more as needed
];

const themeOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.MeaningOfLife, value: tokens.form.MeaningOfLife },
  { label: tokens.form.HumanNature, value: tokens.form.HumanNature },
  { label: tokens.form.KnowledgeAndTruth, value: tokens.form.KnowledgeAndTruth },
  { label: tokens.form.EthicsAndMorality, value: tokens.form.EthicsAndMorality },
  { label: tokens.form.FreeWillAndDeterminism, value: tokens.form.FreeWillAndDeterminism },
  { label: tokens.form.MindAndConsciousness, value: tokens.form.MindAndConsciousness },
  { label: tokens.form.LanguageAndCommunication, value: tokens.form.LanguageAndCommunication },
  { label: tokens.form.ScienceAndTechnology, value: tokens.form.ScienceAndTechnology },
  { label: tokens.form.ArtAndAesthetics, value: tokens.form.ArtAndAesthetics },
  { label: tokens.form.PoliticsAndSociety, value: tokens.form.PoliticsAndSociety },
  { label: tokens.form.ReligionAndSpirituality, value: tokens.form.ReligionAndSpirituality },
  { label: tokens.form.EducationAndLearning, value: tokens.form.EducationAndLearning },
    // ... add more as needed
];




export const PhilosophyWriter: FC = () => {
  useProtectedPage();

  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [branch, setBranch] = useState<string>('');
  const [tradition, setTradition] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [words, setWords] = useState<number>(100);
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
    if (branch && tradition && theme && words) {
      let newPrompt = t(tokens.form.writePhilosophy);

      const branchText = branch !== '' ? `${t(branch)} ` : '';
      const traditionText = tradition !== '' ? `${t(tradition)}  ` : '';
      const themeText = theme !== '' ? `${t(theme)} ` : '';
      const wordsText = `${words} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[branch]', branchText)
        .replace('[tradition]', traditionText)
        .replace('[theme]', themeText)
        .replace('[words]', wordsText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [branch, tradition, theme, words, t]);


  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    // If newValue is an array, you can decide how to handle it.
    // For a single thumb slider, it should be just a number.
    if (typeof newValue === 'number') {
      setWords(newValue); // Directly set the new value
    }
  };

// Corrected maxTokens calculation
  const maxTokens = words * 4; // 1 word is approx. 4 tokens









  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.branch)}
          name="branch"
          select
          SelectProps={{ native: true }}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          {branchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.tradition)}
          name="tradition"
          select
          SelectProps={{ native: true }}
          value={tradition}
          onChange={(e) => setTradition(e.target.value)}
        >
          {traditionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.theme)}
          name="theme"
          select
          SelectProps={{ native: true }}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.wordCount)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider
            value={words} // Convert the word count to the slider's scale

            min={100}
            max={1000}
            step={100} // The slider's step
            marks // This adds marks at each step
            onChange={handleSliderChange} //slider change determines amount of tokens used
            sx={{ width: '95%' }}
          />
        </div>


      </Stack>
        <Box sx={{ mt: 3 }}>
          {/* Button to submit the prompt to OpenAI */}
          <Button
            onClick={submitToOpenAI}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}  // Disable the button while loading
              >
                  {isLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
          </Box>

        {openAIResponse && (
          <Box sx={{ mt: 3 }}>
            <label>{t(tokens.form.yourLyrics)}</label>
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

