//src/pages/api/azure-translator.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechKey = process.env.AZURE_SPEECH_KEY!;
const serviceRegion = process.env.AZURE_SPEECH_REGION!;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;
  if (!text || !text.includes('|')) {
    return res.status(400).json({ error: 'Invalid or missing text + voice code input' });
  }

  const [inputText, voiceCode] = text.split('|');

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechSynthesisLanguage = voiceCode;

    // NEW: Return the audio stream to frontend
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      inputText,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          res.status(200).json({ message: 'Audio was synthesized successfully.' });
        } else {
          console.error('Speech synthesis failed:', result.errorDetails);
          res.status(500).json({ error: result.errorDetails });
        }
      },
      (err) => {
        synthesizer.close();
        console.error('Speech synthesis error:', err);
        res.status(500).json({ error: (err as unknown as Error).message });


      }
    );
  } catch (err: any) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
