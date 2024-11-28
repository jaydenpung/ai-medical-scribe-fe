"use client";

import { useEffect, useState } from "react";
import { Button, TextField, TextareaAutosize } from "@mui/material";

import { ConsultStatus } from "@/constants";
import { useCreateConsult } from "@/hooks/useCreateConsult";
import { Consult } from "@/types/consult.type";
import { useGetConsult } from "@/hooks/useGetConsult";
import Link from "next/link";
import { useUpdateConsult } from "@/hooks/useUpdateConsult";

type Props = {
  params: { consultId: string };
};
export const Dashboard = ({ params }: Props) => {
  const { mutate: updateConsult } = useUpdateConsult();
  const [currentConsult, setCurrentConsult] = useState<Consult>();
  const [notes, setNotes] = useState<string>("");

  const { data: consult, isLoading } = useGetConsult(params.consultId);

  const handleRecordPressed = () => {
    if (!currentConsult) {
      return;
    }

    const isCurrentlyRecording =
      currentConsult.status === ConsultStatus.RECORDING_STARTED;

    if (isCurrentlyRecording) {
      // recording stopping
    } else {
      // recording starting
      updateConsult(
        { id: currentConsult.id, status: ConsultStatus.RECORDING_STARTED },
        {
          onSuccess: (data) => {
            setCurrentConsult(data);
          },
        }
      );
    }
  };

  useEffect(() => {
    setCurrentConsult(consult);
  }, [consult]);

  if (isLoading) {
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
        <Button variant="outlined" onClick={handleRecordPressed}>
          {currentConsult?.status === ConsultStatus.RECORDING_STARTED
            ? "Stop"
            : "Record"}
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
