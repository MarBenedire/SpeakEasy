import React from "react";
import { TranscriptSegment } from "../App";

const TranscriptDisplay: React.FC<{ transcript: TranscriptSegment[] }> = ({ transcript }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
      <h2 className="font-semibold text-gray-700 mb-2 text-sm">Live Transcript</h2>
      {transcript.length === 0 ? (
        <div className="text-gray-400 text-xs">No transcript yet.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {transcript.map((seg, idx) => (
            <div key={idx} className="border-l-4 pl-2" style={{ borderColor: seg.speaker === "Speaker 1" ? "#3b82f6" : "#f59e42" }}>
              <div className="text-xs font-bold" style={{ color: seg.speaker === "Speaker 1" ? "#3b82f6" : "#f59e42" }}>{seg.speaker}</div>
              <div className="text-sm text-gray-800">{seg.translatedText}</div>
              {seg.text !== seg.translatedText && (
                <div className="text-xs text-gray-400 italic">({seg.text})</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay; 