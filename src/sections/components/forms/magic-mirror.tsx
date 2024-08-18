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
import {saveTextImage } from "../buttons/saveTextImage";
import {useProtectedPage} from "../../../hooks/use-protectedpage";


type Option = {
  label: string;
  value: string;
};





const occasionOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Wedding, value: tokens.form.Wedding },
  { label: tokens.form.BirthdayParty, value: tokens.form.BirthdayParty },
  { label: tokens.form.DinnerDate, value: tokens.form.DinnerDate },
  { label: tokens.form.JobInterview, value: tokens.form.JobInterview },
  { label: tokens.form.GraduationCeremony, value: tokens.form.GraduationCeremony },
  { label: tokens.form.BusinessMeeting, value: tokens.form.BusinessMeeting },
  { label: tokens.form.Concert, value: tokens.form.Concert },
  { label: tokens.form.Theater, value: tokens.form.Theater },
  { label: tokens.form.CocktailParty, value: tokens.form.CocktailParty },
  { label: tokens.form.Gala, value: tokens.form.Gala },
  { label: tokens.form.Clubbing, value: tokens.form.Clubbing },
  { label: tokens.form.CasualHangout, value: tokens.form.CasualHangout },
  { label: tokens.form.Brunch, value: tokens.form.Brunch },
  { label: tokens.form.SportingEvent, value: tokens.form.SportingEvent },
  { label: tokens.form.FamilyGathering, value: tokens.form.FamilyGathering },
  { label: tokens.form.MovieNight, value: tokens.form.MovieNight },
  { label: tokens.form.BeachDay, value: tokens.form.BeachDay },
  { label: tokens.form.Hiking, value: tokens.form.Hiking },
  { label: tokens.form.RoadTrip, value: tokens.form.RoadTrip },
  { label: tokens.form.Camping, value: tokens.form.Camping },
  { label: tokens.form.BookClub, value: tokens.form.BookClub },
  { label: tokens.form.ArtExhibition, value: tokens.form.ArtExhibition },
  { label: tokens.form.CharityEvent, value: tokens.form.CharityEvent },
  { label: tokens.form.FashionShow, value: tokens.form.FashionShow },
  { label: tokens.form.Vacation, value: tokens.form.Vacation },
  { label: tokens.form.Workout, value: tokens.form.Workout },
  { label: tokens.form.Shopping, value: tokens.form.Shopping },
  { label: tokens.form.CookingClass, value: tokens.form.CookingClass },
  { label: tokens.form.DanceClass, value: tokens.form.DanceClass },
  { label: tokens.form.PhotographyTour, value: tokens.form.PhotographyTour },
  { label: tokens.form.WineTasting, value: tokens.form.WineTasting },


  // ... continue for other countries
];


const styleOptions: Option[] = [
  { label: '', value: '' },

  { label: tokens.form.smartCasual, value: tokens.form.smartCasual },
  { label: tokens.form.doucheBag, value: tokens.form.doucheBag },
  { label: tokens.form.streetwear, value: tokens.form.streetwear },
  { label: tokens.form.businessFormal, value: tokens.form.businessFormal },
  { label: tokens.form.cocktailAttire, value: tokens.form.cocktailAttire },
  { label: tokens.form.bohemian, value: tokens.form.bohemian },
  { label: tokens.form.grunge, value: tokens.form.grunge },
  { label: tokens.form.preppy, value: tokens.form.preppy },
  { label: tokens.form.athleisure, value: tokens.form.athleisure },
  { label: tokens.form.punk, value: tokens.form.punk },
  { label: tokens.form.vintage, value: tokens.form.vintage },
  { label: tokens.form.minimalist, value: tokens.form.minimalist },
  { label: tokens.form.gothic, value: tokens.form.gothic },
  { label: tokens.form.hipHop, value: tokens.form.hipHop },
  { label: tokens.form.casual, value: tokens.form.casual },
  { label: tokens.form.formal, value: tokens.form.formal },
  { label: tokens.form.avantGarde, value: tokens.form.avantGarde },
  { label: tokens.form.military, value: tokens.form.military },
  { label: tokens.form.sporty, value: tokens.form.sporty },
  { label: tokens.form.eclectic, value: tokens.form.eclectic },
  { label: tokens.form.beachwear, value: tokens.form.beachwear },
  { label: tokens.form.rock, value: tokens.form.rock },
  { label: tokens.form.cowboy, value: tokens.form.cowboy },
  { label: tokens.form.festival, value: tokens.form.festival },
  { label: tokens.form.safari, value: tokens.form.safari },
  { label: tokens.form.eveningWear, value: tokens.form.eveningWear },
  { label: tokens.form.retromodern, value: tokens.form.retromodern },
  { label: tokens.form.countryside, value: tokens.form.countryside },
  { label: tokens.form.maternity, value: tokens.form.maternity },
  { label: tokens.form.modernChic, value: tokens.form.modernChic },
  { label: tokens.form.skiResort, value: tokens.form.skiResort },
  { label: tokens.form.cyberpunk, value: tokens.form.cyberpunk },
  { label: tokens.form.steampunk, value: tokens.form.steampunk },
  { label: tokens.form.romantic, value: tokens.form.romantic },
  { label: tokens.form.nautical, value: tokens.form.nautical },


  // ... add more as needed
];


const genderOptions: Option[] = [
  { label: '', value: '' },
    { label: tokens.form.male, value: tokens.form.male },
    { label: tokens.form.female, value: tokens.form.female },


  // ... add more
];


const ageOptions: Option[] = [
  { label: '', value: '' },


  // ... add more
];





export const MagicMirror: FC = () => {
  useProtectedPage();


  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [occasion, setOccasion] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [era, setEra] = useState<number>(2);
 const [title, setTitle] = useState<string>('');
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

      const occasionText = ` ${t(occasion)} `;
      const styleText = ` ${t(style)} `;
   const genderText  = ` ${t(gender)} `;
    const ageText = ` ${age} `;
    const eraText = ` ${t(eraLevels[era])} `;

      const occasionWords = occasionText.split(' ');
      const styleWords = styleText.split(' ');

      const title = occasionWords.slice(0, 2).concat(styleWords.slice(0, 2)).join(' ');

      newPrompt = newPrompt
        .replace('{occasion}', occasionText)
        .replace('{style}', styleText)
        .replace('{gender}', genderText)
        .replace('{age}', ageText)
        .replace('{era}', eraText);


      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [occasion, style, gender, age, era, t]);






    return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>

        <Typography variant="body2">
          {t(tokens.form.magicMirror)}
        </Typography>
        <Stack  spacing={3}>
          <TextField
            label={t(tokens.form.occasion)}
            name="ocassion"
            select
            SelectProps={{ native: true }}
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            fullWidth

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

          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack  spacing={3}>
          <TextField
            label={t(tokens.form.gender)}
            name="gender"
            select
            SelectProps={{ native: true }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth

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

          >
            {ageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
              <label>{t(tokens.form.era)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
                  sx={{ width: '95%' }}
              />
          </div>



      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button
          onClick={() => combinedSubmit(prompt, 1500)}
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
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourOutFit)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
            </Button>
            <Paper elevation={3} ref={textRef}
                   style={{padding: '30px', height: '100%', overflow: 'auto', lineHeight: '1.5'}}>
              {textResponse.split('\n').map((str, index, array) => (
                <React.Fragment key={index}>
                  {str}
                  {index < array.length - 1 && <br/>}
                </React.Fragment>
              ))}
            </Paper>
          </Box>
        )}

        {/* Display the images */}
        {images && (
          <Box sx={{ mt: 3 }}>
            {images.map((image, index) => (
              <Box key={index} sx={{mt: 2}}>
                <img src={image} alt={`Generated Art ${index + 1}`}
                     style={{width: '100%', marginBottom: '10px'}}/>

                <div style={{textAlign: 'center', paddingTop: '20px'}}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (textResponse !== null) { // Ensure textResponse is not null
                        saveTextImage(textResponse, title, t(tokens.form.attire), image)
                          .then(() => {
                            console.log("Text and image saved successfully.");
                          })
                          .catch((error) => {
                            console.error("Failed to save text and image:", error);
                          });
                      } else {
                        console.log("textResponse is null.");
                      }
                    }}
                    style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
                  >
                    {t(tokens.form.savePost)}
                  </Button>
                </div>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
    );
}

