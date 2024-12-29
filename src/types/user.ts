import { StaffRole } from "@/types/enums";

export type User = {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  role: StaffRole;
  mobile: string;
  accessToken: string;
  refreshToken: string;
};
