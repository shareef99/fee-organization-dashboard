import { axiosClient } from "@/axios";
import { Parent, ParentDetail } from "@/types/parent";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// Keys
export const parentKeys = {
  all: ["parent"],
  byId: (id: number) => ["parent", "id", id],
  add: ["parent", "add"],
  edit: ["parent", "edit"],
} as const;

// Queries
export const getParents = () =>
  queryOptions({
    queryKey: parentKeys.all,
    queryFn: async () => {
      const { data } = await axiosClient.get<{ parents: Parent[] }>("/parents");

      return data.parents;
    },
  });

export const getParentById = (id: number) =>
  queryOptions({
    queryKey: parentKeys.byId(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<{
        parent: ParentDetail;
      }>(`/parents/${id}`);

      return data.parent;
    },
  });

// Mutations
export const useAddParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: parentKeys.add,
    mutationFn: async (payload: Partial<Parent>) => {
      const { data } = await axiosClient.post<{ parent: Parent }>(
        "/parents",
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(parentKeys.all, (old: Parent[]) => {
        if (!old) return [data.parent];

        return [...old, data.parent];
      });
    },
  });
};

export const useEditParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: parentKeys.edit,
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: Partial<Parent>;
      id: number;
    }) => {
      const { data } = await axiosClient.put<{ parent: Parent }>(
        `/parents/${id}`,
        payload
      );

      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(parentKeys.byId(id), (old: ParentDetail) => {
        if (old) {
          return { ...old, ...data.parent };
        }
      });
    },
  });
};
