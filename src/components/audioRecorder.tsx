"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";

type Props = {
  onRecordingStart: () => void;
  onRecordingStop: (audioBlob: Blob) => void;
  onSendAudioChunk: (audioBlob: Blob) => void;
};

export const AudioRecorder = ({
  onRecordingStart,
  onRecordingStop,
  onSendAudioChunk,
}: Props) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const chunkIntervalRef = useRef<NodeJS.Timeout>();

  const createChunk = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      onSendAudioChunk(audioBlob);
      audioChunksRef.current = [];
    }
  };

  useEffect(() => {
    if (isRecording) {
      chunkIntervalRef.current = setInterval(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          // Start a new recording immediately
          setTimeout(() => {
            mediaRecorder.start();
            startTimeRef.current = Date.now();
          }, 0);
          createChunk();
        }
      }, 5000);
    }

    return () => {
      if (chunkIntervalRef.current) {
        clearInterval(chunkIntervalRef.current);
      }
    };
  }, [isRecording, mediaRecorder]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      onRecordingStart();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        onRecordingStop(finalBlob);
        setFinished(true);
      };

      if (chunkIntervalRef.current) {
        clearInterval(chunkIntervalRef.current);
      }

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleRecordPressed = () => {
    isRecording ? stopRecording() : startRecording();
    setIsRecording(!isRecording);
  };

  if (finished) return <></>;

  return (
    <Button variant="outlined" onClick={handleRecordPressed}>
      {isRecording ? "Stop" : "Record"}
    </Button>
  );
};
