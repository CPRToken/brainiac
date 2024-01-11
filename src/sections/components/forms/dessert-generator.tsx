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
  { label: tokens.form.Cake, value: tokens.form.Cake },
  { label: tokens.form.Cookie, value: tokens.form.Cookie },
  { label: tokens.form.Pie, value: tokens.form.Pie },
  { label: tokens.form.IceCream, value: tokens.form.IceCream },
  { label: tokens.form.Pudding, value: tokens.form.Pudding },
  { label: tokens.form.Sorbet, value: tokens.form.Sorbet },
  { label: tokens.form.Tart, value: tokens.form.Tart },
  { label: tokens.form.Pastry, value: tokens.form.Pastry },
  { label: tokens.form.Chocolate, value: tokens.form.Chocolate },
  { label: tokens.form.FruitDessert, value: tokens.form.FruitDessert },
  { label: tokens.form.Cupcake, value: tokens.form.Cupcake },
  { label: tokens.form.FrozenDessert, value: tokens.form.FrozenDessert },
  { label: tokens.form.Custard, value: tokens.form.Custard },
  { label: tokens.form.Candy, value: tokens.form.Candy },

  // ... add more if needed
];


const baseOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Chocolate', value: 'Chocolate' },
  { label: 'Fruits', value: 'Fruits' },


  // ... add more as needed
];


const toppingsOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Whipped Cream', value: 'WhippedCream' },


  // ... add more as needed
];






export const DessertWriter: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [country, setCountry] = useState<string>('');
  const [dish, setDish] = useState<string>('');
  const [base, setBase] = useState<string>('');
  const [toppings, setToppings] = useState<string>('');
  const [spiciness, setSpiciness] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();



  type SpicinessLevels = {
    [key: number]: string;
  };

  const spicinessLevels: SpicinessLevels = {
    0: tokens.form.Sweet,
    1: tokens.form.SlightlySweet,
    2: tokens.form.Rich,
    3: tokens.form.Sour,
    4: tokens.form.Savory,
  };

    useEffect(() => {
        if (country && dish && base && toppings && spiciness !== null) {
            let newPrompt = t(tokens.form.createDessert);

            const countryText = ` ${t(country)} `;
            const dishText = ` ${t(dish)} `;
            const baseText = ` ${t(base)} `;
            const toppingsText = ` ${t(toppings)} `;
            const flavorProfileText = ` ${t(spicinessLevels[spiciness])} `; // Rename 'spicinessText' to 'flavorProfileText'

            newPrompt = newPrompt
                .replace('[country]', countryText)
                .replace('[dish]', dishText)
                .replace('[base]', baseText)
                .replace('[toppings]', toppingsText)
                .replace('[spiciness]', flavorProfileText); // Replace 'spiciness' with the flavor profile

            setPrompt(newPrompt.trim());
        } else {
            setPrompt('');
        }
    }, [country, dish, base, toppings, spiciness, t]);



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
            label={t(tokens.form.dish)}
            name="style"
            select
            SelectProps={{ native: true }}
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {dishOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.base)}
            name="base"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            multiline
            rows={1}
            sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
              {baseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {t(option.label)} {/* Apply translation here */}
                  </option>
            ))}
          </TextField>
          <TextField
             label={t(tokens.form.toppings)}
            name="toppings"
            value={toppings}
            onChange={(e) => setToppings(e.target.value)}
             multiline
             rows={1}
             sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
            {toppingsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <div>
        <label>{t(tokens.form.tasteMeter)}</label>
        <Slider
            value={spiciness}
            min={0}
            max={4}
            step={1}
            marks={[
              { value: 0, label: t(tokens.form.Sweet) },
              { value: 1, label: t(tokens.form.SlightlySweet) },
              { value: 2, label: t(tokens.form.Rich) },
              { value: 3, label: t(tokens.form.Sour) },
              { value: 4,label: t(tokens.form.Savory)},
            ]}
            onChange={(_, newValue) => setSpiciness(newValue as number)}
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
          onClick={() => combinedSubmit(prompt, 800)}
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
              <img key={index} src={image} alt={`Generated Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

