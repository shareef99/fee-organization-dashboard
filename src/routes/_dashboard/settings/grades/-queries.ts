import { axiosClient } from "@/axios";
import { Grade } from "@/types/settings";
import { queryOptions } from "@tanstack/react-query";

// Keys
export const gradeKeys = {
  all: ["grades"],
} as const;

// Queries
export const getGrades = () =>
  queryOptions({
    queryKey: gradeKeys.all,
    queryFn: async () => {
      const { data } = await axiosClient.get<{ grades: Grade[] }>("/grades");

      return data.grades;
    },
  });
