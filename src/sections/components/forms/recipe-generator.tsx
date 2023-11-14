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
  { label: 'Italy', value: 'Italian' },
  { label: 'Chile', value: 'Chile' },
  { label: 'Thailand', value: 'Thai' },
  { label: 'India', value: 'Indian' },
  { label: 'France', value: 'French' },
  { label: 'Mexico', value: 'Mexican' },
  { label: 'China', value: 'Chinese' },
  { label: 'Greek', value: 'Greek' },
  { label: 'Japan', value: 'Japanese' },
  { label: 'Spain', value: 'Spanish' },
  { label: 'USA', value: 'American' },
  { label: 'Greece', value: 'Greek' },
  { label: 'Vietnam', value: 'Vietnamese' },
  { label: 'Korea', value: 'Korean' },
  { label: 'Brazil', value: 'Brazilian' },
  { label: 'Peru', value: 'Peru' },
  { label: 'Turkish', value: 'Turkish' },
  { label: 'Lebanon', value: 'Lebanese' }
  // ... add more
];

const dishTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Appetizer', value: 'appetizer' },
  { label: 'Main Course', value: 'main-course' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Soup', value: 'soup' },
  { label: 'Salad', value: 'salad' },
  { label: 'Side Dish', value: 'side-dish' },
  { label: 'Snack', value: 'snack' },
  { label: 'Beverage', value: 'beverage' },
  { label: 'Cocktail', value: 'cocktail' },
  { label: 'Bread', value: 'bread' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Brunch', value: 'brunch' },
  { label: 'Pastry', value: 'pastry' }

  // ... add more
];

const proteinOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Chicken', value: 'Chicken' },
  { label: 'Beef', value: 'Beef' },
  { label: 'Pork', value: 'Pork' },
  { label: 'Salmon', value: 'Salmon' },
  { label: 'Shrimp', value: 'Shrimp' },
  { label: 'Tofu', value: 'Tofu' },
  { label: 'Lamb', value: 'Lamb' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Cod', value: 'Cod' },
  { label: 'Sausage', value: 'Sausage' },
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
                {option.label}
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
                {option.label}
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
                {option.label}
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
                {option.label}
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

