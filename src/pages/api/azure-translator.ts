//src/pages/api/azure-translator.ts
import { NextApiRequest, NextApiResponse } from 'next/types';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import stream from 'stream';

const speechKey = process.env.AZURE_SPEECH_KEY!;
const serviceRegion = process.env.AZURE_SPEECH_REGION!;

const validVoices: Record<string, string> = {
  'en-US': 'en-US-AriaNeural',
  'es-ES': 'es-ES-ElviraNeural',
  'th-TH': 'th-TH-PremwadeeNeural',
  'fr-FR': 'fr-FR-DeniseNeural',
  'de-DE': 'de-DE-KatjaNeural',
  'it-IT': 'it-IT-ElsaNeural',
  'ja-JP': 'ja-JP-NanamiNeural',
  'pt-PT': 'pt-PT-FernandaNeural',
  'ru-RU': 'ru-RU-SvetlanaNeural',
  'ko-KR': 'ko-KR-SunHiNeural',
  'ar-SA': 'ar-SA-ZariyahNeural',
  'hi-IN': 'hi-IN-SwaraNeural'
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;
  if (!text || !text.includes('|')) {
    return res.status(400).json({ error: 'Invalid or missing text + voice code input' });
  }

  const [inputText, voiceCode] = text.split('|');
  const voiceName = validVoices[voiceCode];

  if (!voiceName) {
    return res.status(400).json({ error: `Unsupported voice code: ${voiceCode}` });
  }

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechSynthesisLanguage = voiceCode;
    speechConfig.speechSynthesisVoiceName = voiceName;

    const pushStream = sdk.AudioOutputStream.createPullStream();
    const audioConfig = sdk.AudioConfig.fromStreamOutput(pushStream);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      inputText,
      async (result) => {
        synthesizer.close();
        if (result.reason !== sdk.ResultReason.SynthesizingAudioCompleted) {
          return res.status(500).json({ error: result.errorDetails });
        }

        const audioBuffer = result.audioData;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength);
        res.send(Buffer.from(audioBuffer));
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
