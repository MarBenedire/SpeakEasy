# Speakeasy: Real-Time Meeting Transcriber

A mobile-friendly web app for real-time meeting transcription, translation, speaker separation, and automatic meeting minutes generation. No login required. Powered by free Hugging Face endpoints.

## Features
- **Live transcription** (any language, auto-detected)
- **Automatic translation** to English
- **Speaker separation** (toggle between Speaker 1/Speaker 2)
- **AI-generated Minutes of Meeting** (summarization)
- **Mobile-first UI**
- **No authentication**
- **Free to use** (uses Hugging Face public endpoints)

## How to Use
1. Click **Start Recording** and speak. Toggle between Speaker 1/Speaker 2 as needed.
2. After each segment, stop recording. The app will transcribe and translate.
3. Repeat for all speakers/segments.
4. When finished, click **Summarize Meeting** to generate the Minutes of Meeting. Copy or download the summary.

## Deployment (Vercel/Netlify)
1. **Fork or clone this repo.**
2. **Deploy to Vercel:**
   - Go to [vercel.com/import](https://vercel.com/import), select your repo, and deploy. No config needed.
3. **Or deploy to Netlify:**
   - Go to [app.netlify.com/start](https://app.netlify.com/start), link your repo, and deploy. No config needed.

## Technical Notes
- **Speech-to-text:** [Whisper Large V3](https://huggingface.co/openai/whisper-large-v3) via Hugging Face Inference API (free, but rate-limited)
- **Translation:** [Helsinki-NLP/opus-mt-mul-en](https://huggingface.co/Helsinki-NLP/opus-mt-mul-en)
- **Summarization:** [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)
- **Speaker separation:** User toggles between Speaker 1/Speaker 2 for diarization

## Limitations
- Free Hugging Face endpoints are rate-limited and may be slow at times.
- Speaker diarization is manual (toggle button).
- No authentication or data storage; all processing is in-browser or via public APIs.

---

MIT License 