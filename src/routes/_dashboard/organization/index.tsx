import DataGrid from "@/components/data-grid";
import EditButton from "@/components/edit-button";
import Button from "@/components/mantine-wrappers/button";
import Title from "@/components/mantine-wrappers/title";
import { formatDate } from "@/helpers/dates";
import AddOrganizationModal from "@/routes/_dashboard/organization/-components/add";
import EditOrganizationModal from "@/routes/_dashboard/organization/-components/edit";
import { getOrganizations } from "@/routes/_dashboard/organization/-queries";
import { Organization } from "@/types/organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_dashboard/organization/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getOrganizations());
  },
});

function RouteComponent() {
  // Suspense Queries
  const { data } = useSuspenseQuery(getOrganizations());

  // States
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<Organization>();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Title>Organizations</Title>
        <Button onClick={() => setAddModal(true)}>Add</Button>
      </div>
      <DataGrid
        name="organizations"
        data={data}
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "mobile", header: "Mobile" },
          { accessorKey: "address", header: "Address" },
          { accessorKey: "is_active", header: "Active" },
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
          {
            accessorKey: "edit",
            header: "Edit",
            cell: ({ row }) => (
              <EditButton onClick={() => setEditModal(row.original)} />
            ),
          },
        ]}
        initialState={{
          columnVisibility: {
            address: false,
            created_at: false,
            updated_at: false,
          },
        }}
      />

      {/* Modals */}
      <AddOrganizationModal
        opened={addModal}
        onClose={() => setAddModal(false)}
      />
      {editModal && (
        <EditOrganizationModal
          opened={!!editModal}
          onClose={() => setEditModal(undefined)}
          organization={editModal}
        />
      )}
    </section>
  );
}
