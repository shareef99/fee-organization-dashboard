import { Fee } from "@/types/fee";
import { AcademicYear, Grade } from "@/types/settings";
import { Student } from "@/types/student";

export type Parent = {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  updated_at: string;
  created_at: string;
};

export type ParentDetail = Parent & {
  students: (Student & {
    grade: Grade;
    academic_year: AcademicYear;
    fees: Fee[];
  })[];
};
