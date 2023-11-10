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
import {tokens} from "../../../locales/tokens";
import CircularProgress from '@mui/material/CircularProgress';
import useHandleSubmit from "./handle-submit";

type Option = {
  label: string;
  value: string;
};

const countryOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Italy', value: 'Italian' },
  { label: 'Thailand', value: 'Thai' },
  { label: 'India', value: 'Indian' },
  { label: 'France', value: 'French' },
  { label: 'Mexico', value: 'Mexican' },
  { label: 'China', value: 'Chinese' },
  { label: 'Japan', value: 'Japanese' },
  { label: 'Spain', value: 'Spanish' },
  { label: 'USA', value: 'American' },
  { label: 'Greece', value: 'Greek' },
  { label: 'Vietnam', value: 'Vietnamese' },
  { label: 'Korea', value: 'Korean' },
  { label: 'Brazil', value: 'Brazilian' },
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

const difficultyOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
  // ... add more
];

export const RecipeWriter: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useHandleSubmit();
  const [country, setCountry] = useState<string>('');
  const [dishType, setDishType] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();


  useEffect(() => {
    // Check if all selections are made
    if (country && dishType && difficulty && cookingTime) {
      let newPrompt = 'Create a [country] [dishType] recipe that is [difficulty] difficulty, and takes [cookingTime] minutes to make.';
      newPrompt = newPrompt.replace('[country]', country);
      newPrompt = newPrompt.replace('[dishType]', dishType);
      newPrompt = newPrompt.replace('[difficulty]', difficulty);
      newPrompt = newPrompt.replace('[cookingTime]', `${cookingTime}`);
      setPrompt(newPrompt);
    } else {
      // If not all selections are made, keep the prompt empty
      setPrompt('');
    }
  }, [country, dishType, difficulty, cookingTime]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Country"
          name="country"
          select
          SelectProps={{ native: true }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Dish Type"
          name="dishType"
          select
          SelectProps={{ native: true }}
          value={dishType}
          onChange={(e) => setDishType(e.target.value)}
        >
          {dishTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Difficulty"
          name="difficulty"
          select
          SelectProps={{ native: true }}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>Cooking Time (minutes)</label>
          <Slider
            value={cookingTime}
            min={1}
            max={120}
            step={1}
            onChange={(_, newValue) => setCookingTime(newValue as number)}
          />
        </div>
        <TextField
          fullWidth
          label="Prompt"
          name="prompt"
          value={prompt}
          multiline
          rows={4}
        />
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button
          onClick={() => handleSubmit(prompt, 700)}
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
        <label>{t(tokens.headings.yourRecipe)}</label>
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
