import type { FC } from 'react';
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useImageSubmit from './image-submit';
import { auth } from 'src/libs/firebase';





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
    { label: tokens.form.Photorealism, value: 'photorealism' },
    { label: tokens.form.Realism, value: 'realism' },
    { label: tokens.form.Impressionism, value: 'impressionism' },
    { label: tokens.form.Surrealism, value: 'surrealism' },
    { label: tokens.form.Abstract, value: 'abstract' },
    { label: tokens.form.ArtNouveau, value: 'art_nouveau' },
    { label: tokens.form.Baroque, value: 'baroque' },
    { label: tokens.form.Bauhaus, value: 'bauhaus' },
    { label: tokens.form.Cubism, value: 'cubism' },
    { label: tokens.form.Dadaism, value: 'dadaism' },
    { label: tokens.form.Expressionism, value: 'expressionism' },
    { label: tokens.form.Fauvism, value: 'fauvism' },
    { label: tokens.form.Minimalism, value: 'minimalism' },
    { label: tokens.form.Modernism, value: 'modernism' },
    { label: tokens.form.NeoClassicism, value: 'neo_classicism' },
    { label: tokens.form.NeoExpressionism, value: 'neo_expressionism' },
    { label: tokens.form.OpArt, value: 'op_art' },
    { label: tokens.form.PopArt, value: 'pop_art' },
  { label: tokens.form.OilPainting, value: 'oil painting' },
  { label: tokens.form.PhotoIllustration, value: 'photo illustration' },
  { label: tokens.form.WaterColor, value: 'water color' },
  { label: tokens.form.Charcoal, value: 'charcoal' },
  { label: tokens.form.ColoredPencils, value: 'colored pencils' },
  { label: tokens.form.Cartoon, value: 'cartoon' },
  { label: tokens.form.PixelArt, value: 'pixel art' },
  { label: tokens.form.Graffiti, value: 'graffiti' },
  { label: tokens.form.Tattoo, value: 'tattoo' },
  { label: tokens.form.ConceptualArt, value: 'conceptual art' },
  { label: tokens.form.KineticArt, value: 'kinetic art' },
  { label: tokens.form.LyricalAbstraction, value: 'lyrical abstraction' },
  { label: tokens.form.Orphism, value: 'orphism' },
  { label: tokens.form.Precisionism, value: 'precisionism' },
  { label: tokens.form.Primitivism, value: 'primitivism' },
  { label: tokens.form.Suprematism, value: 'suprematism' },
  { label: tokens.form.Synthetism, value: 'synthetism' },
  { label: tokens.form.Futurism, value: 'futurism' },
  { label: tokens.form.Constructivism, value: 'constructivism' },
  { label: tokens.form.Tachisme, value: 'tachisme' },
  { label: tokens.form.NewRealism, value: 'new realism' },
  { label: tokens.form.PostModernism, value: 'post modernism' },

  { label: tokens.form.PostImpressionism, value: 'post impressionism' },
    { label: tokens.form.PostModernism, value: 'post modernism' },
   { label: tokens.form.Renaissance, value: 'renaissance' },
    { label: tokens.form.Rococo, value: 'rococo' },
    { label: tokens.form.Romanticism, value: 'romanticism' },
    { label: tokens.form.Symbolism, value: 'symbolism' },
    { label: tokens.form.Victorian, value: 'victorian' },
    { label: tokens.form.AbstractExpressionism, value: 'abstract expressionism' },
  { label: tokens.form.ConceptualArt, value: 'conceptual art' },


  // ... add more as needed
];

const themeOptions: Option[] = [
    { label: '', value: '' },
  { label: tokens.form.Adventure, value: 'adventure' },
  { label: tokens.form.Tranquility, value: 'tranquil' },
  { label: tokens.form.Urban, value: 'urban' },
  { label: tokens.form.Love, value: 'love' },
  { label: tokens.form.Conflict, value: 'conflict' },
  { label: tokens.form.Beauty, value: 'beauty' },
  { label: tokens.form.Nature, value: 'nature' },
  { label: tokens.form.Technology, value: 'technology' },
  { label: tokens.form.Time, value: 'time' },
  { label: tokens.form.Identity, value: 'identity' },
  { label: tokens.form.Mythology, value: 'mythology' },
  { label: tokens.form.Adventure, value: 'adventure' },
  { label: tokens.form.Power, value: 'power' },
  { label: tokens.form.Freedom, value: 'freedom' },
  { label: tokens.form.Transformation, value: 'transformation' },
  { label: tokens.form.Desire, value: 'desire' },
  { label: tokens.form.Memory, value: 'memory' },
  { label: tokens.form.Mortality, value: 'mortality' },
  { label: tokens.form.Happiness, value: 'happiness' },
  { label: tokens.form.Spirituality, value: 'spirituality' },
  { label: tokens.form.Humanity, value: 'humanity' },
  { label: tokens.form.Chaos, value: 'chaos' },
  { label: tokens.form.Order, value: 'order' },
  { label: tokens.form.TheFuture, value: 'The future' },
  { label: tokens.form.ThePast, value: 'The past' },
  { label: tokens.form.ThePresent, value: 'the present' },
  { label: tokens.form.Dreams, value: 'dreams' },
  { label: tokens.form.Fantasy, value: 'fantasy' },
  { label: tokens.form.Landscape, value: 'landscape' },
  { label: tokens.form.Portraiture, value: 'portraiture' },
  { label: tokens.form.StillLife, value: 'Still life' },
  { label: tokens.form.Cityscape, value: 'cityscape' },
  { label: tokens.form.Seascape, value: 'seascape' },
  { label: tokens.form.Figurative, value: 'figurative' },
  { label: tokens.form.Cultural, value: 'cultural' },
  { label: tokens.form.Historical, value: 'historical' },
  { label: tokens.form.Political, value: 'political' },
  { label: tokens.form.Symbolic, value: 'symbolic' },
  { label: tokens.form.Geometric, value: 'geometric' },
  { label: tokens.form.Pattern, value: 'pattern' },
  { label: tokens.form.Urban, value: 'urban' },
  { label: tokens.form.Rural, value: 'rural' },
  { label: tokens.form.Industrial, value: 'industrial' },
  { label: tokens.form.SciFi, value: 'sci_fi' },
  { label: tokens.form.Nostalgia, value: 'nostalgia' },
  { label: tokens.form.Minimalism, value: 'minimalism' },
  { label: tokens.form.Expressionism, value: 'expressionism' },
  { label: tokens.form.PopArt, value: 'pop_art' },
  { label: tokens.form.Surreal, value: 'surreal' },
  { label: tokens.form.Whimsical, value: 'whimsical' },

  // ... add more as needed
];


const objectOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Kangaroo', value: 'kangaroo' },
  { label: 'Koala', value: 'koala' },
  { label: 'Rainbow lorikeet', value: 'rainbow lorikeet' },


  // ... add more as needed
];

export const ImageGenerator: FC = () => {



  const { imageSubmit, openAIResponse, isLoading } = useImageSubmit();
  const [artist, setArtist] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [object, setObject] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');


    const { t } = useTranslation();




  useEffect(() => {
    if (artist && style && theme) {
      const artistText = artist !== '' ? `${t(artist)} ` : '';
      const styleText = style !== '' ? `${t(style)} ` : '';
      const themeText = theme !== '' ? `${t(theme)} ` : '';
      const objectText = object !== '' ? `${t(object)}` : '';

      const newPrompt = t(tokens.form.imagePrompts)
        .replace('[artist]', artistText)
        .replace('[style]', styleText)
        .replace('[theme]', themeText)
         .replace('[object]', objectText);

      console.log('New Prompt:', newPrompt); // Log the new prompt to the console
      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [artist, style, theme, object, t]);


  const handleSaveImage = (url: string, index: number) => {
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    if (uid === null) {
      alert('User is not authenticated');
      return;
    }

    // Send a POST request to your server with the image URL and UID
    fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: url, uid }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          console.log(`Image saved to Firebase Storage. URL: ${data.url}`);
        } else {
          console.error('Failed to save image:', data.error);
        }
      })
      .catch(error => {
        console.error('Error saving image:', error);
      });
  };



  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* Instructions */}
        <Typography variant="body2">
          {t(tokens.form.imageInstructions)}
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.artist)}
            name="artist"
            select
            SelectProps={{ native: true }}
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
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
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        {/* Theme and Object side by side */}
        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.theme)}
            name="theme"
            select
            SelectProps={{ native: true }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.object)}
            name="object"
             value={object}
            onChange={(e) => setObject(e.target.value)}
            multiline
            rows={1}
            sx={{ width: 'calc(50% - 8px)' }} // Apply the same width to this field
          >
            {objectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)} {/* Apply translation here */}
              </option>
            ))}
          </TextField>
        </Stack>

        <TextField
          fullWidth
          label={t(tokens.form.prompts)}
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)} // Add this line
          multiline
          rows={4}
        />


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
        <Box sx={{ mt: 3 }}>
          <label>{t(tokens.form.yourImage)}</label>
          {openAIResponse.map((url, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <img src={url} alt={`Generated Art ${index + 1}`} style={{ width: '100%', marginBottom: '10px' }} />
              {/* Remove the anchor tag from here */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSaveImage(url, index)}
              >
                {t(tokens.form.saveImage)}
              </Button>
              {/* Anchor tag removed */}
            </Box>
          ))}
        </Box>
      )}

    </Box>
  );
}



