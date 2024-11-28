import { ConsultStatus } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Consult } from "@/types/consult.type";

type Payload = {
  consultId: string;
  status: ConsultStatus;
};

type Response = {};

export const useCreateRecording = () => {
  return useMutation<Response, Error, Payload>({
    mutationFn: async ({ consultId, ...data }) => {
      const response = await api.post<Response>(
        `/consults/${consultId}/recordings`,
        data
      );
      return response.data;
    },
  });
};
