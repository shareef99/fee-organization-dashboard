import { axiosClient } from "@/axios";
import { Staff } from "@/types/staff";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// Keys
export const staffKeys = {
  all: ["staff"],
  add: ["staff", "add"],
  edit: ["staff", "edit"],
} as const;

// Queries
export const getStaff = () =>
  queryOptions({
    queryKey: staffKeys.all,
    queryFn: async () => {
      const { data } = await axiosClient.get<{ staffs: Staff[] }>("/staff");

      return data.staffs;
    },
  });

// Mutations
export const useAddStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: staffKeys.add,
    mutationFn: async (payload: Partial<Staff> & { password: string }) => {
      const { data } = await axiosClient.post<{ staff: Staff }>(
        "/staff",
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(staffKeys.all, (old: Staff[]) => {
        if (!old) return [data.staff];

        return [...old, data.staff];
      });
    },
  });
};

export const useEditStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: staffKeys.edit,
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: Partial<Staff>;
      id: number;
    }) => {
      const { data } = await axiosClient.put<{ staff: Staff }>(
        `/staff/${id}`,
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(staffKeys.all, (old: Staff[]) => {
        if (!old) return [data.staff];

        return old.map((item) =>
          item.id === data.staff.id ? data.staff : item
        );
      });
    },
  });
};
