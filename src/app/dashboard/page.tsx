"use client";

import { Button } from "@mui/material";
import { useCreateConsult } from "@/hooks/useCreateConsult";
import { useRouter } from "next/navigation";

export const Dashboard = () => {
  const { mutate: createConsult, isPending } = useCreateConsult();
  const router = useRouter();

  const handleNewPatientClicked = () => {
    createConsult(
      {},
      {
        onSuccess: (data) => {
          router.push(`/consult/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col text-center p-5 gap-20">
      <h1 className="text-5xl">Lyrebird</h1>
      {/* Record button */}
      <div className="flex justify-center">
        <Button
          variant="outlined"
          onClick={handleNewPatientClicked}
          disabled={isPending}
        >
          New Patient
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
