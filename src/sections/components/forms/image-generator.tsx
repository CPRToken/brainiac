//src/sections/components/forms/image-generator.tsx
import type { FC } from 'react';
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useImageSubmit from './image-submit';
import { useMemoryUsage } from 'src/contexts/memory/memory-usage-context';
import { handleSaveImage } from 'src/sections/components/buttons/saveImage';
import {useProtectedPage} from "src/hooks/use-protectedpage";



type Option = {
    label: string;
    value: string;
};

const artistOptions: Option[] = [
    { label: '', value: '' },
    { label: tokens.form.NoArtist, value: 'neutral' },
    { label: 'Leonardo Da Vinci', value: 'Leonardo Da Vinci' },
  { label: 'Vincent Van Gogh', value: 'Vincent Van Gogh' },
  { label: 'Pablo Picasso', value: 'Pablo Picasso' },
  { label: 'Claude Monet', value: 'Claude Monet' },
  { label: 'Michelangelo', value: 'Michelangelo' },
  { label: 'Rembrandt', value: 'Rembrandt' },
  { label: 'Salvador Dali', value: 'Salvador Dali' },
  { label: 'Pedro Lira', value: 'Pedro Lira' },
  { label: 'Roberto Matta', value: 'Roberto Matta' },
  { label: 'Frida Kahlo', value: 'Frida Kahlo' },
  { label: 'Ansel Adams', value: 'Ansel Adams' },
  { label: 'Georgia O Keeffe', value: 'Georgia OKeeffe' },
{ label: 'Andy Warhol', value: 'Andy Warhol' },
{ label: 'Edvard Munch', value: 'Edvard Munch' },
{ label: 'Jackson Pollock', value: 'Jackson Pollock' },
{ label: 'Johannes Vermeer', value: 'Johannes Vermeer' },
{ label: 'Gustav Klimt', value: 'Gustav Klimt' },
{ label: 'Henri Matisse', value: 'Henri Matisse' },
{ label: 'Caravaggio', value: 'Caravaggio' },
{ label: 'Raphael', value: 'Raphael' },
{ label: 'Banksy', value: 'Banksy' },
{ label: 'Jean-Michel Basquiat', value: 'Jean-Michel Basquiat' },
{ label: 'Damien Hirst', value: 'Damien Hirst' },
{ label: 'Marc Chagall', value: 'Marc Chagall' },
{ label: 'Edgar Degas', value: 'Edgar Degas' },
{ label: 'Titian', value: 'Titian' },
{ label: 'Paul Cézanne', value: 'Paul Cézanne' },
{ label: 'Jan van Eyck', value: 'Jan van Eyck' },

    // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },

  { label: tokens.form.Photorealism, value: tokens.form.Photorealism },
  { label: tokens.form.Realism, value: tokens.form.Realism },
  { label: tokens.form.Impressionism, value: tokens.form.Impressionism },
  { label: tokens.form.Surrealism, value: tokens.form.Surrealism },
  { label: tokens.form.Abstract, value: tokens.form.Abstract },
  { label: tokens.form.ArtNouveau, value: tokens.form.ArtNouveau },
  { label: tokens.form.Baroque, value: tokens.form.Baroque },
  { label: tokens.form.Bauhaus, value: tokens.form.Bauhaus },
  { label: tokens.form.Cubism, value: tokens.form.Cubism },
  { label: tokens.form.Dadaism, value: tokens.form.Dadaism },
  { label: tokens.form.Expressionism, value: tokens.form.Expressionism },
  { label: tokens.form.Fauvism, value: tokens.form.Fauvism },
  { label: tokens.form.Minimalism, value: tokens.form.Minimalism },
  { label: tokens.form.Modernism, value: tokens.form.Modernism },
  { label: tokens.form.NeoClassicism, value: tokens.form.NeoClassicism },
  { label: tokens.form.NeoExpressionism, value: tokens.form.NeoExpressionism },
  { label: tokens.form.OpArt, value: tokens.form.OpArt },
  { label: tokens.form.PopArt, value: tokens.form.PopArt },
  { label: tokens.form.OilPainting, value: tokens.form.OilPainting },
  { label: tokens.form.PhotoIllustration, value: tokens.form.PhotoIllustration },
  { label: tokens.form.WaterColor, value: tokens.form.WaterColor },
  { label: tokens.form.Charcoal, value: tokens.form.Charcoal },
  { label: tokens.form.ColoredPencils, value: tokens.form.ColoredPencils },
  { label: tokens.form.Cartoon, value: tokens.form.Cartoon },
  { label: tokens.form.PixelArt, value: tokens.form.PixelArt },
  { label: tokens.form.Graffiti, value: tokens.form.Graffiti },
  { label: tokens.form.Tattoo, value: tokens.form.Tattoo },
  { label: tokens.form.ConceptualArt, value: tokens.form.ConceptualArt },
  { label: tokens.form.KineticArt, value: tokens.form.KineticArt },
  { label: tokens.form.LyricalAbstraction, value: tokens.form.LyricalAbstraction },
  { label: tokens.form.Orphism, value: tokens.form.Orphism },
  { label: tokens.form.Precisionism, value: tokens.form.Precisionism },
  { label: tokens.form.Primitivism, value: tokens.form.Primitivism },
  { label: tokens.form.Suprematism, value: tokens.form.Suprematism },
  { label: tokens.form.Synthetism, value: tokens.form.Synthetism },
  { label: tokens.form.Futurism, value: tokens.form.Futurism },
  { label: tokens.form.Constructivism, value: tokens.form.Constructivism },
  { label: tokens.form.Tachisme, value: tokens.form.Tachisme },
  { label: tokens.form.NewRealism, value: tokens.form.NewRealism },
  { label: tokens.form.PostModernism, value: tokens.form.PostModernism },
  { label: tokens.form.PostImpressionism, value: tokens.form.PostImpressionism },
  { label: tokens.form.Renaissance, value: tokens.form.Renaissance },
  { label: tokens.form.Rococo, value: tokens.form.Rococo },
  { label: tokens.form.Romanticism, value: tokens.form.Romanticism },
  { label: tokens.form.Symbolism, value: tokens.form.Symbolism },
  { label: tokens.form.Victorian, value: tokens.form.Victorian },
  { label: tokens.form.AbstractExpressionism, value: tokens.form.AbstractExpressionism },



  // ... add more as needed
];

const themeOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Adventure, value: tokens.form.Adventure },
  { label: tokens.form.Tranquility, value: tokens.form.Tranquility },
  { label: tokens.form.Urban, value: tokens.form.Urban },
  { label: tokens.form.Love, value: tokens.form.Love },
  { label: tokens.form.Conflict, value: tokens.form.Conflict },
  { label: tokens.form.Beauty, value: tokens.form.Beauty },
  { label: tokens.form.Nature, value: tokens.form.Nature },
  { label: tokens.form.Technology, value: tokens.form.Technology },
  { label: tokens.form.Time, value: tokens.form.Time },
  { label: tokens.form.Identity, value: tokens.form.Identity },
  { label: tokens.form.Mythology, value: tokens.form.Mythology },
  { label: tokens.form.Power, value: tokens.form.Power },
  { label: tokens.form.Freedom, value: tokens.form.Freedom },
  { label: tokens.form.Transformation, value: tokens.form.Transformation },
  { label: tokens.form.Desire, value: tokens.form.Desire },
  { label: tokens.form.Memory, value: tokens.form.Memory },
  { label: tokens.form.Mortality, value: tokens.form.Mortality },
  { label: tokens.form.Happiness, value: tokens.form.Happiness },
  { label: tokens.form.Spirituality, value: tokens.form.Spirituality },
  { label: tokens.form.Humanity, value: tokens.form.Humanity },
  { label: tokens.form.Chaos, value: tokens.form.Chaos },
  { label: tokens.form.Order, value: tokens.form.Order },
  { label: tokens.form.TheFuture, value: tokens.form.TheFuture },
  { label: tokens.form.ThePast, value: tokens.form.ThePast },
  { label: tokens.form.ThePresent, value: tokens.form.ThePresent },
  { label: tokens.form.Dreams, value: tokens.form.Dreams },
  { label: tokens.form.Fantasy, value: tokens.form.Fantasy },
  { label: tokens.form.Landscape, value: tokens.form.Landscape },
  { label: tokens.form.Portraiture, value: tokens.form.Portraiture },
  { label: tokens.form.StillLife, value: tokens.form.StillLife },
  { label: tokens.form.Cityscape, value: tokens.form.Cityscape },
  { label: tokens.form.Seascape, value: tokens.form.Seascape },
  { label: tokens.form.Figurative, value: tokens.form.Figurative },
  { label: tokens.form.Cultural, value: tokens.form.Cultural },
  { label: tokens.form.Historical, value: tokens.form.Historical },
  { label: tokens.form.Political, value: tokens.form.Political },
  { label: tokens.form.Symbolic, value: tokens.form.Symbolic },
  { label: tokens.form.Geometric, value: tokens.form.Geometric },
  { label: tokens.form.Pattern, value: tokens.form.Pattern },
  { label: tokens.form.Urban, value: tokens.form.Urban },
  { label: tokens.form.Rural, value: tokens.form.Rural },
  { label: tokens.form.Industrial, value: tokens.form.Industrial },
  { label: tokens.form.SciFi, value: tokens.form.SciFi },
  { label: tokens.form.Nostalgia, value: tokens.form.Nostalgia },
  { label: tokens.form.Minimalism, value: tokens.form.Minimalism },
  { label: tokens.form.Expressionism, value: tokens.form.Expressionism },
  { label: tokens.form.PopArt, value: tokens.form.PopArt },
  { label: tokens.form.Surreal, value: tokens.form.Surreal },
  { label: tokens.form.Whimsical, value: tokens.form.Whimsical },


  // ... add more as needed
];



export const ImageGenerator: FC = () => {
  useProtectedPage();


  const { imageSubmit, openAIResponse, isLoading } = useImageSubmit();
  const [artist, setArtist] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [object, setObject] = useState<string>('');
 const [extra , setExtra] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [userPlan] = useState<PlanType | null>(null);

    const { t } = useTranslation();




  useEffect(() => {
    if (artist && style && theme && object ) {
      const artistText = artist !== '' ? `${t(artist)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const themeText = theme !== '' ? `${t(theme)} ` : '';
      const objectText = object !== '' ? `${t(object)}` : '';
      const extraText = extra !== '' ? `${t(extra)}` : '';

      const newPrompt = t(tokens.form.imagePrompts)
        .replace('[artist]', artistText)
        .replace('[style]', styleText)
        .replace('[theme]', themeText)
         .replace('[object]', objectText)
        .replace('[extra]', extraText);


      console.log('New Prompt:', newPrompt); // Log the new prompt to the console
      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [artist, style, theme, object, extra, t]);


  type PlanType = "Basic" | "Premium" | "Business" | "BasicYearly" | "PremiumYearly" | "BusinessYearly";

  const { totalUsage } = useMemoryUsage(); // Fetch memory usage from context

  let memoryLimit: number;

// Dynamically determine the memory limit based on the user's plan
  switch (userPlan) {
    case "Basic":
    case "BasicYearly":
      memoryLimit = 100;
      break;
    case "Premium":
    case "PremiumYearly":
      memoryLimit = 200;
      break;
    case "Business":
    case "BusinessYearly":
      memoryLimit = 500;
      break;
    default:
      memoryLimit = 500; // Default fallback for unknown plans
  }

// Check if the Save button should be disabled
  const disableSaveButton = totalUsage >= memoryLimit;

// Debugging: Log values to ensure they are correct
  console.log("User Plan:", userPlan);
  console.log("Total Usage:", totalUsage, "MB");
  console.log("Memory Limit:", memoryLimit, "MB");
  console.log("Disable Save Button:", disableSaveButton);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions */}
        <Typography variant="body2">
          {t(tokens.form.imageInstructions)}
        </Typography>

        <Stack  spacing={3}>
          <TextField
            label={t(tokens.form.object)}
            name="object"
            value={object}
            onChange={(e) => setObject(e.target.value)}
            multiline
            rows={1}
            fullWidth
          >

          </TextField>
          <TextField
            label={t(tokens.form.artist)}
            name="artist"
            select
            SelectProps={{ native: true }}
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            fullWidth

          >
            {artistOptions.map((option) => (
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

        {/* Theme and Object side by side */}
        <Stack spacing={3}>
          <TextField
            label={t(tokens.form.theme)}
            name="theme"
            select
            SelectProps={{ native: true }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            fullWidth

          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>

        </Stack>
          <Stack spacing={1}>
          <TextField
            fullWidth
            label={t(tokens.form.extraInfo)}
            name="extra"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            multiline
            rows={1}
          >
          </TextField>
        </Stack>





      </Stack>
        <Box sx={{ mt: 3 }}>
          <Button
            onClick={() => imageSubmit(prompt, 1)}
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      {openAIResponse && openAIResponse.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <label>{t(tokens.form.yourImage)}</label>
          {openAIResponse.map((url, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Image
                src={url}
                alt={`Generated Art ${index + 1}`}
                width={500} // Replace with the actual width of your image
                height={500} // Replace with the actual height of your image
                style={{ width: '100%', marginBottom: '30px' }}
              />
              {/* Conditionally render the Save Image button */}
              {!disableSaveButton ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveImage(url, index)}
                  style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
                >
                  {t(tokens.form.saveImage)}
                </Button>
              ) : (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ marginTop: '10px', textAlign: 'center' }}
                >
                  You have reached your memory limit. Please delete some images to save new ones.
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}




