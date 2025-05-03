import { axiosClient } from "@/axios";
import { parentKeys } from "@/routes/_dashboard/parents/-queries";
import { Student, StudentDetail, StudentList } from "@/types/student";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// Keys
export const studentKeys = {
  all: (key: StudentListKey) => ["student", key],
  byId: (id: number) => ["student", "id", id] as const,
  add: ["student", "add"],
  edit: ["student", "edit"],
} as const;

// Queries
type StudentListKey = {
  academic_year_id: number | undefined;
  grade_id: number | undefined;
};
export const getStudents = (params: StudentListKey) =>
  queryOptions({
    queryKey: studentKeys.all(params),
    queryFn: async () => {
      const { data } = await axiosClient.get<{ students: StudentList[] }>(
        "/students",
        { params }
      );

      return data.students;
    },
  });

export const getStudentById = (id: number) =>
  queryOptions({
    queryKey: studentKeys.byId(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<{ student: StudentDetail }>(
        `/students/${id}`
      );

      return data.student;
    },
  });

// Mutations
export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: studentKeys.add,
    mutationFn: async (payload: Partial<Student>) => {
      const { data } = await axiosClient.post<{ student: Student }>(
        "/students",
        payload
      );

      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: parentKeys.byId(data.student.parent_id),
      });
    },
  });
};

export const useEditStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: studentKeys.edit,
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: Partial<Student>;
      id: number;
    }) => {
      const { data } = await axiosClient.put<{ student: Student }>(
        `/students/${id}`,
        payload
      );

      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.byId(data.student.id),
      });
      await queryClient.invalidateQueries({
        queryKey: parentKeys.byId(data.student.parent_id),
      });
    },
  });
};
