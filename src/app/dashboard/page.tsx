"use client";

import { useState } from "react";
import { Button, TextField, TextareaAutosize } from "@mui/material";

import { ConsultStatus } from "@/constants";
import { useCreateConsult } from "@/hooks/useCreateConsult";
import { Consult } from "@/types/consult.type";

export const Dashboard = () => {
  const { mutate: createConsult } = useCreateConsult();
  const [isRecording, setIsRecording] = useState(false);
  const [currentConsult, setCurrentConsult] = useState<Consult>();
  const [notes, setNotes] = useState<string>("");

  const handleRecordPressed = () => {
    if (isRecording) {
      // recording stopping
    } else {
      // recording starting
      createConsult(
        { status: ConsultStatus.RECORDING_STARTED },
        {
          onSuccess: (data) => {
            setCurrentConsult(data);
          },
        }
      );
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col text-center p-5 gap-4">
      <h1 className="text-5xl">Lyrebird</h1>
      {/* Record button */}
      <div className="flex justify-end">
        <Button variant="outlined" onClick={handleRecordPressed}>
          {isRecording ? "Stop" : "Record"}
        </Button>
      </div>
      {/* Allow custom notes */}
      <div>
        <TextField
          multiline
          minRows={20}
          className="w-[100%]"
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {/* Show Result */}
      {currentConsult?.result && (
        <TextField
          multiline
          minRows={20}
          className="w-[100%]"
          label="Generated Consultation Note"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      )}
    </div>
  );
};

export default Dashboard;
