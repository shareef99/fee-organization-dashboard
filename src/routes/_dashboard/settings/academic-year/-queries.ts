import { axiosClient } from "@/axios";
import { AcademicYear } from "@/types/settings";
import { queryOptions } from "@tanstack/react-query";

// Keys
export const academicYearKeys = {
  all: ["academic-year"],
} as const;

// Queries
export const getAcademicYears = () =>
  queryOptions({
    queryKey: academicYearKeys.all,
    queryFn: async () => {
      const { data } = await axiosClient.get<{
        academic_years: AcademicYear[];
      }>("/academic-years");

      return data.academic_years;
    },
  });
