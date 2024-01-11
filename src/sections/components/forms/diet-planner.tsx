import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ReponseText from '../clipboards/response-text';
import {CustomSlider} from "../slider/slider";
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import FileCopyIcon from "@mui/icons-material/FileCopy";
import useGPT4Submit from './gpt4-submit';
import CircularProgress from '@mui/material/CircularProgress';



type Option = {
  label: string;
  value: string;
};

const dietTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Vegan, value: tokens.form.Vegan },
  { label: tokens.form.Vegetarian, value: tokens.form.Vegetarian },
  { label: tokens.form.Keto, value: tokens.form.Keto },
  { label: tokens.form.Paleo, value: tokens.form.Paleo },
  { label: tokens.form.GlutenFree, value: tokens.form.GlutenFree },
  // Adding more diet options
  { label: tokens.form.LowCarb, value: tokens.form.LowCarb },
  { label: tokens.form.Whole30, value: tokens.form.Whole30 },
  { label: tokens.form.Mediterranean, value: tokens.form.Mediterranean },
  { label: tokens.form.DairyFree, value: tokens.form.DairyFree },
  { label: tokens.form.PlantBased, value: tokens.form.PlantBased },
  { label: tokens.form.LowFat, value: tokens.form.LowFat },
  { label: tokens.form.HighProtein, value: tokens.form.HighProtein },
  // ... add more
];

const mealTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Breakfast, value: tokens.form.Breakfast },
  { label: tokens.form.Lunch, value: tokens.form.Lunch },
  { label: tokens.form.Dinner, value: tokens.form.Dinner },
  // Adding more meal types
  { label: tokens.form.Snack, value: tokens.form.Snack },
  { label: tokens.form.Brunch, value: tokens.form.Brunch },
  { label: tokens.form.Dessert, value: tokens.form.Dessert },
  { label: tokens.form.TeaTime, value: tokens.form.TeaTime },
  { label: tokens.form.Supper, value: tokens.form.Supper },
  { label: tokens.form.MidnightSnack, value: tokens.form.MidnightSnack },
  // ... add more
];




export const DietPlanner: FC = () => {


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [dietType, setDietType] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [calories, setCalories] = useState<number>(500);
  const [prompt, setPrompt] = useState<string>('');
 const { textRef, handleCopyText } = ReponseText();
  const { t } = useTranslation();


  const submitToOpenAI = () => {
    const maxTokens = 1000;
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
    // Only construct the prompt if all fields are filled
    if (dietType && mealType && calories) {
      let newPrompt = t(tokens.form.dietPlan);

      const dietTypeText = t(dietType);
      const mealTypeText = t(mealType);
      const caloriesText = calories.toString();

      // Replace each placeholder with its corresponding text
      newPrompt = newPrompt
        .replace('[dietType]', dietTypeText)
        .replace('[mealType]', mealTypeText)
        .replace('[calories]', caloriesText);

      setPrompt(newPrompt.trim());
    } else {
      // Clear the prompt if any field is not filled
      setPrompt('');
    }
  }, [dietType, mealType, calories, t]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.dietType)}
          name="dietType"
          select
          SelectProps={{ native: true }}
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
        >
          {dietTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.mealType)}
          name="mealType"
          select
          SelectProps={{ native: true }}
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          {mealTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.calories)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider
            value={calories}
            min={100}
            max={2000}
            step={50}
            onChange={(_, newValue) => setCalories(newValue as number)}
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
        <Box sx={{ mt: 3 }}>
          <label>{t(tokens.form.yourLyrics)}</label>
          <Button onClick={handleCopyText} title="Copy response text">
            <FileCopyIcon />
          </Button>
          <Paper elevation={3} ref={textRef} style={{ padding: '30px', overflow: 'auto', lineHeight: '1.5' }}>
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

