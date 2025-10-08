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
import type { Profile } from 'src/types/social';
import { saveDoc } from 'src/sections/components/buttons/saveDoc';
import {socialApi} from "../../../api/social/socialApi";
import {auth} from "../../../libs/firebase";
import {typography} from "../../../theme/typography";
import { useProtectedPage } from '../../../hooks/use-protectedpage';





export const ChatGPT: React.FC = () => {
  useProtectedPage();

  const { handleSubmit, isLoading } = useChatSubmit();
  const uid = auth.currentUser?.uid;
  const [user, setUser] = useState<Profile | null>(null);
  const [title, setTitle] = useState<string>('');
  const [chat, setChat] = useState<string>('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [liveResponse, setLiveResponse] = useState('');
  const { t } = useTranslation();


  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });

        if (!userData) {
          console.error("User data not found");
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);




  const submitToOpenAI = async () => {
    setConversation(prev => [...prev, ` ${chat}`]);
    setLiveResponse(""); // start fresh

    const fullText = await handleSubmit(chat, 2000, (token) => {
      setLiveResponse(prev => prev + token);
    });

    // ✅ Add final response into conversation
    setConversation(prev => [...prev, `GPT-5: ${fullText}`]);

    // Generate title from first 3 words of response
    const chatIntro = fullText.trim().split(" ");
    const generatedTitle = chatIntro.slice(0, 3).join(" ");
    setTitle(generatedTitle);

    setTimeout(() => setLiveResponse(""), 50);
    setChat("");
  };

  return (
  <>
    <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>

    <Typography sx={{ ...typography.h4, mb: 4, mt: 0, pl: 2, pr: 0, textAlign: 'center' }}>
      {t(tokens.form.hello)} {user?.firstName},  {t(tokens.form.chatInstructions)}
    </Typography>

    </Box>


  <Box
      sx={{
        p: 2,
        minHeight: '500px',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column', // vertical layout
      }}
    >
      {/* Conversation on top */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        {conversation.map((message, index) => (
          <Paper
            key={index}
            style={{
              padding: '20px',
              margin: '10px 0',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {message}
          </Paper>
        ))}
        {liveResponse && (
          <Paper
            elevation={3}
            style={{
              padding: '20px',
              margin: '10px 0',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            GPT-5: {liveResponse}
          </Paper>
        )}
      </Box>

      {/* Input always pinned to bottom */}
      <Stack spacing={2} sx={{ mt: 'auto', pt: 3 }}>


        <TextField
          fullWidth
          label={t("form.chatGPT")}
          name="chat"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          multiline
          rows={2}

        />
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Button
          onClick={submitToOpenAI}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading || !chat}
        >
          {isLoading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>

      {conversation.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <div style={{textAlign: 'center', paddingTop: '20px'}}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                saveDoc(conversation.join("\n\n"), title || `Chat-${Date.now()}`, t(tokens.form.chatGPT))
              }
              style={{ marginTop: "20px", width: "200px" }}
            >
              {t(tokens.form.saveChat)}
            </Button>

          </div>
        </Box>

      )}



    </Box>
  </>

  );
};
