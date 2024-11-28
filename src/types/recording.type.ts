import { ConsultStatus, RecordingStatus } from "@/constants";

export type Recording = {
  id: string;
  status: RecordingStatus;
  sequence: number;
  transcribedText?: string;
  createdAt: Date;
  updatedAt: Date;
};
