import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import TextImageSubmit from "./textimage-submit";
import { auth } from 'src/libs/firebase';


type Option = {
    label: string;
    value: string;
};



const authorOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.noAuthor, value: 'neutral' },
  { label: 'Dr. Seuss', value: 'Dr. Seuss' },
  { label: 'J.K. Rowling', value: 'J.K. Rowling' },
  { label: 'Roald Dahl', value: 'Roald Dahl' },
  { label: 'Eric Carle', value: 'Eric Carle' },
  { label: 'Beverly Cleary', value: 'Beverly Cleary' },
  { label: 'Maurice Sendak', value: 'Maurice Sendak' },
  { label: 'C.S. Lewis', value: 'C.S. Lewis' },
  { label: 'Lewis Carroll', value: 'Lewis Carroll' },
  { label: 'E.B. White', value: 'E.B. White' },
  { label: 'Astrid Lindgren', value: 'Astrid Lindgren' },
  { label: 'Lemony Snicket', value: 'Lemony Snicket' },
  { label: 'Judy Blume', value: 'Judy Blume' },
  { label: 'Hans Christian Andersen', value: 'Hans Christian Andersen' },
  { label: 'Enid Blyton', value: 'Enid Blyton' },
  { label: 'Beatrix Potter', value: 'Beatrix Potter' },
  { label: 'Shel Silverstein', value: 'Shel Silverstein' },
  { label: 'Jeff Kinney', value: 'Jeff Kinney' },
  { label: 'Rick Riordan', value: 'Rick Riordan' },

  // ... add more as needed
];



const genreOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Fantasy, value: tokens.form.Fantasy },
  { label: tokens.form.ScienceFiction, value: tokens.form.ScienceFiction },
  { label: tokens.form.Mystery, value: tokens.form.Mystery },
  { label: tokens.form.Adventure, value: tokens.form.Adventure },
  { label: tokens.form.RealisticFiction, value: tokens.form.RealisticFiction },
  { label: tokens.form.HistoricalFiction, value: tokens.form.HistoricalFiction },
  { label: tokens.form.FairyTales, value: tokens.form.FairyTales },
  { label: tokens.form.Folklore, value: tokens.form.Folklore },
  { label: tokens.form.GraphicNovel, value: tokens.form.GraphicNovel },
  { label: tokens.form.Poetry, value: tokens.form.Poetry },
  { label: tokens.form.NonFiction, value: tokens.form.NonFiction },
  { label: tokens.form.Biography, value: tokens.form.Biography },
  { label: tokens.form.PictureBooks, value: tokens.form.PictureBooks },
  { label: tokens.form.AnimalStories, value: tokens.form.AnimalStories },
  { label: tokens.form.BedtimeStories, value: tokens.form.BedtimeStories },
  { label: tokens.form.Educational, value: tokens.form.Educational },


];

const styleOptions: Option[] = [
  { label: '', value: '' },

  { label: tokens.form.Narrative, value: tokens.form.Narrative },
  { label: tokens.form.Descriptive, value: tokens.form.Descriptive },
  { label: tokens.form.Humorous, value: tokens.form.Humorous },
  { label: tokens.form.Fantasy, value: tokens.form.Fantasy },
  { label: tokens.form.Scary, value: tokens.form.Scary },
  { label: tokens.form.Adventure, value: tokens.form.Adventure },
  { label: tokens.form.FairyTale, value: tokens.form.FairyTale },
  { label: tokens.form.Rhyming, value: tokens.form.Rhyming },
  { label: tokens.form.Educational, value: tokens.form.Educational },
  { label: tokens.form.Mythical, value: tokens.form.Mythical },
  { label: tokens.form.Folkloric, value: tokens.form.Folkloric },
  { label: tokens.form.Interactive, value: tokens.form.Interactive },
  { label: tokens.form.ActionPacked, value: tokens.form.ActionPacked },
  { label: tokens.form.Moral, value: tokens.form.Moral },

];

const moodOptions: Option[] = [
  { label: '', value: '' },
  { label: tokens.form.Joyful, value: tokens.form.Joyful },
  { label: tokens.form.Serene, value: tokens.form.Serene },
  { label: tokens.form.Sad, value: tokens.form.Sad },
  { label: tokens.form.Excited, value: tokens.form.Excited },
  { label: tokens.form.Relaxed, value: tokens.form.Relaxed },
  { label: tokens.form.Nostalgic, value: tokens.form.Nostalgic },
  { label: tokens.form.Energetic, value: tokens.form.Energetic },
  { label: tokens.form.Passionate, value: tokens.form.Passionate },
  { label: tokens.form.Optimistic, value: tokens.form.Optimistic },
];




export const StoryGenerator: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [author, setAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(100);
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();



  useEffect(() => {
    // Check if all selections are made
    if (genre && style && mood && duration) {
      let newPrompt = t(tokens.form.writeStory);
      const authorText = ` ${t(author)}`;
      const genreText = ` ${t(genre)}`;
      const styleText = ` ${t('')} ${t(style)} ${t('')}`;
      const moodText = ` ${t('')} ${t(mood)} ${t('')}`;

      newPrompt = newPrompt
        .replace('[author]', authorText)
        .replace('[genre]', genreText)
        .replace('[style]', styleText)
        .replace('[mood]', moodText)
        .replace('[duration]', `${duration} ${t('')}`);

      setPrompt(newPrompt.trim());
    } else {
      // If not all selections are made, keep the prompt empty
      setPrompt('');
    }
  }, [author,  genre, style, mood, duration, t]);


  const handleSaveStoryAndImage = (text: string, imageUrl: string, index: number) => {
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    if (uid === null) {
      alert('User is not authenticated');
      return;
    }

    // Send a POST request to your server with the text, image URL, and UID
    fetch('/api/upload-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ story: text, imageUrl: imageUrl, uid }),
    })
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            console.log(`Story and image saved. Image URL: ${data.url}`);
          } else {
            console.error('Failed to save story and image:', data.error);
          }
        })
        .catch(error => {
          console.error('Error saving story and image:', error);
        });
  };





  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.author)}
          name="author"
          select
          SelectProps={{ native: true }}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        >
          {authorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.genre)}
          name="genre"
          select
          SelectProps={{ native: true }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genreOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.style)}
          name="style"
          select
          SelectProps={{ native: true }}
          value={style}
          onChange={(e) => setTheme(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label={t(tokens.form.mood)}
          name="mood"
          select
          SelectProps={{ native: true }}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <div>
          <label>{t(tokens.form.words)}</label>
          <Slider
            value={duration / 100} // Convert the word count to the slider's scale
            min={1}
            max={4}
            step={0.5} // The slider's step
            onChange={(_, newValue) => setDuration(newValue as number * 100)} // Convert back to words on change
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
                      <label>{t(tokens.headings.yourStory)}</label>
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
                      <Box key={index} sx={{ mt: 2 }}>
                        <img src={image} alt={`Generated Art ${index + 1}`} style={{ width: '100%', marginBottom: '10px' }} />

                        {/* Button for saving story and image */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              if (textResponse !== null) {
                                handleSaveStoryAndImage(textResponse, image, index);
                              } else {
                                // Handle the case where textResponse is null
                                // For example, display an alert or pass an empty string
                                console.log("No story to save");
                              }
                            }}
                        >
                          Save Story and Image
                        </Button>
                      </Box>
                  ))}
                </Box>
            )}
          </Box>
      </Box>
  );
}

