import DataGrid from "@/components/data-grid";
import LinkButton from "@/components/link-button";
import Button from "@/components/mantine-wrappers/button";
import Paper from "@/components/mantine-wrappers/paper";
import Title from "@/components/mantine-wrappers/title";
import { formatNumber, parseIdParams } from "@/helpers";
import EditStudentModal from "@/routes/_dashboard/students/-components/edit";
import { getStudentById } from "@/routes/_dashboard/students/-queries";
import { Student } from "@/types/student";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_dashboard/students/$id/")({
  component: RouteComponent,
  params: {
    parse: parseIdParams,
  },
  loader: ({ context: { queryClient }, params: { id } }) => {
    queryClient.ensureQueryData(getStudentById(id));
  },
});

function RouteComponent() {
  const { id } = Route.useParams();

  // Suspense Queries
  const { data } = useSuspenseQuery(getStudentById(id));

  // States
  const [editModal, setEditModal] = useState<Student>();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Title>{data.name}</Title>
        <Button onClick={() => setEditModal(data)}>Edit</Button>
      </div>
      <Paper>
        <div className="py-4 px-2 grid grid-cols-3 gap-4">
          <div>
            <div className="font-medium">ID : </div>
            <div>{data.id}</div>
          </div>
          <div>
            <div className="font-medium">Parent : </div>
            <div>
              <LinkButton
                from="/students/$id"
                to="/parents/$id"
                params={{ id: data.parent.id }}
                variant="underline"
              >
                {data.parent.name}
              </LinkButton>
            </div>
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
            <div className="font-medium">DOB : </div>
            <div>{data.dob || "-"}</div>
          </div>
          <div>
            <div className="font-medium">Gender : </div>
            <div>{data.gender || "-"}</div>
          </div>
          <div>
            <div className="font-medium">Is Active : </div>
            <div>{data.is_active.toString()}</div>
          </div>
          <div>
            <div className="font-medium">Grade : </div>
            <div>{data.grade.name}</div>
          </div>
          <div>
            <div className="font-medium">Academic Year : </div>
            <div>{data.academic_year.name}</div>
          </div>
        </div>
      </Paper>
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <Title order={2}>Fees</Title>
          <div className="flex gap-4">
            <Button>Add Fee</Button>
            <Button>Add Payment</Button>
          </div>
        </div>
        <DataGrid
          name="parents-students"
          data={data.fees}
          columns={[
            {
              accessorKey: "id",
              header: "ID",
              cell: ({ row }) => (
                <LinkButton
                  from="/students/$id"
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
                formatNumber(row.original.fee_amount - row.original.discount),
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
      </section>

      {/* Modals */}
      {editModal && (
        <EditStudentModal
          opened={!!editModal}
          onClose={() => setEditModal(undefined)}
          student={editModal}
        />
      )}
    </section>
  );
}
