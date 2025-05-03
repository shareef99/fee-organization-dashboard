export type Grade = {
  id: number;
  name: string;
  organization_id: number;
  updated_at: string;
  created_at: string;
};

export type AcademicYear = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  organization_id: number;
  is_current_year: boolean;
  updated_at: string;
  created_at: string;
};
