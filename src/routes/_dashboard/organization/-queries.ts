import { axiosClient } from "@/axios";
import { Organization } from "@/types/organization";
import { queryOptions } from "@tanstack/react-query";

// Keys
const organizationKeys = {
  all: ["organization"] as const,
};

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
