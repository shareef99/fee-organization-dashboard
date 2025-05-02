import { StaffRole } from "@/types/enums";

export type Staff = {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  role: StaffRole;
  mobile: string;
  is_active: boolean;
  updated_at: string | null;
  created_at: string;
};
