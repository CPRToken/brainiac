import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {CustomSlider} from "../slider/slider";
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import TextImageSubmit from "./textimage-submit";
import {saveTextImage } from "../buttons/saveTextImage";
import {useProtectedPage} from "../../../hooks/use-protectedpage";


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
  useProtectedPage();


  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
  const [author, setAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(100);
  const [title, setTitle] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  const submitToOpenAI = () => {

    if (prompt) {
      // Submit the prompt that is updated by the useEffect hook
      combinedSubmit(prompt, maxTokens)
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
    // Check if all selections are made
    if (author && genre && style && mood && duration !== null) {

      let newPrompt = t(tokens.form.writeStory);
      const authorText = ` ${t(author)}`;
      const genreText = ` ${t(genre)}`;
      const styleText = ` ${t('')} ${t(style)} ${t('')}`;
      const moodText = ` ${t('')} ${t(mood)} ${t('')}`;


      const authorWords = authorText.split(' ');
      const genreWords = genreText.split(' ');

      const title = authorWords.slice(0, 2).concat(genreWords.slice(0, 2)).join(' ');


      newPrompt = newPrompt
        .replace('[author]', authorText)
          .replace('[genre]', genreText)
          .replace('[style]', styleText)
        .replace('[mood]', moodText)
        .replace('[duration]', `${duration} ${t('')}`);


      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [author,  genre, style, mood, duration, t]);




    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        // If newValue is an array, you can decide how to handle it.
        // For a single thumb slider, it should be just a number.
        if (typeof newValue === 'number') {
            setDuration(newValue);  // Update word count based on slider
        }
    };

// Calculate max tokens based on the slider value (duration)
    const maxTokens = duration * 4; // Since 1 word is approx. 4 tokens



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
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
          <label>{t(tokens.form.words)}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CustomSlider
            value={duration} // Convert the word count to the slider's scale
            min={100}
            max={1000}
            step={100} // The slider's step
            marks // This adds marks at each step
            onChange={handleSliderChange} //slider change determines amount of tokens used
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
                    <Box key={index} sx={{mt: 2}}>
                      <img src={image} alt={`Generated Art ${index + 1}`}
                           style={{width: '100%', marginBottom: '10px'}}/>

                      <div style={{textAlign: 'center', paddingTop: '20px'}}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (textResponse !== null) { // Ensure textResponse is not null
                              saveTextImage(textResponse, title, t(tokens.form.stories), image)
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

