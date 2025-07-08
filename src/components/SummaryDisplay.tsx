import React from "react";
import { TranscriptSegment } from "../App";

const HF_SUMMARY_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

interface SummaryDisplayProps {
  transcript: TranscriptSegment[];
  isSummarizing: boolean;
  setIsSummarizing: (v: boolean) => void;
  summary: string | null;
  setSummary: (s: string | null) => void;
  isRecording: boolean;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  transcript,
  isSummarizing,
  setIsSummarizing,
  summary,
  setSummary,
  isRecording,
}) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleSummarize = async () => {
    setError(null);
    setIsSummarizing(true);
    setSummary(null);
    try {
      const fullText = transcript.map((seg) => `${seg.speaker}: ${seg.translatedText}`).join("\n");
      const resp = await fetch(HF_SUMMARY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: fullText }),
      });
      if (!resp.ok) throw new Error("Summarization failed");
      const data = await resp.json();
      const summaryText = data.summary_text || data[0]?.summary_text || "";
      setSummary(summaryText);
    } catch (err: any) {
      setError(err.message || "Summarization error");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopy = () => {
    if (summary) navigator.clipboard.writeText(summary);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minutes-of-meeting.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <button
        className="py-2 px-4 bg-green-600 text-white rounded font-bold disabled:opacity-50"
        onClick={handleSummarize}
        disabled={isSummarizing || isRecording || transcript.length === 0}
      >
        {isSummarizing ? "Summarizing..." : "Summarize Meeting"}
      </button>
      {error && <div className="text-xs text-red-500">{error}</div>}
      {summary && (
        <div className="mt-2">
          <h3 className="font-semibold text-gray-700 mb-1 text-sm">Minutes of the Meeting</h3>
          <textarea
            className="w-full rounded border p-2 text-sm text-gray-800 bg-gray-50"
            rows={6}
            value={summary}
            readOnly
          />
          <div className="flex gap-2 mt-2">
            <button className="py-1 px-3 bg-blue-500 text-white rounded text-xs" onClick={handleCopy}>
              Copy
            </button>
            <button className="py-1 px-3 bg-blue-500 text-white rounded text-xs" onClick={handleDownload}>
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay; 