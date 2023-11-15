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

type Option = {
  label: string;
  value: string;
};

const countryOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Chile, value: 'Chilean' },
  { label: tokens.form.Spain, value: 'spanish' },
  { label: tokens.form.French, value: 'french' },
  { label: tokens.form.German, value: 'german' },
  { label: tokens.form.Italy, value: 'italian' },
  { label: tokens.form.Portugal, value: 'portuguese' },
  { label: tokens.form.Russia, value: 'russian' },
  { label: tokens.form.India, value: 'indian' },
  { label: tokens.form.Japan, value: 'japanese' },
  { label: tokens.form.Korea, value: 'korean' },
  { label: tokens.form.Brazil, value: 'Brazilian' },
  { label: tokens.form.Turkish, value: 'turkish' },
  { label: tokens.form.Dutch, value: 'dutch' },
  { label: tokens.form.Swedish, value: 'swedish' },
  { label: tokens.form.Finnish, value: 'finnish' },
  { label: tokens.form.Danish, value: 'danish' },
  { label: tokens.form.Norwegian, value: 'norwegian' },
  { label: tokens.form.Polish, value: 'polish' },
  { label: tokens.form.Greek, value: 'greek' },
  { label: tokens.form.Hungarian, value: 'hungarian' },
  { label: tokens.form.Czech, value: 'czech' },
  { label: tokens.form.Slovak, value: 'slovak' },
  { label: tokens.form.Romanian, value: 'romanian' },
  { label: tokens.form.Bulgarian, value: 'bulgarian' },
  { label: tokens.form.Serbian, value: 'serbian' },
  { label: tokens.form.Croatian, value: 'croatian' },
  { label: tokens.form.Bosnian, value: 'bosnian' },
  { label: tokens.form.Slovenian, value: 'slovenian' },
  { label: tokens.form.Albanian, value: 'albanian' },
  { label: tokens.form.Lithuanian, value: 'lithuanian' },
  { label: tokens.form.Latvian, value: 'latvian' },
  { label: tokens.form.Estonian, value: 'estonian' },
  { label: tokens.form.Maltese, value: 'maltese' },
  { label: tokens.form.Thai, value: 'thai' },
  { label: tokens.form.Filipino, value: 'filipino' },
  { label: tokens.form.Vietnamese, value: 'vietnamese' },
  { label: tokens.form.Indonesian, value: 'indonesian' },
  { label: tokens.form.Malay, value: 'malay' },
  { label: tokens.form.Persian, value: 'persian' },
  { label: tokens.form.Hebrew, value: 'hebrew' },
  // ... add more
];

const dishTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Appetizer, value: 'appetizer' },
  { label: tokens.form.MainCourse, value: 'main-course' },
  { label: tokens.form.Dessert, value: 'dessert' },
  { label: tokens.form.Soup, value: 'soup' },
  { label: tokens.form.Salad, value: 'salad' },
  { label: tokens.form.SideDish, value: 'side-dish' },
  { label: tokens.form.Snack, value: 'snack' },
  { label: tokens.form.Beverage, value: 'beverage' },
  { label: tokens.form.Cocktail, value: 'cocktail' },
  { label: tokens.form.Bread, value: 'bread' },
  { label: tokens.form.Breakfast, value: 'breakfast' },
  { label: tokens.form.Brunch, value: 'brunch' },
  { label: tokens.form.Pastry, value: 'pastry' },


  // ... add more
];

const proteinOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Chicken, value: 'Chicken' },
  { label: tokens.form.Beef, value: 'Beef' },
  { label: tokens.form.Pork, value: 'Pork' },
  { label: tokens.form.Salmon, value: 'Salmon' },
  { label: tokens.form.Tuna, value: 'Tuna' },
  { label: tokens.form.Crab, value: 'Crab' },
  { label: tokens.form.Shrimp, value: 'Shrimp' },
  { label: tokens.form.Tofu, value: 'Tofu' },
  { label: tokens.form.Lamb, value: 'Lamb' },
  { label: tokens.form.Turkey, value: 'Turkey' },
  { label: tokens.form.Cod, value: 'Cod' },
  { label: tokens.form.Sausage, value: 'Sausage' },
  // ... add more
];


const garnishOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Onion', value: 'Onion' },

  // ... add more
];





export const RecipeWriter: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [country, setCountry] = useState<string>('');
  const [dishType, setDishType] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [garnish, setGarnish] = useState<string>('');
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();





  useEffect(() => {
    // Check if all selections are made
    if (country && dishType && protein  && garnish && cookingTime) {
      let newPrompt = t(tokens.form.createRecipe);
      newPrompt = newPrompt.replace('[country]', country);
      newPrompt = newPrompt.replace('[dishType]', dishType);
      newPrompt = newPrompt.replace('[protein]', protein);
      newPrompt = newPrompt.replace('[garnish]', garnish);
       newPrompt = newPrompt.replace('[cookingTime]', `${cookingTime}`);
      setPrompt(newPrompt);
    } else {
      // If not all selections are made, keep the prompt empty
      setPrompt('');
    }
  }, [country, dishType, protein, garnish, cookingTime]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.country)}
            name="artist"
            select
            SelectProps={{ native: true }}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.dishType)}
            name="style"
            select
            SelectProps={{ native: true }}
            value={dishType}
            onChange={(e) => setDishType(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {dishTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.protein)}
            name="protein"
            select
            SelectProps={{ native: true }}
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {proteinOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
             label={t(tokens.form.garnish)}
            name="garnish"
            value={garnish}
            onChange={(e) => setGarnish(e.target.value)}
             multiline
             rows={1}
             sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
            {garnishOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <div>
          <label>{t(tokens.form.cookingTime)}</label>
          <Slider
            value={cookingTime}
            min={5}
            max={120}
            step={5}
            onChange={(_, newValue) => setCookingTime(newValue as number)}
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
            <label>{t(tokens.headings.yourRecipe)}</label>
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

