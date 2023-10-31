import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import responseText from '../clipboards/response-text';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import FileCopyIcon from "@mui/icons-material/FileCopy";
import useHandleSubmit from './handle-submit';

type Option = {
  label: string;
  value: string;
};

const dietTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  // ... add more
];

const mealTypeOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  // ... add more
];

export const DietPlanner: FC = () => {
  const [dietType, setDietType] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [calories, setCalories] = useState<number>(500);
  const [prompt, setPrompt] = useState<string>('');
  const { handleSubmit, openAIResponse } = useHandleSubmit();
  const { textRef, handleCopyText } = responseText();
  const { t } = useTranslation();




  useEffect(() => {
    let newPrompt = 'Create a [dietType] meal plan for [mealType] with [calories] calories.';
    newPrompt = newPrompt.replace('[dietType]', dietType || 'any');
    newPrompt = newPrompt.replace('[mealType]', mealType || 'any meal');
    newPrompt = newPrompt.replace('[calories]', `${calories}`);
    setPrompt(newPrompt);
  }, [dietType, mealType, calories]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Diet Type"
          name="dietType"
          select
          SelectProps={{ native: true }}
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
        >
          {dietTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Meal Type"
          name="mealType"
          select
          SelectProps={{ native: true }}
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          {mealTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>Calories</label>
          <Slider
            value={calories}
            min={100}
            max={2000}
            step={50}
            onChange={(_, newValue) => setCalories(newValue as number)}
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
          onClick={() => handleSubmit(prompt)}
          type="submit"
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
      </Box>



      <Box sx={{ mt: 3 }}>
        {openAIResponse && (
          <>
        <label>{t(tokens.headings.yourMealPlan)}</label>
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
