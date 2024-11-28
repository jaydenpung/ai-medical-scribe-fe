import { ConsultStatus } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Consult } from "@/types/consult.type";

type Payload = {
  consultId: string;
  sequence: number;
  audio: Blob;
  notes?: string;
};

type Response = {};

export const useCreateRecording = () => {
  return useMutation({
    mutationFn: async ({ consultId, audio, notes, sequence }: Payload) => {
      const formData = new FormData();
      console.log("Audio blob:", audio);
      const audioFile = new File([audio], "recording.webm", {
        type: "audio/webm",
      });
      formData.append("audio", audioFile);
      formData.append("sequence", sequence.toString());
      if (notes) {
        formData.append("notes", notes);
      }

      const response = await api.post(
        `/consults/${consultId}/recordings`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};
