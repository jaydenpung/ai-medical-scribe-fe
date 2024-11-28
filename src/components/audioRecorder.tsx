"use client";

import { useState } from "react";
import { Button } from "@mui/material";

type Props = {
  onRecordingStart: () => void;
  onRecordingStop: (audioBlob: Blob) => void;
};

export const AudioRecorder = ({ onRecordingStart, onRecordingStop }: Props) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [finished, setFinished] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      setAudioChunks([]);

      recorder.ondataavailable = (e) => {
        console.log("Data chunk size:", e.data.size);
        setAudioChunks((prev) => [...prev, e.data]);
      };

      recorder.start(100);
      setMediaRecorder(recorder);
      onRecordingStart();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.onstop = () => {
        console.log("Chunks:", audioChunks.length);
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        console.log("Final blob size:", audioBlob.size);
        setFinished(true);
        onRecordingStop(audioBlob);
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleRecordPressed = () => {
    isRecording ? stopRecording() : startRecording();
    setIsRecording(!isRecording);
  };

  // If the recording is finished, don't show the button
  if (finished) {
    return <></>;
  }

  return (
    <Button variant="outlined" onClick={handleRecordPressed}>
      {isRecording ? "Stop" : "Record"}
    </Button>
  );
};
