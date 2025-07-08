import React, { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptDisplay from "./components/TranscriptDisplay";
import SummaryDisplay from "./components/SummaryDisplay";

export interface TranscriptSegment {
  speaker: string;
  text: string;
  translatedText: string;
}

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-4">
      <header className="w-full max-w-md mx-auto text-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Speakeasy: Real-Time Meeting Transcriber</h1>
        <p className="text-gray-600 text-sm mt-1">Live transcription, translation, and meeting minutes. Mobile-friendly. No login required.</p>
      </header>
      <main className="w-full max-w-md flex-1 flex flex-col gap-4">
        <AudioRecorder
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          transcript={transcript}
          setTranscript={setTranscript}
          isSummarizing={isSummarizing}
        />
        <TranscriptDisplay transcript={transcript} />
        <SummaryDisplay
          transcript={transcript}
          isSummarizing={isSummarizing}
          setIsSummarizing={setIsSummarizing}
          summary={summary}
          setSummary={setSummary}
          isRecording={isRecording}
        />
      </main>
      <footer className="w-full max-w-md mx-auto text-center text-xs text-gray-400 mt-4">
        &copy; {new Date().getFullYear()} Speakeasy. Powered by Hugging Face free endpoints.
      </footer>
    </div>
  );
};

export default App; 