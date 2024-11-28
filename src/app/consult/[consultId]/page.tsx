"use client";

import { useEffect, useState } from "react";
import { Button, TextField, TextareaAutosize } from "@mui/material";

import { ConsultStatus } from "@/constants";
import { useCreateConsult } from "@/hooks/useCreateConsult";
import { Consult } from "@/types/consult.type";
import { useGetConsult } from "@/hooks/useGetConsult";
import Link from "next/link";
import { useUpdateConsult } from "@/hooks/useUpdateConsult";
import { AudioRecorder } from "@/components/audioRecorder";
import { useCreateRecording } from "@/hooks/useCreateRecording";
import { useLongPollConsultResult } from "@/hooks/useLongPollConsultResult";

type Props = {
  params: { consultId: string };
};
export const Dashboard = ({ params }: Props) => {
  const { mutate: updateConsult } = useUpdateConsult();
  const { mutate: createRecording } = useCreateRecording();
  const { mutate: longPollConsultResult } = useLongPollConsultResult();
  const [currentConsult, setCurrentConsult] = useState<Consult>();
  const [notes, setNotes] = useState<string>("");

  const { data: consult, isLoading } = useGetConsult(params.consultId);

  useEffect(() => {
    setCurrentConsult(consult);
  }, [consult]);

  if (isLoading || !currentConsult) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col text-center p-5 gap-4">
      <h1 className="text-5xl">Lyrebird</h1>
      {/* Record button */}
      <div className="flex justify-between">
        <Link href="/">
          <Button variant="outlined">Back</Button>
        </Link>
        {!currentConsult?.result && (
          <AudioRecorder
            onRecordingStart={() => {
              updateConsult({
                id: currentConsult.id,
                status: ConsultStatus.RECORDING_STARTED,
              });
            }}
            onRecordingStop={(audioBlob) => {
              updateConsult({
                id: currentConsult.id,
                status: ConsultStatus.RECORDING_FINISHED,
              });
              createRecording({
                consultId: currentConsult.id,
                audio: audioBlob,
                notes,
              });

              longPollConsultResult(
                { id: currentConsult.id },
                {
                  onSuccess: (data) => {
                    setCurrentConsult(data);
                  },
                }
              );
            }}
          />
        )}
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
          value={currentConsult.result}
        />
      )}
    </div>
  );
};

export default Dashboard;
