import React, { useRef, useState } from "react";
import { TranscriptSegment } from "../App";

interface AudioRecorderProps {
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  transcript: TranscriptSegment[];
  setTranscript: (t: TranscriptSegment[]) => void;
  isSummarizing: boolean;
}

const HF_WHISPER_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";
const HF_TRANSLATE_URL = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-mul-en";
const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;
console.log("HF_API_KEY:", HF_API_KEY);
if (!HF_API_KEY) {
  throw new Error("Hugging Face API key is missing. Please set REACT_APP_HF_API_KEY in your environment variables.");
}
const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  setIsRecording,
  transcript,
  setTranscript,
  isSummarizing,
}) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<"Speaker 1" | "Speaker 2">("Speaker 1");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleToggleSpeaker = () => {
    setCurrentSpeaker((prev) => (prev === "Speaker 1" ? "Speaker 2" : "Speaker 1"));
  };

  const handleStart = async () => {
    setError(null);
    setIsRecording(true);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        try {
          // Transcribe
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");
          const resp = await fetch(HF_WHISPER_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${HF_API_KEY}` },
            body: formData,
          });
          if (!resp.ok) throw new Error("Transcription failed");
          const data = await resp.json();
          const text = data.text || "";
          // Detect language
          const lang = data.language || "unknown";
          // Translate if not English
          let translatedText = text;
          if (lang !== "en" && text) {
            const translateResp = await fetch(HF_TRANSLATE_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HF_API_KEY}`
              },
              body: JSON.stringify({ inputs: text }),
            });
            if (translateResp.ok) {
              const tData = await translateResp.json();
              translatedText = tData.translation_text || tData[0]?.translation_text || text;
            }
          }
          setTranscript([
            ...transcript,
            { speaker: currentSpeaker, text, translatedText },
          ]);
        } catch (err: any) {
          setError(err.message || "Transcription error");
        } finally {
          setIsTranscribing(false);
        }
      };
      mediaRecorder.start();
    } catch (err: any) {
      setError(err.message || "Could not start recording");
      setIsRecording(false);
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-blue-600">Current: {currentSpeaker}</span>
        <button
          className="text-xs px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
          onClick={handleToggleSpeaker}
          disabled={isRecording || isTranscribing || isSummarizing}
        >
          Switch Speaker
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded text-white font-bold ${isRecording ? "bg-red-500" : "bg-blue-600"}`}
          onClick={isRecording ? handleStop : handleStart}
          disabled={isTranscribing || isSummarizing}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      {isTranscribing && <div className="text-xs text-blue-500 mt-2">Transcribing...</div>}
      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
      <div className="text-xs text-gray-400 mt-1">Record a segment, then switch speaker as needed. Each segment is diarized by your toggle.</div>
    </div>
  );
};

export default AudioRecorder; 