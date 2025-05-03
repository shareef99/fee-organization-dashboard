import { Gender } from "@/types/enums";
import { Fee } from "@/types/fee";
import { Parent } from "@/types/parent";
import { AcademicYear, Grade } from "@/types/settings";

export type Student = {
  id: number;
  organization_id: number;
  parent_id: number;
  grade_id: number;
  academic_year_id: number;
  name: string;
  email: string;
  mobile: string | null;
  dob: string | null;
  gender: Gender | null;
  is_active: boolean;
  updated_at: string;
  created_at: string;
};

export type StudentList = Student & {
  parent: Parent;
};

export type StudentDetail = Student & {
  grade: Grade;
  academic_year: AcademicYear;
  parent: Parent;
  fees: Fee[];
};
