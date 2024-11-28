import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Consult } from "@/types/consult.type";

type Payload = {
  id: string;
};

type Response = Consult;

export const useLongPollConsultResult = () => {
  return useMutation<Response, Error, Payload>({
    mutationFn: async ({ id }) => {
      const response = await api.get<Response>(`/consults/${id}/result`, {
        timeout: 30000,
      });
      return response.data;
    },
  });
};
