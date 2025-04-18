import DataGrid from "@/components/data-grid";
import Title from "@/components/mantine-wrappers/title";
import { getOrganizations } from "@/routes/_dashboard/organization/-queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/organization/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getOrganizations());
  },
});

function RouteComponent() {
  // Suspense Queries
  const { data } = useSuspenseQuery(getOrganizations());

  return (
    <section>
      <Title>Organizations</Title>
      <DataGrid
        name="organizations"
        data={data}
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "mobile", header: "Mobile" },
          { accessorKey: "address", header: "Address" },
        ]}
      />
    </section>
  );
}
