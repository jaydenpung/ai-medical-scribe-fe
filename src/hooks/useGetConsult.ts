import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Consult } from "@/types/consult.type";

type Response = Consult;

export const useGetConsult = (id: string) => {
  return useQuery({
    queryKey: ["consult", id],
    queryFn: async () => {
      const response = await api.get<Response>(`/consults/${id}`);
      return response.data;
    },
  });
};
