import { ConsultStatus } from "@/constants";

export type Consult = {
  id: string;
  status: ConsultStatus;
  notes?: string;
  result?: string;
  createdAt: Date;
  updatedAt: Date;
};
