import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useHandleSubmit from './handle-submit';


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



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [branch, setBranch] = useState<string>('');
  const [tradition, setTradition] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [duration, setDuration] = useState<number>(100);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  useEffect(() => {
    if (branch && tradition && theme && duration) {
      let newPrompt = t(tokens.form.writePhilosophy);

      const branchText = branch !== '' ? `${t(branch)} ` : '';
      const traditionText = tradition !== '' ? `${t(tradition)}  ` : '';
      const themeText = theme !== '' ? `${t(theme)} ` : '';
      const durationText = `${duration} ${t('')}`;

      // Replace placeholders with the actual values
      newPrompt = newPrompt
        .replace('[branch]', branchText)
        .replace('[tradition]', traditionText)
        .replace('[theme]', themeText)
        .replace('[duration]', durationText);

      // Remove any trailing commas and spaces
      newPrompt = newPrompt.replace(/,+\s*$/, '');

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [branch, tradition, theme, duration, t]);











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
        <div>
          <label>{t(tokens.form.wordCount)}</label>

          <Slider
            value={duration / 100} // Convert the word count to the slider's scale
            getAriaValueText={(value) => `${value * 100} words`} // For accessibility
            valueLabelDisplay="on" // This enables the value label
            valueLabelFormat={(value) => `${value * 100}`} // This formats the label to show the word count
            min={1}
            max={4}
            step={0.5} // The slider's step
            marks // This adds marks at each step
            onChange={(_, newValue) => setDuration(newValue as number * 100)} // Convert back to words on change
          />
        </div>
          <TextField
              fullWidth
              label={t(tokens.form.prompts)}
              name="prompt"
              value={prompt}
              multiline
              rows={4}
          />


      </Stack>
          <Box sx={{ mt: 3 }}>
              <Button
                  onClick={() => handleSubmit(prompt, 800)}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}  // Disable the button while loading
              >
                  {isLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
          </Box>

        <Box sx={{ mt: 3 }}>
          {openAIResponse && (
            <>
              <label>Your Philosophy:</label>
              <Button onClick={handleCopyText} title="Copy response text">
                <FileCopyIcon />
              </Button>
            </>
          )}

          <Paper elevation={3} ref={textRef} style={{ padding: '10px', height: '100%', overflow: 'auto', lineHeight: '1.5' }}>
            {openAIResponse && openAIResponse.split('\n').map((str, index, array) =>
              index === array.length - 1 ? str : <>
                {str}
                <br />
              </>
            )}
          </Paper>
        </Box>


      </Box>

);
};

