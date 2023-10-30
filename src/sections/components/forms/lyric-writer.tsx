import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';

type Option = {
    label: string;
    value: string;
};

const genreOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Rock', value: 'rock' },
    { label: 'Pop', value: 'pop' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Hip-Hop', value: 'hip-hop' },
    { label: 'Classical', value: 'classical' },
    { label: 'Country', value: 'country' },
    { label: 'Reggae', value: 'reggae' },
    { label: 'Blues', value: 'blues' },
    { label: 'Electronic', value: 'electronic' },
    { label: 'Folk', value: 'folk' },
    { label: 'R&B', value: 'r&b' },
    { label: 'Metal', value: 'metal' },
    // ... add more as needed
];

const styleOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'Romantic', value: 'romantic' },
    { label: 'Action', value: 'action' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Horror', value: 'horror' },
    { label: 'Love Song', value: 'love-song' },
    { label: 'Ballad', value: 'ballad' },
    { label: 'Anthem', value: 'anthem' },
    // ... add more as needed
];

const moodOptions: Option[] = [
    { label: '', value: '' },
    { label: 'Happy', value: 'happy' },
    { label: 'Sad', value: 'sad' },
    { label: 'Excited', value: 'excited' },
    { label: 'Relaxed', value: 'relaxed' },
    { label: 'Angry', value: 'angry' },
    { label: 'Serene', value: 'serene' },
    { label: 'Nostalgic', value: 'nostalgic' },
    { label: 'Energetic', value: 'energetic' },
    // ... add more as needed
];



export const LyricWriter: FC = () => {



    const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>('');
  const [style, setTheme] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(2.5);
  const [prompt, setPrompt] = useState<string>('');




  useEffect(() => {
        let newPrompt = 'write a[genre][style][mood]with a duration of [duration]';
        newPrompt = newPrompt.replace('[genre]', genre !== '' ? ` ${genre} song ` : ' song ');
        newPrompt = newPrompt.replace('[style]', style !== '' ? `in a ${style} style ` : '');
        newPrompt = newPrompt.replace('[mood]', mood !== '' ? ` with a ${mood} mood ` : '');
        newPrompt = newPrompt.replace('[duration]', `${duration} minutes`);
        setPrompt(newPrompt);
    }, [genre, style, mood, duration]);



  const textRef = useRef<HTMLDivElement>(null);  // <-- Step 1: Create ref

  const handleCopyText = () => {
    const text = textRef.current?.innerText || '';  // <-- Null check added here
    navigator.clipboard.writeText(text);
  };



  const handleSubmit = async () => {
        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                }),
            });

            const data = await response.json();

            if (data.content) {
                setOpenAIResponse(data.content);
            } else {
                console.error("Failed to get content.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };



  return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Genre"
          name="genre"
          select
          SelectProps={{ native: true }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genreOptions.map((option) => (
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
          onChange={(e) => setTheme(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Mood"
          name="mood"
          select
          SelectProps={{ native: true }}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          <label>Duration (minutes)</label>
          <Slider
            value={duration}
            min={1}
            max={4}
            step={0.5}
            onChange={(_, newValue) => setDuration(newValue as number)}
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
          <Button onClick={handleSubmit} type="submit" variant="contained" fullWidth>
              Submit
          </Button>
      </Box>


    <Box sx={{ mt: 3 }}>
      <label>Your Lyrics:</label> <br/>
      <Button onClick={handleCopyText} title="Copy response text">
        <FileCopyIcon />
      </Button>

      {/* Step 3: Add Copy Text button */}
      <Paper elevation={3} ref={textRef} style={{ padding: '10px', maxHeight: '200px', overflow: 'auto' }}>  {/* Attach ref */}
        {openAIResponse}
      </Paper>
    </Box>
  </Box>

);
};

