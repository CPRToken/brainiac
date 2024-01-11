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


const propertyTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.house, value: tokens.form.house },
  { label: tokens.form.condo, value: tokens.form.condo },
  { label: tokens.form.apartment, value: tokens.form.apartment },
  { label: tokens.form.townhouse, value: tokens.form.townhouse },


  // ... continue for other countries
];



const colorThemeOptions: Option[] = [
    { label: '', value: '' },




  // ... continue for other countries
];


const styleOptions: Option[] = [
  { label: '', value: '' },

  { label: tokens.form.industrialChic, value: tokens.form.industrialChic },
    { label: tokens.form.elegant, value: tokens.form.elegant },
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

  { label: tokens.form.modernChic, value: tokens.form.modernChic },
  { label: tokens.form.skiResort, value: tokens.form.skiResort },
  { label: tokens.form.cyberpunk, value: tokens.form.cyberpunk },
  { label: tokens.form.steampunk, value: tokens.form.steampunk },
  { label: tokens.form.romantic, value: tokens.form.romantic },
  { label: tokens.form.nautical, value: tokens.form.nautical },


  // ... add more as needed
];


const roomOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.livingRoom, value: tokens.form.livingRoom },
    { label: tokens.form.kitchen, value: tokens.form.kitchen },
    { label: tokens.form.bedroom, value: tokens.form.bedroom },
    { label: tokens.form.bathroom, value: tokens.form.bathroom },
    { label: tokens.form.diningRoom, value: tokens.form.diningRoom },
    { label: tokens.form.studyRoom, value: tokens.form.studyRoom },
    { label: tokens.form.guestRoom, value: tokens.form.guestRoom },
    { label: tokens.form.kidsRoom, value: tokens.form.kidsRoom },
    { label: tokens.form.masterBedroom, value: tokens.form.masterBedroom },
    { label: tokens.form.balcony, value: tokens.form.balcony },
    { label: tokens.form.patio, value: tokens.form.patio },
    { label: tokens.form.homeOffice, value: tokens.form.homeOffice },
    { label: tokens.form.gameRoom, value: tokens.form.gameRoom },
    { label: tokens.form.homeTheater, value: tokens.form.homeTheater },
    { label: tokens.form.library, value: tokens.form.library },
    { label: tokens.form.garage, value: tokens.form.garage },
    { label: tokens.form.laundryRoom, value: tokens.form.laundryRoom },
    { label: tokens.form.foyer, value: tokens.form.foyer },
    { label: tokens.form.attic, value: tokens.form.attic },
    { label: tokens.form.basement, value: tokens.form.basement },
    { label: tokens.form.sunroom, value: tokens.form.sunroom },

];

    // ... add more as needed



const numberImagesOptions: Option[] = [
    { label: '', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },



];



export const InteriorDesigner: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [propertyType, setPropertyType] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [colorTheme, setColorTheme] = useState<string>('');
    const [room , setRoom] = useState<string>('');
  const [numberImages, setNumberImages] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();



    const maxTokens = 1000; // Set the max tokens for the prompt here
    const submitToOpenAI = () => {

        if (prompt) {
            // Submit the prompt that is updated by the useEffect hook
            combinedSubmit(prompt, maxTokens)
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
    if (propertyType && style && colorTheme && room && numberImages !== null) {
      let newPrompt = t(tokens.form.createInteriorDesign);

      // Replace placeholders with translated values
      newPrompt = newPrompt.replace('[propertyType]', t(propertyType.replace(/\s/g, ''))); // Assuming 'birthday Party' should be 'birthdayParty'
      newPrompt = newPrompt.replace('[style]', t(style.replace(/\s/g, ''))); // Assuming 'smart casual' should be 'smartcasual'
      newPrompt = newPrompt.replace('[colorTheme]', t(colorTheme.replace(/\s/g, ''))); // Assuming 'smart casual' should be 'smartcasual'
      newPrompt = newPrompt.replace('[room]', t(room.replace(/\s/g, ''))); // Assuming 'smart casual' should be 'smartcasual'
      newPrompt = newPrompt.replace('[numberImages]', t(numberImages.replace(/\s/g, ''))); // Assuming 'smart casual' should be 'smartcasual'
      setPrompt(newPrompt);
    } else {
      setPrompt('');
    }
  }, [propertyType, style, room,  colorTheme, numberImages, t]);








    return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={2}>
          <Typography variant="body2">
              {t(tokens.form.magicMirror)}
          </Typography>
          <TextField
            fullWidth
            label={t(tokens.form.propertyType)}
            name="propertyType"
            select
            SelectProps={{ native: true }}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            {propertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.colorTheme)}
            value={colorTheme}
            name="colorTheme"
            onChange={(e) => setColorTheme(e.target.value)}
            multiline
            rows={1}
            sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
            {colorThemeOptions.map((option) => (
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

                label={t(tokens.form.room)}
                name="room"
                select
                SelectProps={{ native: true }}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                fullWidth
                sx={{ width: 'calc(50% - 8px)' }}
            >
                {roomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {t(option.label)} {/* Apply translation here */}
                    </option>
                ))}
            </TextField>
            <TextField
                label={t(tokens.form.numberImages)}
                name="numberImages"
                select
                SelectProps={{ native: true }}
                value={style}
                onChange={(e) => setNumberImages(e.target.value)}
                fullWidth
                sx={{ width: 'calc(50% - 8px)' }}
            >
                {numberImagesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {t(option.label)} {/* Apply translation here */}
                    </option>
                ))}
            </TextField>
        </Stack>





            <Box sx={{ mt: 6, pt: 2 }}>
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


      <Box sx={{ mt: 3 }}>
        {textResponse && (
          <Box sx={{ mt: 3 }}>
            <label>{t(tokens.headings.yourDesign)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon />
            </Button>
            <Paper elevation={3} ref={textRef} style={{ padding: '30px', height: '100%', overflow: 'auto', lineHeight: '1.5' }}>
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
              <img key={index} src={image} alt={`GennumberImagested Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  </Box>
);
}
