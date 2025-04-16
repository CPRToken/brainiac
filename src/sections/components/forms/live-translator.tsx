//src/sections/components/forms/live-translator.tsx
// Updated LiveTranslator: added input language dropdown for English/Spanish

import React, { useState } from 'react';
import type { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import { useProtectedPage } from '../../../hooks/use-protectedpage';
import useAzureSpeak from './azure-speak';
import axios from 'axios';

const languageCodeMap: Record<string, string> = {
  English: 'en',
  Spanish: 'es',
  Thai: 'th',
  French: 'fr',
  German: 'de',
  Italian: 'it',
  Japanese: 'ja',
  Portuguese: 'pt',
  Russian: 'ru',
  Korean: 'ko',
  Arabic: 'ar',
  Hindi: 'hi',
};

const voiceCodeMap: Record<string, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  Thai: 'th-TH',
  French: 'fr-FR',
  German: 'de-DE',
  Italian: 'it-IT',
  Japanese: 'ja-JP',
  Portuguese: 'pt-PT',
  Russian: 'ru-RU',
  Korean: 'ko-KR',
  Arabic: 'ar-SA',
  Hindi: 'hi-IN',
};

const inputLanguages = ['English', 'Spanish'];

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

let activeRecognizer: any = null;

export const LiveTranslator: FC = () => {
  useProtectedPage();
  const { t } = useTranslation();
  const [language, setLanguage] = useState('Spanish');
  const [inputLanguage, setInputLanguage] = useState('English');
  const { handleSpeak, isSpeaking } = useAzureSpeak();

  const translateText = async (text: string, to: string): Promise<string> => {
    try {
      const res = await axios.post('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0',
        [{ Text: text }],
        {
          params: { to },
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY!,
            'Ocp-Apim-Subscription-Region': process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION!,
            'Content-Type': 'application/json'
          }
        });

      return res.data[0].translations[0].text;
    } catch (err) {
      console.error('Translation failed:', err);
      return text;
    }
  };

  const handleTranslate = async () => {
    const voiceLang = languageCodeMap[language];
    const voiceCode = voiceCodeMap[language];
    const inputCode = voiceCodeMap[inputLanguage];
    if (!voiceLang || !voiceCode || !inputCode) {
      console.error('Unsupported language');
      return;
    }

    if (activeRecognizer) {
      activeRecognizer.abort();
    }

    const SpeechRecognition: typeof window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    activeRecognizer = recognition;

    recognition.lang = inputCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const spokenText = event.results[0][0].transcript;
      const translated = await translateText(spokenText, voiceLang);
      const payload = `${translated}|${voiceCode}`;
      await handleSpeak(payload);
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      recognition.abort();
    };

    recognition.start();
  };

  return (
    <Box sx={{ p: 2, maxWidth: 700, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography variant="body2">
          {t(tokens.form.liveTranslatorInstructions)}
        </Typography>

        <TextField
          fullWidth
          label={t(tokens.form.inputLanguage)}
          select
          SelectProps={{ native: true }}
          value={inputLanguage}
          onChange={(e) => setInputLanguage(e.target.value)}
        >
          {inputLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </TextField>

        <TextField
          fullWidth
          label={t(tokens.form.translationLanguage)}
          select
          SelectProps={{ native: true }}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.keys(languageCodeMap).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleTranslate}
          disabled={isSpeaking}
        >
          {isSpeaking ? t(tokens.form.speaking) : t(tokens.form.translateAndSpeak)}
        </Button>
      </Stack>
    </Box>
  );
};
