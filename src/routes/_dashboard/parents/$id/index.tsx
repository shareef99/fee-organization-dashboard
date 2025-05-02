import DataGrid from "@/components/data-grid";
import LinkButton from "@/components/link-button";
import Button from "@/components/mantine-wrappers/button";
import Paper from "@/components/mantine-wrappers/paper";
import Title from "@/components/mantine-wrappers/title";
import { formatNumber, parseIdParams } from "@/helpers";
import EditParentModal from "@/routes/_dashboard/parents/-components/edit";
import { getParentById } from "@/routes/_dashboard/parents/-queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_dashboard/parents/$id/")({
  component: RouteComponent,
  params: {
    parse: parseIdParams,
  },
  loader: ({ context: { queryClient }, params: { id } }) => {
    queryClient.ensureQueryData(getParentById(id));
  },
});

function RouteComponent() {
  const { id } = Route.useParams();

  // Suspense Queries
  const { data } = useSuspenseQuery(getParentById(id));

  // States
  const [editModal, setEditModal] = useState(false);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Title>{data.name}</Title>
        <Button onClick={() => setEditModal(true)}>Edit</Button>
      </div>
      <Paper className="w-fit *:flex *:items-baseline *:gap-2">
        <div>
          <div className="font-medium">ID : </div>
          <div>{data.id}</div>
        </div>
        <div>
          <div className="font-medium">Email : </div>
          <div>{data.email}</div>
        </div>
        <div>
          <div className="font-medium">Mobile : </div>
          <div>{data.mobile}</div>
        </div>
        <div>
          <div className="font-medium">Address : </div>
          <div>{data.address}</div>
        </div>
      </Paper>
      <div className="my-4">
        <div className="mb-4 flex items-center justify-between">
          <Title order={2}>Students</Title>
          <Button>Add</Button>
        </div>
        {data.students.length === 0 && <div>No students found</div>}
        <div className="space-y-4">
          {data.students.map((student) => (
            <Paper className="relative">
              <Button className="absolute! top-4! right-4!">Edit</Button>
              <div className="py-4 px-2 grid grid-cols-3 gap-4">
                <div>
                  <div className="font-medium">ID : </div>
                  <div>
                    <LinkButton
                      from="/parents/$id"
                      to="/students/$id"
                      params={{ id: student.id }}
                      variant="underline"
                    >
                      {student.id}
                    </LinkButton>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Name : </div>
                  <div>{student.name}</div>
                </div>
                <div>
                  <div className="font-medium">Email : </div>
                  <div>{student.email}</div>
                </div>
                <div>
                  <div className="font-medium">Mobile : </div>
                  <div>{student.mobile}</div>
                </div>
                <div>
                  <div className="font-medium">DOB : </div>
                  <div>{student.dob || "-"}</div>
                </div>
                <div>
                  <div className="font-medium">Gender : </div>
                  <div>{student.gender || "-"}</div>
                </div>
                <div>
                  <div className="font-medium">Is Active : </div>
                  <div>{student.is_active.toString()}</div>
                </div>
                <div>
                  <div className="font-medium">Grade : </div>
                  <div>{student.grade.name}</div>
                </div>
                <div>
                  <div className="font-medium">Academic Year : </div>
                  <div>{student.academic_year.name}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Title order={2}>Fees</Title>
                <div className="flex gap-4">
                  <Button>Add Fee</Button>
                  <Button>Add Payment</Button>
                </div>
              </div>
              <DataGrid
                name="parents-students"
                data={student.fees}
                columns={[
                  {
                    accessorKey: "id",
                    header: "ID",
                    cell: ({ row }) => (
                      <LinkButton
                        from="/parents/$id"
                        to="/fees/$id"
                        params={{ id: row.original.id }}
                        variant="underline"
                      >
                        {row.original.id}
                      </LinkButton>
                    ),
                  },
                  {
                    accessorKey: "fee_amount",
                    header: "Fee Amount",
                    cell: ({ row }) => formatNumber(row.original.fee_amount),
                  },
                  {
                    accessorKey: "discount",
                    header: "Discount",
                    cell: ({ row }) => formatNumber(row.original.discount),
                  },
                  {
                    accessorKey: "payable_amount",
                    header: "Payable Amount",
                    cell: ({ row }) =>
                      formatNumber(
                        row.original.fee_amount - row.original.discount
                      ),
                  },
                  {
                    accessorKey: "paid",
                    header: "Paid",
                    cell: ({ row }) => formatNumber(row.original.paid),
                  },
                  {
                    accessorKey: "due_amount",
                    header: "Due Amount",
                    cell: ({ row }) => formatNumber(row.original.due_amount),
                  },
                ]}
              />
            </Paper>
          ))}
        </div>
      </div>

      {/* Modals */}
      <EditParentModal
        opened={editModal}
        onClose={() => setEditModal(false)}
        parent={data}
      />
    </section>
  );
}
