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
import useGPT4Submit from './gpt4-submit';
import { saveDoc } from 'src/sections/components/buttons/saveDoc';

type Option = {
    label: string;
    value: string;
};

const authorOptions: Option[] = [
    { label: '', value: '' },



  // ... add more as needed
];

const titleOptions: Option[] = [
    { label: '', value: '' },
      // ... add more as needed
];



export const BookSummariser: FC = () => {



  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [extra , setExtra] = useState<string>('');
  const [length, setLength] = useState<number>(1);
  const [prompt, setPrompt] = useState<string>('');


  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();


  type SummaryLength = {
    [key: number]: string;
  };

  const summaryLength: SummaryLength = {
    0: tokens.form.ShortSummary,
    1: tokens.form.MedSummary,
    2: tokens.form.LongSummary,
  };




    useEffect(() => {
        // Check if 'author' and 'title' are not empty, regardless of 'length' value
        if (author && title && length) {
            let newPrompt = t(tokens.form.bookSummary);

            const authorText = author.trim() !== '' ? `${t(author).trim()} ` : '';
            const titleText = title.trim() !== '' ? `${t(title).trim()} ` : '';
            const lengthText = ` ${t(summaryLength[length])}`; // Ensure this returns the correct string
          const extraText = extra !== '' ? `${t(extra)}` : '';
            // Replace placeholders with the actual values
            newPrompt = newPrompt
                .replace('[author]', authorText)
                .replace('[title]', titleText)
                .replace('[length]', lengthText)
                 .replace('[extra]', extraText)
            // Remove any trailing commas and spaces


            setPrompt(newPrompt.trim());
        } else {
            setPrompt('');
        }
    }, [author, title, length, extra, t]);












    return (
      <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t(tokens.form.author)}
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          multiline
          rows={1}
        >
          {authorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>

        <TextField
          fullWidth
          label={t(tokens.form.bookTitle)}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          multiline
          rows={1}
        >
          {titleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)} {/* Apply translation here */}
            </option>
          ))}
        </TextField>
        <Stack spacing={1}>
          <TextField
            fullWidth
            label={t(tokens.form.extraTextInfo)}
            name="extra"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            multiline
            rows={2}
          >
          </TextField>
        </Stack>
        <div>
          <label>{t(tokens.form.summaryLength)}</label>
          <Slider
            value={length}
            min={0}
            max={2}
            step={1}
            marks={[
              { value: 0, label: t(tokens.form.ShortSummary) },
              { value: 1, label: t(tokens.form.MedSummary) },
              { value: 2, label: t(tokens.form.LongSummary) },

            ]}
            onChange={(_, newValue) => setLength(newValue as number)}
          />
        </div>



      </Stack>

          <Box sx={{ mt: 3 }}>
            <Button
              onClick={() => handleSubmit(prompt, 3000)}
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}  // Disable the button while loading
            >
              {isLoading ? <CircularProgress size={24}/> : 'Submit'}
            </Button>
          </Box>

        {openAIResponse && (
          <Box sx={{mt: 3}}>
            <label>{t(tokens.form.yourBookSummary)}</label>
            <Button onClick={handleCopyText} title="Copy response text">
              <FileCopyIcon/>
              </Button>



            <Paper elevation={3} ref={textRef}
                   style={{padding: '30px', overflow: 'auto', lineHeight: '1.5'}}>
              {openAIResponse.split('\n').map((str, index, array) => (
                <React.Fragment key={index}>
                  {str}
                  {index < array.length - 1 ? <br/> : null}
                </React.Fragment>
              ))}
            </Paper>
            <div style={{textAlign: 'center', paddingTop: '20px'}}>
              <Button
              variant="contained"
              color="primary"
              onClick={() => saveDoc(openAIResponse, title, 'summaries')}
              style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
            >
              {t(tokens.form.saveText)}
              </Button>
            </div>
          </Box>
        )}
      </Box>
    );
}

