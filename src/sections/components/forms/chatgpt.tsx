//src/sections/components/forms/chatgpt.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import useChatSubmit from './chat-submit';
import Typography from "@mui/material/Typography";








export const ChatGPT: React.FC = () => {
  const { handleSubmit, openAIResponse, isLoading } = useChatSubmit();
  const [chat, setChat] = useState<string>('');
  const [conversation, setConversation] = useState<string[]>([]);
  const { t } = useTranslation();

  const submitToOpenAI = async () => {
    setConversation((prev) => [...prev, `You: ${chat}`]);
    try {
      await handleSubmit(chat, 1000); // Await the async function
    } catch (error) {
      console.error("Error submitting chat:", error);
    }
    setChat('');
  };



  useEffect(() => {
    if (openAIResponse) {
      setConversation((prev) => [...prev, `GPT-4: ${openAIResponse}`]);
    }
  }, [openAIResponse]);


  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        <Typography variant="body2">
          {t(tokens.form.chatInstructions)}
        </Typography>

        <TextField
          fullWidth
          label={t(tokens.form.chatGPT)}
          name="chat"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          multiline
          rows={8}
        />

        <Button
          onClick={submitToOpenAI}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading || !chat}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Stack>

      <Box sx={{ mt: 3 }}>
        {conversation.map((message, index) => (
          <Paper key={index} elevation={3} style={{ padding: '20px', margin: '10px 0' }}>
            {message}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

