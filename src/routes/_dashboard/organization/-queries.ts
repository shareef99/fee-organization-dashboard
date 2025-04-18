import { axiosClient } from "@/axios";
import { staffKeys } from "@/routes/_dashboard/staff/-queries";
import { Organization } from "@/types/organization";
import { Staff } from "@/types/staff";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// Keys
const organizationKeys = {
  all: ["organization"],
  add: ["organization", "add"],
  edit: ["organization", "edit"],
} as const;

// Queries
export const getOrganizations = () =>
  queryOptions({
    queryKey: organizationKeys.all,
    queryFn: async () => {
      const { data } = await axiosClient.get<{ organizations: Organization[] }>(
        "/organizations"
      );

      return data.organizations;
    },
  });

// Mutations
export const useAddOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: organizationKeys.add,
    mutationFn: async (payload: Partial<Organization>) => {
      const { data } = await axiosClient.post<{
        organization: Organization;
        staff: Staff;
      }>("/organizations", payload);

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(organizationKeys.all, (oldData) => {
        if (oldData && Array.isArray(oldData)) {
          return [...oldData, data.organization];
        }

        return oldData;
      });

      queryClient.setQueryData(staffKeys.all, (oldData) => {
        if (oldData && Array.isArray(oldData)) {
          return [...oldData, data.staff];
        }

        return oldData;
      });
    },
  });
};

export const useEditOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: organizationKeys.edit,
    mutationFn: async ({
      id,
      payload,
    }: {
      payload: Partial<Organization>;
      id: number;
    }) => {
      const { data } = await axiosClient.put<{ organization: Organization }>(
        `/organizations/${id}`,
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(organizationKeys.all, (oldData) => {
        if (oldData && Array.isArray(oldData)) {
          return oldData.map((organization) => {
            if (organization.id === data.organization.id) {
              return data.organization;
            }

            return organization;
          });
        }

        return oldData;
      });
    },
  });
};
