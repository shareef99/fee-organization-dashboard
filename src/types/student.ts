export type Student = {
  id: number;
  organization_id: number;
  parent_id: number;
  grade_id: number;
  academic_year_id: number;
  name: string;
  email: string;
  mobile: string;
  dob: string | null;
  gender: string | null;
  is_active: boolean;
  updated_at: string;
  created_at: string;
};
