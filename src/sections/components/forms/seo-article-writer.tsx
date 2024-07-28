import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { tokens } from 'src/locales/tokens';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {CustomSlider} from "../slider/slider";
import Paper from '@mui/material/Paper';

import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useGPT4Submit from './gpt4-submit';
import {saveDoc} from "../buttons/saveDoc";
import {useProtectedPage} from "../../../hooks/use-protectedpage";

type Option = {
    label: string;
    value: string;
};

const nicheOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.health, value: tokens.form.health },
  { label: tokens.form.artificialIntelligence, value: tokens.form.artificialIntelligence },
  { label: tokens.form.technology, value: tokens.form.technology },
  { label: tokens.form.finance, value: tokens.form.finance },
  { label: tokens.form.travel, value: tokens.form.travel },
  { label: tokens.form.education, value: tokens.form.education },
  { label: tokens.form.fashion, value: tokens.form.fashion },
  { label: tokens.form.food, value: tokens.form.food },
  { label: tokens.form.sports, value: tokens.form.sports },
  { label: tokens.form.entertainment, value: tokens.form.entertainment },
  { label: tokens.form.homeAndGarden, value: tokens.form.homeAndGarden },
  { label: tokens.form.business, value: tokens.form.business },
  { label: tokens.form.lifestyle, value: tokens.form.lifestyle },
  { label: tokens.form.gaming, value: tokens.form.gaming },
  { label: tokens.form.science, value: tokens.form.science },
  { label: tokens.form.artAndCulture, value: tokens.form.artAndCulture },
  { label: tokens.form.music, value: tokens.form.music },
  { label: tokens.form.pets, value: tokens.form.pets },
  { label: tokens.form.fitness, value: tokens.form.fitness },
  { label: tokens.form.automotive, value: tokens.form.automotive },
  { label: tokens.form.travelTips, value: tokens.form.travelTips },
  { label: tokens.form.techGadgets, value: tokens.form.techGadgets },
  { label: tokens.form.homeImprovement, value: tokens.form.homeImprovement },
  { label: tokens.form.cooking, value: tokens.form.cooking },
  { label: tokens.form.parenting, value: tokens.form.parenting },
  { label: tokens.form.photography, value: tokens.form.photography },
  { label: tokens.form.diyProjects, value: tokens.form.diyProjects },
  { label: tokens.form.movies, value: tokens.form.movies },
  { label: tokens.form.books, value: tokens.form.books },
  { label: tokens.form.outdoorActivities, value: tokens.form.outdoorActivities },
  { label: tokens.form.greenLiving, value: tokens.form.greenLiving },



  // ... add more as needed
];

const purposeOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.onPageSeo, value: tokens.form.onPageSeo },
  { label: tokens.form.linkBuilding, value: tokens.form.linkBuilding },
  { label: tokens.form.technicalSeo, value: tokens.form.technicalSeo },
  { label: tokens.form.localSeo, value: tokens.form.localSeo },
  { label: tokens.form.contentMarketing, value: tokens.form.contentMarketing },
  { label: tokens.form.keywordResearch, value: tokens.form.keywordResearch },
  { label: tokens.form.socialMediaMarketing, value: tokens.form.socialMediaMarketing },
  { label: tokens.form.emailMarketing, value: tokens.form.emailMarketing },
  { label: tokens.form.videoMarketing, value: tokens.form.videoMarketing },
  { label: tokens.form.conversionRateOptimization, value: tokens.form.conversionRateOptimization },
  { label: tokens.form.ecommerceSeo, value: tokens.form.ecommerceSeo },
  { label: tokens.form.mobileSeo, value: tokens.form.mobileSeo },
  { label: tokens.form.analyticsAndReporting, value: tokens.form.analyticsAndReporting },
  { label: tokens.form.voiceSearchOptimization, value: tokens.form.voiceSearchOptimization },
  { label: tokens.form.affiliateMarketing, value: tokens.form.affiliateMarketing },
  { label: tokens.form.blogging, value: tokens.form.blogging },
  { label: tokens.form.userExperienceUx, value: tokens.form.userExperienceUx },
  { label: tokens.form.webDesign, value: tokens.form.webDesign },
  { label: tokens.form.aiAndSeo, value: tokens.form.aiAndSeo },
  { label: tokens.form.localBusinessMarketing, value: tokens.form.localBusinessMarketing },
  { label: tokens.form.onlineAdvertising, value: tokens.form.onlineAdvertising },
  { label: tokens.form.contentStrategy, value: tokens.form.contentStrategy },
  { label: tokens.form.influencerMarketing, value: tokens.form.influencerMarketing },
  { label: tokens.form.brandBuilding, value: tokens.form.brandBuilding },
  { label: tokens.form.ppcAdvertising, value: tokens.form.ppcAdvertising },
  { label: tokens.form.webDevelopment, value: tokens.form.webDevelopment },
  { label: tokens.form.customerRelationshipManagementCrm, value: tokens.form.customerRelationshipManagementCrm },

  // ... add more as needed
];

const styleOptions: Option[] = [
  { label: '', value: '' },
    { label: tokens.form.informative, value: tokens.form.informative },
    { label: tokens.form.engaging, value: tokens.form.engaging },
    { label: tokens.form.persuasive, value: tokens.form.persuasive },
    { label: tokens.form.educational, value: tokens.form.educational },
    { label: tokens.form.entertaining, value: tokens.form.entertaining },
    { label: tokens.form.inspirational, value: tokens.form.inspirational },
    { label: tokens.form.technical, value: tokens.form.technical },
    { label: tokens.form.storytelling, value: tokens.form.storytelling },
    { label: tokens.form.conversational, value: tokens.form.conversational },
    { label: tokens.form.formal, value: tokens.form.formal },
    { label: tokens.form.casual, value: tokens.form.casual },
    { label: tokens.form.humorous, value: tokens.form.humorous },
    { label: tokens.form.professional, value: tokens.form.professional },
    { label: tokens.form.opinionated, value: tokens.form.opinionated },
    { label: tokens.form.sensational, value: tokens.form.sensational },
    { label: tokens.form.thoughtProvoking, value: tokens.form.thoughtProvoking },

    // ... add more as needed
];

const keyWordsOptions: Option[] = [
  { label: '', value: '' },



  // ... add more as needed
];


export const SEOArticleWriter: FC = () => {
  useProtectedPage();

  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [niche, setNiche] = useState<string>('');  // changed from genre
  const [purpose, setPurpose] = useState<string>('');  // changed from style
  const [style, setMood] = useState<string>('');
  const [keyWords, setKeyWords] = useState<string>('');
const [ title , setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(500);
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
    if (niche && purpose && style && keyWords && duration) {
      let newPrompt = t(tokens.form.SEOWriter);


      const nicheText = niche !== '' ? `${t(niche)} ` : '';
      const purposeText = purpose !== '' ? `${t(purpose)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const keyWordsText = keyWords !== '' ? `${t(keyWords)} ` : '';
      const durationText = `${duration} ${t('')}`;


      const keyWors = keyWordsText.split(' ');
      const title = keyWors.slice(0, 3).join(' ');

      newPrompt = newPrompt
        .replace('[niche]', nicheText)
        .replace('[purpose]', purposeText)
        .replace('[style]', styleText)
        .replace('[keyWords]', keyWordsText)
        .replace('[duration]', `${durationText}`);

      newPrompt = newPrompt.replace(/,+\s*$/, '');


      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      // If not all selections are made, keep the prompt empty
      setPrompt('');
      setTitle('');
    }


  }, [niche, purpose, style, keyWords, duration, t]);




  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    // If newValue is an array, you can decide how to handle it.
    // For a single thumb slider, it should be just a number.
    if (typeof newValue === 'number') {
      setDuration(newValue); // Directly set the new value
    }
  };

// Corrected maxTokens calculation
  const maxTokens = duration * 4; // 1 word is approx. 4 tokens


  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.niche)}
          name="niche"
          select
          SelectProps={{ native: true }}
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        >
          {nicheOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.for)}
          name="purpose"
          select
          SelectProps={{ native: true }}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          {purposeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.style)}
          name="style"
          select
          SelectProps={{ native: true }}
          value={style}
          onChange={(e) => setMood(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <TextField
          fullWidth
          label={t(tokens.form.keyWords)}
          name="keywords"
          value={keyWords}
          onChange={(e) => setKeyWords(e.target.value)}
          multiline
          rows={1}
        >
          {keyWordsOptions.map((option) => (
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
            value={duration}
            min={500}
            max={2000}
            step={100} // The slider's step
            onChange={handleSliderChange}
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
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourSEOArticle)}</label>
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
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.SEOarticle))}
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
