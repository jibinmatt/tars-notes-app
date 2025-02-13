"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function SpeechRecorder({ onTranscript, onAudioUrl }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false; // Only return final results
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const newTranscript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setTranscript(newTranscript);
          onTranscript(newTranscript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
        };

        recognitionRef.current.onend = () => {
          if (isRecording) {
            recognitionRef.current.start(); // Restart if still recording
          }
        };
      }
    }
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    setTranscript(""); // Reset transcript
    audioChunksRef.current = []; // Clear previous audio chunks

    if (recognitionRef.current) recognitionRef.current.start();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("📌 Captured Audio Chunk:", event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          console.error("📌 No audio recorded!");
          setIsRecording(false);
          return;
        }

        // ✅ Convert chunks to a single Blob
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        console.log("📌 Final Recorded Audio Blob:", audioBlob);

        if (audioBlob.size === 0) {
          console.error("📌 Error: Empty Audio Blob!");
          return;
        }

        // ✅ Upload the audio file to Cloudinary
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        console.log("📌 Sending FormData:", formData.get("file"));

        try {
          const res = await axios.post("/api/upload/audio", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("📌 Upload Response:", res.data);

          if (res.data.audioUrl) {
            console.log("📌 Received Audio URL:", res.data.audioUrl);
            setAudioUrl(res.data.audioUrl);
            onAudioUrl(res.data.audioUrl);
          }
        } catch (error) {
          console.error("📌 API Request Failed:", error.response?.data || error.message);
        }
      };

      mediaRecorderRef.current.start();
      console.log("📌 Recording Started...");

    } catch (error) {
      console.error("📌 Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {audioUrl &&
        <audio controls className="mb-4">
          <source src={audioUrl} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      }
      <p className="text-gray-700">{isRecording ? "Listening..." : "Click to start recording"}</p>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-md text-white transition-all duration-300 ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <textarea
        className="w-full p-2 border rounded-md"
        value={transcript}
        readOnly
        placeholder="Transcript will appear here..."
      />
    </div>
  );
}
