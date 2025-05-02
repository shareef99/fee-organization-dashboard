import DataGrid from "@/components/data-grid";
import EditButton from "@/components/edit-button";
import Button from "@/components/mantine-wrappers/button";
import Title from "@/components/mantine-wrappers/title";
import { formatDate } from "@/helpers/dates";
import AddStaffModal from "@/routes/_dashboard/staff/-components/add";
import EditStaffModal from "@/routes/_dashboard/staff/-components/edit";
import { getStaff } from "@/routes/_dashboard/staff/-queries";
import { useUser } from "@/store";
import { Staff } from "@/types/staff";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_dashboard/staff/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getStaff());
  },
});

function RouteComponent() {
  const user = useUser();

  // Suspense Queries
  const { data } = useSuspenseQuery(getStaff());

  // States
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<Staff>();

  if (!user) {
    throw redirect({ from: "/staff", to: "/login" });
  }

  if (user.role === "accountant") {
    throw redirect({ from: "/staff", to: "/not-access" });
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Title>Staff</Title>
        {user.role === "admin" && (
          <Button onClick={() => setAddModal(true)}>Add</Button>
        )}
      </div>
      <DataGrid
        name="staff"
        data={data}
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "role", header: "Role" },
          { accessorKey: "organization_id", header: "Organization ID" },
          { accessorKey: "mobile", header: "Mobile" },
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
      />

      {/* Modals */}
      <AddStaffModal opened={addModal} onClose={() => setAddModal(false)} />
      {editModal && (
        <EditStaffModal
          opened={!!editModal}
          onClose={() => setEditModal(undefined)}
          staff={editModal}
        />
      )}
    </section>
  );
}
