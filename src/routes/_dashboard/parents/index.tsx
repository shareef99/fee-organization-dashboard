import DataGrid from "@/components/data-grid";
import LinkButton from "@/components/link-button";
import Button from "@/components/mantine-wrappers/button";
import Title from "@/components/mantine-wrappers/title";
import { formatDate } from "@/helpers/dates";
import AddParentModal from "@/routes/_dashboard/parents/-components/add";
import { getParents } from "@/routes/_dashboard/parents/-queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_dashboard/parents/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getParents());
  },
});

function RouteComponent() {
  // Suspense Queries
  const { data } = useSuspenseQuery(getParents());

  // States
  const [addModal, setAddModal] = useState(false);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Title>Parents</Title>
        <Button onClick={() => setAddModal(true)}>Add</Button>
      </div>
      <DataGrid
        name="parents"
        data={data}
        columns={[
          {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
              <LinkButton
                from="/parents"
                to="$id"
                params={{ id: row.original.id }}
                variant="underline"
              >
                {row.original.id}
              </LinkButton>
            ),
          },
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "mobile", header: "Mobile" },
          { accessorKey: "address", header: "Address" },
          {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => formatDate(row.original.created_at),
          },
          {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ row }) => formatDate(row.original.updated_at),
          },
        ]}
        initialState={{
          columnVisibility: {
            created_at: false,
            updated_at: false,
          },
        }}
      />

      {/* Modals */}
      <AddParentModal opened={addModal} onClose={() => setAddModal(false)} />
    </section>
  );
}
