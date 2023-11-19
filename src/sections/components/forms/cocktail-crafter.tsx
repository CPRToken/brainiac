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

const alcoholOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Vodka, value: 'vodka' },
  { label: tokens.form.Rum, value: 'rum' },
  { label: tokens.form.Gin, value: 'gin' },
  { label: tokens.form.Whiskey, value: 'whiskey' },
  { label: tokens.form.Tequila, value: 'tequila' },
  { label: tokens.form.Port, value: 'port' },
  { label: tokens.form.Brandy, value: 'brandy' },
  { label: tokens.form.Sake, value: 'sake' },
  { label: tokens.form.Soju, value: 'soju' },
  { label: tokens.form.Cachaca, value: 'cachaca' },
  { label: tokens.form.Raki, value: 'raki' },
  { label: tokens.form.Jenever, value: 'jenever' },
  { label: tokens.form.Akvavit, value: 'akvavit' },
  { label: tokens.form.Koskenkorva, value: 'koskenkorva' },
  { label: tokens.form.Akvavit, value: 'akvavit' },
  { label: tokens.form.BisonGrassVodka, value: 'bisongrassvodka' },
  { label: tokens.form.Ouzo, value: 'ouzo' },
  { label: tokens.form.Palinka, value: 'palinka' },
  { label: tokens.form.Beherovka, value: 'beherovka' },
  { label: tokens.form.Slivovitz, value: 'slivovitz' },
  { label: tokens.form.Tuica, value: 'tuica' },
  { label: tokens.form.Rakia, value: 'rakia' },
  { label: tokens.form.LozovaRakia, value: 'lozovarakia' },
  { label: tokens.form.Travarica, value: 'travarica' },
  { label: tokens.form.Grappa, value: 'grappa' },
  { label: tokens.form.Meade, value: 'meade' },
  { label: tokens.form.Krupnik, value: 'krupnik' },
  { label: tokens.form.Schnapps, value: 'schnapps' },
  { label: tokens.form.Singha, value: 'singha' },
  { label: tokens.form.Lambanog, value: 'lambanog' },
  { label: tokens.form.Ruou, value: 'ruou' },
  { label: tokens.form.Arak, value: 'arak' },
  { label: tokens.form.Toddy, value: 'toddy' },
  { label: tokens.form.Arrack, value: 'arrack' },
  // ... continue for other countries
];


const cocktailOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.ClassicCocktail, value: 'classic-cocktail' },
  { label: tokens.form.TropicalCocktail, value: 'tropical-cocktail' },
  { label: tokens.form.Martini, value: 'martini' },
  { label: tokens.form.Mojito, value: 'mojito' },
  { label: tokens.form.Margarita, value: 'margarita' },
  { label: tokens.form.LongDrink, value: 'long-drink' },
  { label: tokens.form.Shooter, value: 'shooter' },
  { label: tokens.form.Mocktail, value: 'mocktail' },
  { label: tokens.form.Highball, value: 'highball' },
  { label: tokens.form.Lowball, value: 'lowball' },
  { label: tokens.form.HotCocktail, value: 'hot-cocktail' },
  { label: tokens.form.CraftCocktail, value: 'craft-cocktail' },
  { label: tokens.form.Sangria, value: 'sangria' },
  // ... add more as needed
];


const mixerOptions: Option[] = [
  { label: '', value: '' },
    { label: tokens.form.Coke, value: 'Coke' },
    { label: tokens.form.Soda, value: 'Soda' },
    { label: tokens.form.TonicWater, value: 'TonicWater' },
    { label: tokens.form.GingerAle, value: 'GingerAle' },
    { label: tokens.form.ClubSoda, value: 'ClubSoda' },
    { label: tokens.form.Lemonade, value: 'Lemonade' },
    { label: tokens.form.CranberryJuice, value: 'CranberryJuice' },
    { label: tokens.form.GrapefruitJuice, value: 'GrapefruitJuice' },
    { label: tokens.form.PineappleJuice, value: 'PineappleJuice' },
    { label: tokens.form.OrangeJuice, value: 'OrangeJuice' },
    { label: tokens.form.TomatoJuice, value: 'TomatoJuice' },
    { label: tokens.form.LimeJuice, value: 'LimeJuice' },
    { label: tokens.form.LemonJuice, value: 'LemonJuice' },
    { label: tokens.form.SimpleSyrup, value: 'SimpleSyrup' },
    { label: tokens.form.Grenadine, value: 'Grenadine' },
    { label: tokens.form.Bitters, value: 'Bitters' },
    { label: tokens.form.Cream, value: 'Cream' },
    { label: tokens.form.Milk, value: 'Milk' },
    { label: tokens.form.EggWhite, value: 'EggWhite' },
    { label: tokens.form.Honey, value: 'Honey' },

  // ... add more
];


const garnishOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Olive', value: 'Olive' },

  // ... add more
];





export const CocktailCrafter: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [alcohol, setAlcohol] = useState<string>('');
  const [cocktail, setCocktail] = useState<string>('');
  const [mixer, setMixer] = useState<string>('');
  const [garnish, setGarnish] = useState<string>('');
  const [sweetness, setSweetness] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();


    type SweetnessLevels = {
        [key: number]: string;
    };

    const sweetnessLevels: SweetnessLevels = {
        0: 'Very Sweet',
        1: 'Slightly Sweet',
        2: 'Sweet & Bitter',
        3: 'Bitter',
        4: 'Sour'
    };





    useEffect(() => {
        if (alcohol && cocktail && mixer && garnish && sweetness !== null) {
            let newPrompt = t(tokens.form.createCocktail);
            newPrompt = newPrompt.replace('[alcohol]', alcohol);
            newPrompt = newPrompt.replace('[cocktail]', cocktail);
            newPrompt = newPrompt.replace('[mixer]', mixer);
            newPrompt = newPrompt.replace('[garnish]', garnish);
            newPrompt = newPrompt.replace('[sweetness]', sweetnessLevels[sweetness]);
            setPrompt(newPrompt);
        } else {
            setPrompt('');
        }
    }, [alcohol, cocktail, mixer, garnish, sweetness]);




    return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.alcohol)}
            name="artist"
            select
            SelectProps={{ native: true }}
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {alcoholOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.cocktail)}
            name="style"
            select
            SelectProps={{ native: true }}
            value={cocktail}
            onChange={(e) => setCocktail(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {cocktailOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.mixer)}
            name="mixer"
            select
            SelectProps={{ native: true }}
            value={mixer}
            onChange={(e) => setMixer(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
              {mixerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {t(option.label)} {/* Apply translation here */}
                  </option>
              ))}
          </TextField>
          <TextField
             label={t(tokens.form.cocktailGarnish)}
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
              <label>{t(tokens.form.sweetness)}</label>
              <Slider
                  value={sweetness}
                  min={0}
                  max={4}
                  step={1}
                  marks={[
                      { value: 0, label: 'Sweet' },
                      { value: 1, label: 'Slightly Sweet' },
                      { value: 2, label: 'Sweet & Bitter' },
                      { value: 3, label: 'Bitter' },
                      { value: 4, label: 'Sour' }
                  ]}
                  onChange={(_, newValue) => setSweetness(newValue as number)}
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

