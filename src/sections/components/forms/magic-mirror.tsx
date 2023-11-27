import type { FC } from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import ResponseText from '../clipboards/response-text';
import {useTranslation} from "react-i18next";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { tokens } from "../../../locales/tokens";
import CircularProgress from '@mui/material/CircularProgress';
import TextImageSubmit from "./textimage-submit";
import React from 'react';
import Typography from "@mui/material/Typography";

type Option = {
  label: string;
  value: string;
};





const occasionOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.Wedding, value: 'wedding' },
    { label: tokens.form.BirthdayParty, value: 'birthday Party' },
    { label: tokens.form.DinnerDate, value: 'Dinner Date' },
    { label: tokens.form.JobInterview, value: 'Job Interview' },
    { label: tokens.form.GraduationCeremony, value: 'Graduation-Ceremony' },
    { label: tokens.form.BusinessMeeting, value: 'business Meeting' },
    { label: tokens.form.Concert, value: 'concert' },
    { label: tokens.form.Theater, value: 'theater' },
    { label: tokens.form.CocktailParty, value: 'cocktail Party' },
    { label: tokens.form.Gala, value: 'gala' },
    { label: tokens.form.Clubbing, value: 'clubbing' },
    { label: tokens.form.CasualHangout, value: 'casual Hangout' },
    { label: tokens.form.Brunch, value: 'brunch' },
    { label: tokens.form.SportingEvent, value: 'sporting Event' },
    { label: tokens.form.FamilyGathering, value: 'family Gathering' },
    { label: tokens.form.MovieNight, value: 'movie Night' },
    { label: tokens.form.BeachDay, value: 'beach Day' },
    { label: tokens.form.Hiking, value: 'hiking' },
    { label: tokens.form.RoadTrip, value: 'road trip' },
    { label: tokens.form.Camping, value: 'camping' },
    { label: tokens.form.BookClub, value: 'bookClub' },
    { label: tokens.form.ArtExhibition, value: 'art Exhibition' },
    { label: tokens.form.CharityEvent, value: 'charity Event' },
    { label: tokens.form.FashionShow, value: 'fashion Show' },
    { label: tokens.form.Vacation, value: 'vacation' },
    { label: tokens.form.Workout, value: 'workout' },
    { label: tokens.form.Shopping, value: 'shopping' },
    { label: tokens.form.CookingClass, value: 'cooking Class' },
    { label: tokens.form.DanceClass, value: 'dance Class' },
    { label: tokens.form.PhotographyTour, value: 'photography Tour' },
    { label: tokens.form.WineTasting, value: 'wine Tasting' },

  // ... continue for other countries
];


const styleOptions: Option[] = [
  { label: '', value: '' },

  { label: tokens.form.smartCasual, value: 'smart casual' },
    { label: tokens.form.doucheBag, value: 'douche bag' },
        { label: tokens.form.streetwear, value: 'streetwear' },
        { label: tokens.form.businessFormal, value: 'business formal' },
        { label: tokens.form.cocktailAttire, value: 'cocktail attire' },
        { label: tokens.form.bohemian, value: 'bohemian' },
        { label: tokens.form.grunge, value: 'grunge' },
        { label: tokens.form.preppy, value: 'preppy' },
        { label: tokens.form.athleisure, value: 'athleisure' },
        { label: tokens.form.punk, value: 'punk' },
        { label: tokens.form.vintage, value: 'vintage' },
        { label: tokens.form.minimalist, value: 'minimalist' },
        { label: tokens.form.gothic, value: 'gothic' },
        { label: tokens.form.hipHop, value: 'hip hop' },
        { label: tokens.form.casual, value: 'casual' },
        { label: tokens.form.formal, value: 'formal' },
        { label: tokens.form.avantGarde, value: 'avant-garde' },
        { label: tokens.form.military, value: 'military' },
        { label: tokens.form.sporty, value: 'sporty' },
        { label: tokens.form.eclectic, value: 'eclectic' },
        { label: tokens.form.beachwear, value: 'beachwear' },
        { label: tokens.form.rock, value: 'rock' },
        { label: tokens.form.cowboy, value: 'cowboy' },
        { label: tokens.form.festival, value: 'festival' },
        { label: tokens.form.safari, value: 'safari' },
        { label: tokens.form.eveningWear, value: 'evening wear' },
        { label: tokens.form.retromodern, value: 'retro-modern' },
        { label: tokens.form.countryside, value: 'countryside' },
        { label: tokens.form.maternity, value: 'maternity' },
        { label: tokens.form.modernChic, value: 'modern chic' },
        { label: tokens.form.skiResort, value: 'ski resort' },
        { label: tokens.form.cyberpunk, value: 'cyberpunk' },
        { label: tokens.form.steampunk, value: 'steampunk' },
        { label: tokens.form.romantic, value: 'romantic' },
        { label: tokens.form.nautical, value: 'nautical' },

    // ... add more as needed
];


const genderOptions: Option[] = [
  { label: '', value: '' },
    { label: tokens.form.male, value: 'male' },
    { label: tokens.form.female, value: 'female' },


  // ... add more
];


const ageOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Olive', value: 'Olive' },

  // ... add more
];





export const MagicMirror: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [occasion, setOccasion] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [era, setEra] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();


    type EraLevels = {
        [key: number]: string;
    };

    const eraLevels: EraLevels = {
        0: '80s',
        1: '90s',
        2: '2000s',
        3: '2010s',
        4: '2020s',
    };

  useEffect(() => {
    if (occasion && style && gender && age && era !== null) {
      let newPrompt = t(tokens.form.createFashion);

      // Replace placeholders with translated values
      newPrompt = newPrompt.replace('[occasion]', t(occasion.replace(/\s/g, ''))); // Assuming 'birthday Party' should be 'birthdayParty'
      newPrompt = newPrompt.replace('[style]', t(style.replace(/\s/g, ''))); // Assuming 'smart casual' should be 'smartcasual'
      newPrompt = newPrompt.replace('[gender]', t(gender));
      newPrompt = newPrompt.replace('[age]', age); // 'age' is just a number and doesn't require translation
      newPrompt = newPrompt.replace('[era]', t(eraLevels[era].replace(/\s/g, ''))); // Assuming '2000s' should match a key in the translations

      setPrompt(newPrompt);
    } else {
      setPrompt('');
    }
  }, [occasion, style, gender, age, era, t]);






    return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>

        <Typography variant="body2">
          {t(tokens.form.magicMirror)}
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.occasion)}
            name="artist"
            select
            SelectProps={{ native: true }}
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {occasionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.style)}
            name="style"
            select
            SelectProps={{ native: true }}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.gender)}
            name="gender"
            select
            SelectProps={{ native: true }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
              {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {t(option.label)} {/* Apply translation here */}
                  </option>
              ))}
          </TextField>
          <TextField
             label={t(tokens.form.age)}
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
             multiline
             rows={1}
             sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
            {ageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

          <div>
              <label>{t(tokens.form.era)}</label>
              <Slider
                  value={era}
                  min={0}
                  max={4}
                  step={1}
                  marks={[
                      { value: 0, label: '80s' },
                      { value: 1, label: '90s' },
                      { value: 2, label: '2000s' },
                      { value: 3, label: '2010s' },
                      { value: 4, label: '2020s' }
                  ]}
                  onChange={(_, newValue) => setEra(newValue as number)}
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
          onClick={() => combinedSubmit(prompt, 700)}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}  // Disable the button while loading
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {textResponse && (
          <Box sx={{ mt: 3 }}>
            <label>{t(tokens.headings.yourDesign)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon />
            </Button>
            <Paper elevation={3} ref={textRef} style={{ padding: '10px', height: '100%', overflow: 'auto', lineHeight: '1.5' }}>
              {textResponse.split('\n').map((str, index, array) => (
                <React.Fragment key={index}>
                  {str}
                  {index < array.length - 1 && <br />}
                </React.Fragment>
              ))}
            </Paper>
          </Box>
        )}

        {/* Display the images */}
        {images && (
          <Box sx={{ mt: 3 }}>
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Generated Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

