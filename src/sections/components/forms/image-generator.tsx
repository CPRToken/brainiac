import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import useImageSubmit from './image-submit';

type Option = {
    label: string;
    value: string;
};

const artistOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Leonardo Da Vinci', value: 'Leonardo Da Vinci' },
  { label: 'Vincent Van Gogh', value: 'Vincent Van Gogh' },
  { label: 'Pablo Picasso', value: 'Pablo Picasso' },
  { label: 'Claude Monet', value: 'Claude Monet' },
  { label: 'Michelangelo', value: 'Michelangelo' },
  { label: 'Rembrandt', value: 'Rembrandt' },
  { label: 'Salvador Dali', value: 'Salvador Dali' },
  { label: 'Frida Kahlo', value: 'Frida Kahlo' },
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
    { label: 'Surrealism', value: 'surrealism' },
  { label: 'Abstract', value: 'abstract' },
  { label: 'Art Nouveau', value: 'art_nouveau' },
  { label: 'Baroque', value: 'baroque' },
  { label: 'Bauhaus', value: 'bauhaus' },
  { label: 'Cubism', value: 'cubism' },
  { label: 'Dadaism', value: 'dadaism' },
  { label: 'Expressionism', value: 'expressionism' },
  { label: 'Fauvism', value: 'fauvism' },
  { label: 'Impressionism', value: 'impressionism' },
  { label: 'Minimalism', value: 'minimalism' },
  { label: 'Modernism', value: 'modernism' },
  { label: 'Neo-Classicism', value: 'neo_classicism' },
  { label: 'Neo-Expressionism', value: 'neo_expressionism' },
  { label: 'Op Art', value: 'op_art' },
  { label: 'Pop Art', value: 'pop_art' },
  { label: 'Post-Impressionism', value: 'post_impressionism' },
  { label: 'Post-Modernism', value: 'post_modernism' },
  { label: 'Realism', value: 'realism' },
  { label: 'Renaissance', value: 'renaissance' },
  { label: 'Rococo', value: 'rococo' },
  { label: 'Romanticism', value: 'romanticism' },
  { label: 'Surrealism', value: 'surrealism' },
  { label: 'Symbolism', value: 'symbolism' },
  { label: 'Victorian', value: 'victorian' },
  { label: 'Abstract Expressionism', value: 'abstract_expressionism' },


  // ... add more as needed
];

const themeOptions: Option[] = [
    { label: '', value: '' },
  { label: 'Love', value: 'love' },
  { label: 'Conflict', value: 'conflict' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Nature', value: 'nature' },
  { label: 'Technology', value: 'technology' },
  { label: 'Time', value: 'time' },
  { label: 'Identity', value: 'identity' },
  { label: 'Mythology', value: 'mythology' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Power', value: 'power' },
  { label: 'Freedom', value: 'freedom' },
  { label: 'Transformation', value: 'transformation' },
  { label: 'Desire', value: 'desire' },
  { label: 'Memory', value: 'memory' },
  { label: 'Mortality', value: 'mortality' },
  { label: 'Happiness', value: 'happiness' },
  { label: 'Spirituality', value: 'spirituality' },
  { label: 'Humanity', value: 'humanity' },
  { label: 'Chaos', value: 'chaos' },
  { label: 'Order', value: 'order' },
  { label: 'The Future', value: 'the_future' },
  { label: 'The Past', value: 'the_past' },
  { label: 'The Present', value: 'the_present' },
  { label: 'Dreams', value: 'dreams' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portraiture', value: 'portraiture' },
  { label: 'Still Life', value: 'still_life' },
  { label: 'Animals', value: 'animals' },
  { label: 'Cityscape', value: 'cityscape' },
  { label: 'Seascape', value: 'seascape' },
  { label: 'Figurative', value: 'figurative' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Historical', value: 'historical' },
  { label: 'Political', value: 'political' },
  { label: 'Symbolic', value: 'symbolic' },
  { label: 'Geometric', value: 'geometric' },
  { label: 'Pattern', value: 'pattern' },
  { label: 'Urban', value: 'urban' },
  { label: 'Rural', value: 'rural' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Sci-Fi', value: 'sci_fi' },
  { label: 'Nostalgia', value: 'nostalgia' },
  { label: 'Minimalism', value: 'minimalism' },
  { label: 'Expressionism', value: 'expressionism' },
  { label: 'Pop Art', value: 'pop_art' },
  { label: 'Surreal', value: 'surreal' },
  { label: 'Whimsical', value: 'whimsical' },

  // ... add more as needed
];



export const ImageGenerator: FC = () => {



  const { imageSubmit, openAIResponse } = useImageSubmit();
  const [artist, setArtist] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [complexity, setComplexity] = useState<number>(2.5);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();


  useEffect(() => {
    if (artist && style && theme && complexity) {
      // Update the text according to your new prompt structure
      const artistText = artist !== '' ? `${t(artist)} artist` : '';
      const styleText = style !== '' ? `${t(style)} style` : '';
      const themeText = theme !== '' ? `${t(theme)} theme` : '';

      // Determine the complexity text based on the slider value
      let complexityText = '';
      if(complexity === 1) {
        complexityText = 'simple';
      } else if(complexity === 2) {
        complexityText = 'moderate';
      } else if(complexity >= 3) {
        complexityText = 'complex';
      }

      const newPrompt = t(tokens.form.imagePrompts)
        .replace('[artist]', artistText)
        .replace('[style]', styleText)
        .replace('[theme]', themeText)
        .replace('[duration]', complexityText);

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [artist, style, theme, complexity, t]);










  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Artist "
          name="artist"
          select
          SelectProps={{ native: true }}
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        >
          {artistOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Style"
          name="style"
          select
          SelectProps={{ native: true }}
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Theme"
          name="theme"
          select
          SelectProps={{ native: true }}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>Complexity</label>
          <Slider
            value={complexity}
            min={1}
            max={3}
            step={1}
            marks={[
              { value: 1, label: 'Simple' },
              { value: 2, label: 'Moderate' },
              { value: 3, label: 'Complex' }
            ]}
            onChange={(_, newValue) => setComplexity(newValue as number)}
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
            onClick={() => imageSubmit(prompt)}
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
              <label>Your Image:</label>
              <img src={openAIResponse} alt="Generated Art" style={{ width: '100%', marginTop: '10px' }} />
            </>
          )}
        </Box>



      </Box>

);
};

