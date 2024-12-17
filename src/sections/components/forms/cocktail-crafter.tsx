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
import {saveTextImage } from "../buttons/saveTextImage";

type Option = {
  label: string;
  value: string;
};

const alcoholOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Vodka, value: tokens.form.Vodka },
  { label: tokens.form.Rum, value: tokens.form.Rum },
  { label: tokens.form.Gin, value: tokens.form.Gin },
  // ... add more
  { label: tokens.form.Whiskey, value: tokens.form.Whiskey },
  { label: tokens.form.Tequila, value: tokens.form.Tequila },
  { label: tokens.form.Port, value: tokens.form.Port },
  { label: tokens.form.Brandy, value: tokens.form.Brandy },
  { label: tokens.form.Sake, value: tokens.form.Sake },
  { label: tokens.form.Soju, value: tokens.form.Soju },
  { label: tokens.form.Cachaca, value: tokens.form.Cachaca },
  { label: tokens.form.Raki, value: tokens.form.Raki },
  { label: tokens.form.Jenever, value: tokens.form.Jenever },
  { label: tokens.form.Akvavit, value: tokens.form.Akvavit },
  { label: tokens.form.Koskenkorva, value: tokens.form.Koskenkorva },
  { label: tokens.form.BisonGrassVodka, value: tokens.form.BisonGrassVodka },
  { label: tokens.form.Ouzo, value: tokens.form.Ouzo },
  { label: tokens.form.Palinka, value: tokens.form.Palinka },
  { label: tokens.form.Beherovka, value: tokens.form.Beherovka },
  { label: tokens.form.Slivovitz, value: tokens.form.Slivovitz },
  { label: tokens.form.Tuica, value: tokens.form.Tuica },
  { label: tokens.form.Rakia, value: tokens.form.Rakia },
  { label: tokens.form.LozovaRakia, value: tokens.form.LozovaRakia },
  { label: tokens.form.Travarica, value: tokens.form.Travarica },
  { label: tokens.form.Grappa, value: tokens.form.Grappa },
  { label: tokens.form.Meade, value: tokens.form.Meade },
  { label: tokens.form.Krupnik, value: tokens.form.Krupnik },
  { label: tokens.form.Schnapps, value: tokens.form.Schnapps },
  { label: tokens.form.Singha, value: tokens.form.Singha },
  { label: tokens.form.Lambanog, value: tokens.form.Lambanog },
  { label: tokens.form.Ruou, value: tokens.form.Ruou },
  { label: tokens.form.Arak, value: tokens.form.Arak },
  { label: tokens.form.Toddy, value: tokens.form.Toddy },
  { label: tokens.form.Arrack, value: tokens.form.Arrack },
  // ... continue for other countries
];


const cocktailOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Cocktail, value: tokens.form.Cocktail },
  { label: tokens.form.ClassicCocktail, value: tokens.form.ClassicCocktail },
  { label: tokens.form.TropicalCocktail, value: tokens.form.TropicalCocktail },
  { label: tokens.form.Martini, value: tokens.form.Martini },
  // ... add more
  { label: tokens.form.Mojito, value: tokens.form.Mojito },
  { label: tokens.form.Margarita, value: tokens.form.Margarita },
  { label: tokens.form.LongDrink, value: tokens.form.LongDrink },
  { label: tokens.form.Shooter, value: tokens.form.Shooter },
  { label: tokens.form.Mocktail, value: tokens.form.Mocktail },
  { label: tokens.form.Highball, value: tokens.form.Highball },
  { label: tokens.form.Lowball, value: tokens.form.Lowball },
  { label: tokens.form.HotCocktail, value: tokens.form.HotCocktail },
  { label: tokens.form.CraftCocktail, value: tokens.form.CraftCocktail },
  { label: tokens.form.Sangria, value: tokens.form.Sangria },
  // ... add more as needed
];


const mixerOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Coke, value: tokens.form.Coke },
  { label: tokens.form.Soda, value: tokens.form.Soda },
  { label: tokens.form.TonicWater, value: tokens.form.TonicWater },
  { label: tokens.form.GingerAle, value: tokens.form.GingerAle },
  { label: tokens.form.ClubSoda, value: tokens.form.ClubSoda },
  { label: tokens.form.Lemonade, value: tokens.form.Lemonade },
  { label: tokens.form.CranberryJuice, value: tokens.form.CranberryJuice },
  { label: tokens.form.GrapefruitJuice, value: tokens.form.GrapefruitJuice },
  { label: tokens.form.PineappleJuice, value: tokens.form.PineappleJuice },
  { label: tokens.form.OrangeJuice, value: tokens.form.OrangeJuice },
  { label: tokens.form.TomatoJuice, value: tokens.form.TomatoJuice },
  { label: tokens.form.LimeJuice, value: tokens.form.LimeJuice },
  { label: tokens.form.LemonJuice, value: tokens.form.LemonJuice },
  { label: tokens.form.SimpleSyrup, value: tokens.form.SimpleSyrup },
  { label: tokens.form.Grenadine, value: tokens.form.Grenadine },
  { label: tokens.form.Bitters, value: tokens.form.Bitters },
  { label: tokens.form.Cream, value: tokens.form.Cream },
  { label: tokens.form.Milk, value: tokens.form.Milk },
  { label: tokens.form.EggWhite, value: tokens.form.EggWhite },
  { label: tokens.form.Honey, value: tokens.form.Honey },
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
  const [title, setTitle] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();


    type SweetnessLevels = {
        [key: number]: string;
    };

  const sweetnessLevels: SweetnessLevels = {
    0: tokens.form.Sweet,
    1: tokens.form.SlightlySweet,
    2: tokens.form.SweetBitter,
    3: tokens.form.Bitter,
    4: tokens.form.Sour
  };




  useEffect(() => {
 if (alcohol && cocktail && mixer && sweetness !== null) {

      let newPrompt = t(tokens.form.createCocktail);

      const alcoholText = ` ${t(alcohol)} `;
      const cocktailText = ` ${t(cocktail)} `;
      const mixerText = ` ${t(mixer)} `;
      const garnishText = garnish ? ` ${t(garnish)} ` : ''; // Include garnish text only if filled
      const sweetnessText = ` ${t(sweetnessLevels[sweetness])} `;

   const alcoholWords = alcoholText.split(' ');
   const cocktailWords = cocktailText.split(' ');

   const title = alcoholWords.slice(0, 2).concat(cocktailWords.slice(0, 2)).join(' ');

      newPrompt = newPrompt
        .replace('[alcohol]', alcoholText)
        .replace('[cocktail]', cocktailText)
        .replace('[mixer]', mixerText)
        .replace('[garnish]', garnishText)
        .replace('[sweetness]', sweetnessText);

   setPrompt(newPrompt.trim());
   setTitle(title);
 } else {
   setPrompt('');
   setTitle('');
 }
  }, [alcohol, cocktail, mixer, garnish, sweetness, t]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <Stack spacing={3}>
          <TextField
            label={t(tokens.form.alcohol)}
            name="artist"
            select
            SelectProps={{ native: true }}
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            fullWidth

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

          >
            {cocktailOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>


          <TextField
            label={t(tokens.form.mixer)}
            name="mixer"
            select
            SelectProps={{ native: true }}
            value={mixer}
            onChange={(e) => setMixer(e.target.value)}
            fullWidth

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

          >
            {garnishOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>


          <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
              <label>{t(tokens.form.sweetness)}</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Slider
                  value={sweetness}
                  min={0}
                  max={4}
                  step={1}
                  marks={[
                    { value: 0, label: t(tokens.form.Sweet) },
                    { value: 1, label: t(tokens.form.SlightlySweet) },
                    { value: 2, label: t(tokens.form.SweetBitter) },
                    { value: 3, label: t(tokens.form.Bitter) },
                    { value: 4, label: t(tokens.form.Sour) },
                  ]}
                  onChange={(_, newValue) => setSweetness(newValue as number)}
                  sx={{ width: '95%' }}
              />
          </div>



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
              <Box key={index} sx={{mt: 2}}>
                <img src={image} alt={`Generated Art ${index + 1}`}
                     style={{width: '100%', marginBottom: '10px'}}/>

                <div style={{textAlign: 'center', paddingTop: '20px'}}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (textResponse !== null) { // Ensure textResponse is not null
                        saveTextImage(textResponse, title, t(tokens.form.cocktails), image)
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

