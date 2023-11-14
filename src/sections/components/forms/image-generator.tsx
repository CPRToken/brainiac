import type { FC } from 'react';
import {useEffect, useState} from 'react';
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
  { label: 'No Artist (For realistic images)', value: 'neutral' },
    { label: 'Leonardo Da Vinci', value: 'Leonardo Da Vinci' },
  { label: 'Vincent Van Gogh', value: 'Vincent Van Gogh' },
  { label: 'Pablo Picasso', value: 'Pablo Picasso' },
  { label: 'Claude Monet', value: 'Claude Monet' },
  { label: 'Michelangelo', value: 'Michelangelo' },
  { label: 'Rembrandt', value: 'Rembrandt' },
  { label: 'Salvador Dali', value: 'Salvador Dali' },
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
  { label: 'Photorealism', value: 'photorealism' },
  { label: 'Realism', value: 'realism' },
  { label: 'Impressionism', value: 'impressionism' },
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
   { label: 'Symbolism', value: 'symbolism' },
  { label: 'Victorian', value: 'victorian' },
  { label: 'Abstract Expressionism', value: 'abstract_expressionism' },


  // ... add more as needed
];

const themeOptions: Option[] = [
    { label: '', value: '' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Tranquility', value: 'tranquility' },
  { label: 'Urban', value: 'urban' },
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


const objectOptions: Option[] = [
  { label: '', value: '' },
  { label: 'Kangaroo', value: 'kangaroo' },
  { label: 'Koala', value: 'koala' },
  { label: 'Rainbow lorikeet', value: 'rainbow lorikeet' },
  { label: 'Lion', value: 'lion' },
  { label: 'Elephant', value: 'elephant' },
  { label: 'Giraffe', value: 'giraffe' },
  { label: 'Tiger', value: 'tiger' },
  { label: 'Dolphin', value: 'dolphin' }, { label: 'Horse', value: 'horse' },
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Bird', value: 'bird' },
  { label: 'Fish', value: 'fish' },
  { label: 'Whale', value: 'whale' },
  { label: 'Tyrannosaurus Rex', value: 'tyrannosaurus_rex' },
  { label: 'Triceratops', value: 'triceratops' },
  { label: 'Stegosaurus', value: 'stegosaurus' },
  { label: 'Brachiosaurus', value: 'brachiosaurus' },
  { label: 'Velociraptor', value: 'velociraptor' },
  { label: 'Pterodactyl', value: 'pterodactyl' },
  { label: 'Ankylosaurus', value: 'ankylosaurus' },
  { label: 'Diplodocus', value: 'diplodocus' },
  { label: 'Spinosaurus', value: 'spinosaurus' },
  { label: 'Allosaurus', value: 'allosaurus' },
  { label: 'Flowers', value: 'flowers' },
  { label: 'Mountains', value: 'mountains' },
  { label: 'Desert', value: 'desert' },
  { label: 'Sunset', value: 'sunset' },
  { label: 'Cityscape', value: 'cityscape' },
  { label: 'Beach', value: 'beach' },
  { label: 'Forest', value: 'forest' },
  { label: 'Space', value: 'space' },
  { label: 'Waterfall', value: 'waterfall' },
  { label: 'Rainforest', value: 'rainforest' },
  { label: 'Countryside', value: 'countryside' },
   { label: 'Soccer', value: 'soccer' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Baseball', value: 'baseball' },
  { label: 'Guitar', value: 'guitar' },
  { label: 'Piano', value: 'piano' },
  { label: 'Violin', value: 'violin' },
  { label: 'Computer', value: 'computer' },
  { label: 'Book', value: 'book' },
  { label: 'Camera', value: 'camera' },
  { label: 'Car', value: 'car' },
  { label: 'Bicycle', value: 'bicycle' },
  { label: 'Train', value: 'train' },
  { label: 'Plane', value: 'plane' },
  { label: 'Ship', value: 'ship' },
  { label: 'Sailboat', value: 'sailboat' },
  { label: 'Sunflower', value: 'sunflower' },
  { label: 'Butterfly', value: 'butterfly' },
  { label: 'Dragonfly', value: 'dragonfly' },
  { label: 'Mountain Bike', value: 'mountain_bike' },
  { label: 'Surfboard', value: 'surfboard' },
  { label: 'Snowboard', value: 'snowboard' },
  { label: 'Skateboard', value: 'skateboard' },
  { label: 'Pizza', value: 'pizza' },
  { label: 'Coffee', value: 'coffee' },
  { label: 'Tea', value: 'tea' },
  { label: 'Ice Cream', value: 'ice_cream' },
  { label: 'Pizza', value: 'pizza' },
  { label: 'Burger', value: 'burger' },
  { label: 'Hot Dog', value: 'hot_dog' },
  { label: 'Sushi', value: 'sushi' },
  { label: 'Taco', value: 'taco' },
  { label: 'Ferris Wheel', value: 'ferris_wheel' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Roller Coaster', value: 'roller_coaster' },
  { label: 'Spaceship', value: 'spaceship' },
  { label: 'Astronaut', value: 'astronaut' },
  { label: 'Robot', value: 'robot' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'UFO', value: 'ufo' },
  { label: 'Planet', value: 'planet' },
  { label: 'Aurora', value: 'aurora' },
  { label: 'Waterfall', value: 'waterfall' },
  { label: 'Volcano', value: 'volcano' },
  { label: 'Castle', value: 'castle' },
  { label: 'Sword', value: 'sword' },


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
      const artistText = artist !== '' ? `${t(artist)} artist` : '';
      const styleText = style !== '' ? `${t(style)} style` : '';
      const themeText = theme !== '' ? `${t(theme)} theme` : '';
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
                {option.label}
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
                {option.label}
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
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            label={t(tokens.form.object)}
            name="object"
            select
            SelectProps={{ native: true }}
            value={object}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            sx={{ width: 'calc(50% - 8px)' }}
          >
            {objectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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



