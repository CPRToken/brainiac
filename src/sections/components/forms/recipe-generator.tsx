import type { FC } from 'react';
import React from 'react';
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
import {saveTextImage } from "../buttons/saveTextImage";

type Option = {
  label: string;
  value: string;
};

const countryOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.NoCountry, value: tokens.form.Neutral },
  { label: tokens.form.Chile, value: tokens.form.Chile },
  { label: tokens.form.Spain, value: tokens.form.Spanish },
  { label: tokens.form.French, value: tokens.form.French },
  // ... add more
  { label: tokens.form.German, value: tokens.form.German },
  { label: tokens.form.Hungary, value: tokens.form.Hungarian },
  { label: tokens.form.Italy, value: tokens.form.Italian },
  { label: tokens.form.Portugal, value: tokens.form.Portuguese },
  { label: tokens.form.Russia, value: tokens.form.Russian },
  { label: tokens.form.India, value: tokens.form.India },
  { label: tokens.form.Japan, value: tokens.form.Japanese },
  { label: tokens.form.Korea, value: tokens.form.Korean },
  { label: tokens.form.Brazil, value: tokens.form.Brazil },
  { label: tokens.form.Turkish, value: tokens.form.Turkish },
  { label: tokens.form.Dutch, value: tokens.form.Dutch },
  { label: tokens.form.Swedish, value: tokens.form.Swedish },
  { label: tokens.form.Finnish, value: tokens.form.Finnish },
  { label: tokens.form.Danish, value: tokens.form.Danish },
  { label: tokens.form.Norwegian, value: tokens.form.Norwegian },
  { label: tokens.form.Polish, value: tokens.form.Polish },
  { label: tokens.form.Greek, value: tokens.form.Greek },
  { label: tokens.form.Czech, value: tokens.form.Czech },
  { label: tokens.form.Slovak, value: tokens.form.Slovak },
  { label: tokens.form.Romanian, value: tokens.form.Romanian },
  { label: tokens.form.Bulgarian, value: tokens.form.Bulgarian },
  { label: tokens.form.Serbian, value: tokens.form.Serbian },
  { label: tokens.form.Croatian, value: tokens.form.Croatian },
  { label: tokens.form.Bosnian, value: tokens.form.Bosnian },
  { label: tokens.form.Slovenian, value: tokens.form.Slovenian },
  { label: tokens.form.Albanian, value: tokens.form.Albanian },
  { label: tokens.form.Lithuanian, value: tokens.form.Lithuanian },
  { label: tokens.form.Latvian, value: tokens.form.Latvian },
  { label: tokens.form.Estonian, value: tokens.form.Estonian },
  { label: tokens.form.Maltese, value: tokens.form.Maltese },
  { label: tokens.form.Thai, value: tokens.form.Thai },
  { label: tokens.form.Filipino, value: tokens.form.Filipino },
  { label: tokens.form.Vietnamese, value: tokens.form.Vietnamese },
  { label: tokens.form.Indonesian, value: tokens.form.Indonesian },
  { label: tokens.form.Malay, value: tokens.form.Malay },
  { label: tokens.form.Persian, value: tokens.form.Persian },
  { label: tokens.form.Hebrew, value: tokens.form.Hebrew },
  // ... add more
];

const dishOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Appetizer, value: tokens.form.Appetizer },
  { label: tokens.form.MainCourse, value: tokens.form.MainCourse },
  { label: tokens.form.Soup, value: tokens.form.Soup },
  { label: tokens.form.Salad, value: tokens.form.Salad },
  { label: tokens.form.SideDish, value: tokens.form.SideDish },
  { label: tokens.form.Snack, value: tokens.form.Snack },
  { label: tokens.form.Beverage, value: tokens.form.Beverage },
  { label: tokens.form.Cocktail, value: tokens.form.Cocktail },
  { label: tokens.form.Bread, value: tokens.form.Bread },
  { label: tokens.form.Breakfast, value: tokens.form.Breakfast },
  { label: tokens.form.Brunch, value: tokens.form.Brunch },
  { label: tokens.form.Pastry, value: tokens.form.Pastry },

  // ... add more
];








export const RecipeWriter: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [country, setCountry] = useState<string>('');
  const [dish, setDish] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [garnish, setGarnish] = useState<string>('');
  const [spiciness, setSpiciness] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();




  type SpicinessLevels = {
    [key: number]: string;
  };

  const spicinessLevels: SpicinessLevels = {
    0: tokens.form.Spicy,
    1: tokens.form.MildSpicy,
    2: tokens.form.SweetNSour,
    3: tokens.form.LightSpicy,
    4: tokens.form.NonSpicy,
  };




  useEffect(() => {
    if (country && dish && protein && garnish && spiciness !== null) {
      let newPrompt = t(tokens.form.createRecipe);

      const countryText = ` ${t(country)} `;
      const dishText = ` ${t(dish)} `;
      const proteinText = ` ${t(protein)} `;
      const garnishText = ` ${t(garnish)} `;
      const spicinessText = ` ${t(spicinessLevels[spiciness])} `;

      const countryWords = countryText.split(' ').filter(word => word.length > 0);
      const dishWords = dishText.split(' ').filter(word => word.length > 0);
      const proteinWords = proteinText.split(' ').filter(word => word.length > 0);

      // Ensure at least one word from each is taken for the title,
      // adjusting the indexes accordingly if you want more words from each category.
      const title = [...countryWords.slice(0, 1), ...dishWords.slice(0, 1), ...proteinWords.slice(0, 1)].join(' ');

      newPrompt = newPrompt
        .replace('[country]', countryText)
        .replace('[dish]', dishText)
        .replace('[protein]', proteinText)
        .replace('[garnish]', garnishText)
        .replace('[spiciness]', spicinessText);

      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [country, dish, protein, garnish, spiciness, t]);



  return (
    <Box sx={{p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto'}}>
      <Stack spacing={3}>

          <TextField
            label={t(tokens.form.country)}
            name="artist"
            select
            SelectProps={{native: true}}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth

          >
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.dish)}
            name="style"
            select
            SelectProps={{native: true}}
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            fullWidth

          >
            {dishOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>



          <TextField
            label={t(tokens.form.protein)}
            name="protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            multiline
            rows={1}

          >

          </TextField>
          <TextField
            label={t(tokens.form.garnish)}
            name="garnish"
            value={garnish}
            onChange={(e) => setGarnish(e.target.value)}
            multiline
            rows={1}

          >

          </TextField>


        <div style={{display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '10px'}}>
          <label>{t(tokens.form.spiciness)}</label>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
          <Slider
            value={spiciness}
            min={0}
            max={4}
            step={1}
            marks={[
              {value: 0, label: t(tokens.form.Spicy)},
              {value: 1, label: t(tokens.form.MildSpicy)},
              {value: 2, label: t(tokens.form.SweetNSour)},
              {value: 3, label: t(tokens.form.LightSpicy)},
              {value: 4, label: t(tokens.form.NonSpicy)},
            ]}
            onChange={(_, newValue) => setSpiciness(newValue as number)}
            sx={{width: '95%'}}
          />
        </div>


      </Stack>
      <Box sx={{mt: 3}}>
        <Button
          onClick={() => combinedSubmit(prompt, 700)}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}  // Disable the button while loading
        >
          {isLoading ? <CircularProgress size={24}/> : 'Submit'}
        </Button>
      </Box>

      <Box sx={{mt: 3}}>
        {textResponse && (
          <Box sx={{mt: 3}}>
            <label>{t(tokens.headings.yourRecipe)}</label>
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
                        saveTextImage(textResponse, title, t(tokens.form.recipes), image)
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
