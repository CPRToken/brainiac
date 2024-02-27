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
import {auth} from "../../../libs/firebase";

type Option = {
  label: string;
  value: string;
};








export const HowMuch: FC = () => {



  const { combinedSubmit, textResponse, images, isLoading } = TextImageSubmit();
   const [what, setWhat] = useState<string>('');
   const [dimensions, setDimensions] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(2);
  const [prompt, setPrompt] = useState<string>('');
  const { textRef, handleCopyText } = ResponseText();
  const { t } = useTranslation();


    type DifficultyLevels = {
        [key: number]: string;
    };

  const difficultyLevels: DifficultyLevels = {
    0: tokens.form.veryEasy,
    1: tokens.form.easy,
    2: tokens.form.Average,
    3: tokens.form.aboveAverage,
    4: tokens.form.Hard,
  };




  useEffect(() => {
 if (what && dimensions && dimensions && difficulty !== null) {
      let newPrompt = t(tokens.form.createWhatPrompts);


      const whatText = ` ${t(what)} `;
       const dimensionsText = dimensions ? ` ${t(dimensions)} ` : ''; // Include dimensions text only if filled
      const difficultyText = ` ${t(difficultyLevels[difficulty])} `;

      newPrompt = newPrompt

        .replace('[what]', whatText)
        .replace('[dimensions]', dimensionsText)
        .replace('[difficulty]', difficultyText);

      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [dimensions, what, dimensions, difficulty, t]);


  const handleSaveStoryAndImage = (text: string, imageUrl: string, index: number) => {
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    if (uid === null) {
      alert('User is not authenticated');
      return;
    }

    // Send a POST request to your server with the text, image URL, and UID
    fetch('/api/upload-recipe', {
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
            label={t(tokens.form.whatProduct)}
            name="what"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            multiline
            rows={1}

          >

          </TextField>




            <TextField

              label={t(tokens.form.surfaceArea)}
              name="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              multiline
              rows={1}

            >


            </TextField>





          <div style={{ display: 'flex', justifyContent: 'center', width: '100%',paddingTop: '10px' }}>
              <label>{t(tokens.form.difficultyLevel)}</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Slider
                  value={difficulty}
                  min={0}
                  max={4}
                  step={1}
                  marks={[
                    { value: 0, label: t(tokens.form.veryEasy) },
                    { value: 1, label: t(tokens.form.easy) },
                    { value: 2, label: t(tokens.form.Average) },
                    { value: 3, label: t(tokens.form.aboveAverage) },
                    { value: 4, label: t(tokens.form.Hard) },
                  ]}
                  onChange={(_, newValue) => setDifficulty(newValue as number)}
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
          <Box sx={{ mt: 3 }}>
            <label>{t(tokens.headings.yourInstructions)}</label>
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
                      {t(tokens.form.saveStoryAndImage)}
                    </Button>
                  </Box>
              ))}
            </Box>
        )}
      </Box>
    </Box>
  );
}

