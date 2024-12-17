import type { FC } from 'react';
import React, {useEffect, useState} from 'react';
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
import TextImageSubmit from "./textimage-submit";
import {saveTextImage } from "../buttons/saveTextImage";


import Typography from "@mui/material/Typography";
import {useProtectedPage} from "../../../hooks/use-protectedpage";

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
];






const styleOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.modern, value: tokens.form.modern },
  { label: tokens.form.industrialChic, value: tokens.form.industrialChic },
    { label: tokens.form.elegant, value: tokens.form.elegant },
    { label: tokens.form.bohemian, value: tokens.form.bohemian },
  { label: tokens.form.grunge, value: tokens.form.grunge },

  { label: tokens.form.vintage, value: tokens.form.vintage },
  { label: tokens.form.minimalist, value: tokens.form.minimalist },
  { label: tokens.form.gothic, value: tokens.form.gothic },

  { label: tokens.form.casual, value: tokens.form.casual },
  { label: tokens.form.formal, value: tokens.form.formal },
  { label: tokens.form.avantGarde, value: tokens.form.avantGarde },
  { label: tokens.form.military, value: tokens.form.military },
  { label: tokens.form.sporty, value: tokens.form.sporty },

  { label: tokens.form.cowboy, value: tokens.form.cowboy },

  { label: tokens.form.safari, value: tokens.form.safari },

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








export const InteriorDesigner: FC = () => {
  useProtectedPage();


    const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [propertyType, setPropertyType] = useState<string>('');
    const [room , setRoom] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [colorTheme, setColorTheme] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();









    useEffect(() => {
    if (propertyType && room && colorTheme && style  !== null) {

      let newPrompt = t(tokens.form.createInteriorDesign);


      const propertyTypeText = ` ${t(propertyType)} `;
      const roomText = ` ${t(room)} `;
      const colorThemeText = ` ${t(colorTheme)} `;
      const styleText = ` ${t(style)} `;


      const propertyTypeWords = propertyTypeText.split(' ');
      const colorThemeWords = colorThemeText.split(' ');

      const title = propertyTypeWords.slice(0, 2).concat(colorThemeWords.slice(0, 2)).join(' ');


      newPrompt = newPrompt
      .replace('[propertyType]', propertyTypeText)
      .replace('[room]', roomText)
      .replace('[colorTheme]', colorThemeText)
      .replace('[style]', styleText);



      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [propertyType, room, colorTheme, style, t ]);





    return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
        <Stack spacing={3}>

            <Typography variant="body2">
                {t(tokens.form.interiorDesignerTip)}
            </Typography>



          <Stack spacing={3}>
          <TextField
           label={t(tokens.form.propertyType)}
            name="propertyType"
            select
            SelectProps={{ native: true }}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            fullWidth

          >
            {propertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
              <TextField
                  label={t(tokens.form.room)}
                  name="room"
                  select
                  SelectProps={{ native: true }}
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  fullWidth

              >
                  {roomOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {t(option.label)} {/* Apply translation here */}
                      </option>
                  ))}
              </TextField>
          </Stack>


          <TextField
            label={t(tokens.form.colorTheme)}
            value={colorTheme}
            name="colorTheme"
            onChange={(e) => setColorTheme(e.target.value)}
            multiline
            rows={1}

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

          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
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
                        <Box key={index}
                             sx={{marginBottom: '20px'}}> {/* Ensure each image and button pair is contained */}
                          <img src={image} alt={`Generated Image ${index}`}
                               style={{maxWidth: '100%', height: 'auto'}}/>
                          <div style={{textAlign: 'center', paddingTop: '20px'}}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                if (textResponse !== null) { // Ensure textResponse is not null
                                  saveTextImage(textResponse, title, t(tokens.form.interiorDesigns), image)
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

