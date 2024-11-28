import { ConsultStatus } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Consult } from "@/types/consult.type";

type Payload = {
  id: string;
  status: ConsultStatus;
};

type Response = Consult;

export const useUpdateConsult = () => {
  return useMutation<Response, Error, Payload>({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch<Response>(`/consults/${id}`, data);
      return response.data;
    },
  });
};
