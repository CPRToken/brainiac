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

const nicheOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Health', value: 'health' },
  { label: 'AI', value: 'artificial intelligence' },
  { label: 'Technology', value: 'technology' },
  { label: 'Finance', value: 'finance' },
  { label: 'Travel', value: 'travel' },
  { label: 'Education', value: 'education' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Food', value: 'food' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Home and Garden', value: 'home-and-garden' },
  { label: 'Business', value: 'business' },
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Health', value: 'health' },
  { label: 'Technology', value: 'technology' },
  { label: 'Finance', value: 'finance' },
  { label: 'Travel', value: 'travel' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Food', value: 'food' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Home and Garden', value: 'home-and-garden' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Science', value: 'science' },
  { label: 'Art and Culture', value: 'art-and-culture' },
  { label: 'Music', value: 'music' },
  { label: 'Pets', value: 'pets' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Travel Tips', value: 'travel-tips' },
  { label: 'Tech Gadgets', value: 'tech-gadgets' },
  { label: 'Home Improvement', value: 'home-improvement' },
  { label: 'Cooking', value: 'cooking' },
  { label: 'Parenting', value: 'parenting' },
  { label: 'Photography', value: 'photography' },
  { label: 'DIY Projects', value: 'diy-projects' },
  { label: 'Movies', value: 'movies' },
  { label: 'Books', value: 'books' },
  { label: 'Outdoor Activities', value: 'outdoor-activities' },
  { label: 'Green Living', value: 'green-living' }


  // ... add more as needed
];

const purposeOptions: Option[] = [
  { label: '', value: '' },
  { label: 'On-page SEO', value: 'on-page-seo' },
  { label: 'Link Building', value: 'link-building' },
  { label: 'Technical SEO', value: 'technical-seo' },
  { label: 'Local SEO', value: 'local-seo' },
  { label: 'Content Marketing', value: 'content-marketing' },
  { label: 'Keyword Research', value: 'keyword-research' },
  { label: 'Social Media Marketing', value: 'social-media-marketing' },
  { label: 'Email Marketing', value: 'email-marketing' },
  { label: 'Video Marketing', value: 'video-marketing' },
  { label: 'Conversion Rate Optimization', value: 'conversion-rate-optimization' },
  { label: 'E-commerce SEO', value: 'e-commerce-seo' },
  { label: 'Mobile SEO', value: 'mobile-seo' },
  { label: 'Analytics and Reporting', value: 'analytics-and-reporting' },
  { label: 'Voice Search Optimization', value: 'voice-search-optimization' },
  { label: 'Affiliate Marketing', value: 'affiliate-marketing' },
  { label: 'Blogging', value: 'blogging' },
  { label: 'User Experience (UX)', value: 'user-experience-ux' },
  { label: 'Web Design', value: 'web-design' },
  { label: 'AI and SEO', value: 'ai-and-seo' },
  { label: 'Local Business Marketing', value: 'local-business-marketing' },
  { label: 'Online Advertising', value: 'online-advertising' },
  { label: 'Content Strategy', value: 'content-strategy' },
  { label: 'Influencer Marketing', value: 'influencer-marketing' },
  { label: 'Brand Building', value: 'brand-building' },
  { label: 'PPC Advertising', value: 'ppc-advertising' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Customer Relationship Management (CRM)', value: 'crm' },
  // ... add more as needed
];

const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Informative', value: 'informative' },
  { label: 'Engaging', value: 'engaging' },
  { label: 'Persuasive', value: 'persuasive' },
  { label: 'Educational', value: 'educational' },
  { label: 'Entertaining', value: 'entertaining' },
  { label: 'Inspirational', value: 'inspirational' },
  { label: 'Technical', value: 'technical' },
  { label: 'Storytelling', value: 'storytelling' },
  { label: 'Conversational', value: 'conversational' },
  { label: 'Formal', value: 'formal' },
  { label: 'Casual', value: 'casual' },
  { label: 'Humorous', value: 'humorous' },
  { label: 'Professional', value: 'professional' },
  { label: 'Opinionated', value: 'opinionated' },
  { label: 'Sensational', value: 'sensational' },
  { label: 'Thought-provoking', value: 'thought-provoking' },
  // ... add more as needed
];




export const SEOArticleWriter: FC = () => {

  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [niche, setNiche] = useState<string>('');  // changed from genre
  const [purpose, setPurpose] = useState<string>('');  // changed from style
  const [style, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(500);
  const [prompt, setPrompt] = useState<string>('');

  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();

  const maxTokensForResume = 1500;

  const submitToOpenAI = () => {
    // Construct a prompt that OpenAI can use to generate an article
    const  newPrompt = t(tokens.form.SEOWriter);
    setPrompt(newPrompt); // Update the prompt state
    handleSubmit(newPrompt, maxTokensForResume)
      .then(() => {
        // Handle successful submission if needed
      })
      .catch(error => {
        console.error("Error submitting to OpenAI:", error);
      });
  };





  useEffect(() => {
    if (niche && purpose && style && duration) {
      let  newPrompt = t(tokens.form.SEOWriter, {

        duration: `${duration} mins`,
        niche: t(niche),
        purpose: t(purpose),
        style: t(style),
      });


      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [niche, purpose, style, duration, t]);



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
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.for)}
          name="for"
          select
          SelectProps={{ native: true }}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          {purposeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>{t(tokens.form.wordCount)}</label>
          <Slider
            value={duration / 500} // Convert the word count to the slider's scale
            min={1}
            max={4}
            step={0.5} // The slider's step
            onChange={(_, newValue) => setDuration(newValue as number * 500)} // Convert back to words on change
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
          <Box sx={{ mt: 3 }}>
              <label>{t(tokens.form.yourSEOArticle)}</label>
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
