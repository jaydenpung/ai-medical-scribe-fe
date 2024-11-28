import { ConsultStatus } from "@/constants";
import { useMutation } from '@tanstack/react-query';
import {api} from '@/lib/axios';
import { Consult } from "@/types/consult.type";

type Payload = {
    status: ConsultStatus;
}

type Response = Consult;

export const useCreateConsult = () => {
    return useMutation<Response, Error, Payload>({
      mutationFn: async (data) => {
        const response = await api.post<Response>(
          '/consults', 
          data,
        );
        return response.data;
      },
    });
  };
