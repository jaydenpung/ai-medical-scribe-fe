import { ConsultStatus, RecordingStatus } from "@/constants";

export type Recording = {
  id: string;
  status: RecordingStatus;
  transcribedText?: string;
  createdAt: Date;
  updatedAt: Date;
};
