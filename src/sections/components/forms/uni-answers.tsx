import React, {useEffect} from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import useGPT4Submit from "./gpt4-submit";
import CircularProgress from "@mui/material/CircularProgress";
import {saveDoc} from "../buttons/saveDoc";
import {useProtectedPage} from "../../../hooks/use-protectedpage";




export const UniAnswers: FC = () => {
  useProtectedPage();


  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();

  const [prompt, setPrompt] = useState<string>('');
  const [question ,setQuestion] = useState<string>('');
 const [title, setTitle] = useState<string>('');
  const { t } = useTranslation();
  const { textRef, handleCopyText } = ResponseText();



  const submitToOpenAI = () => {
    const maxTokens = 3000;
    if (prompt) {
      // Submit the prompt that is updated by the useEffect hook
      handleSubmit(prompt, maxTokens)
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
    if (question) {

      let newPrompt = t(tokens.form.uniQuestion); // Assume 'writePoem' is a defined key in your translation files

      const questionText = `${t(question)} `;


      const questionWords = questionText.split(' ');
      const title = [...questionWords.slice(0, 3)].join(' '); // Using newTitle to avoid conflict with state setter



      newPrompt = newPrompt
        .replace('[question]', questionText)


      setPrompt(newPrompt.trim());
      setTitle(title);
    } else {
      setPrompt('');
      setTitle('');
    }
  }, [question, t]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>

        <TextField
          fullWidth
          label={t(tokens.form.pasteQuestion)}
          name="prompt"
          value={prompt}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          rows={10}
        />


      </Stack>

        <Box sx={{ mt: 3 }}>
          <Button
            onClick={submitToOpenAI}
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>


        {openAIResponse && (
          <>
            <label>Your Answers:</label>
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
                onClick={() => saveDoc(openAIResponse, title, t(tokens.form.uniAnswers))}
                style={{marginTop: '20px', width: '200px'}} // Adjust the width as needed
              >
                {t(tokens.form.saveText)}
              </Button>
            </div>
          </>
        )}
      </Box>
  );
}
