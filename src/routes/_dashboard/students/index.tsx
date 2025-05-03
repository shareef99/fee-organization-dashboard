import DataGrid from "@/components/data-grid";
import LinkButton from "@/components/link-button";
import Title from "@/components/mantine-wrappers/title";
import { formatDate } from "@/helpers/dates";
import { getAcademicYears } from "@/routes/_dashboard/settings/academic-year/-queries";
import { getGrades } from "@/routes/_dashboard/settings/grades/-queries";
import { getStudents } from "@/routes/_dashboard/students/-queries";
import { Tabs } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

export const Route = createFileRoute("/_dashboard/students/")({
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(getAcademicYears());
    queryClient.ensureQueryData(getGrades());
    queryClient.ensureQueryData(
      getStudents({
        academic_year_id: deps.academic_year_id,
        grade_id: deps.grade_id,
      })
    );
  },
  validateSearch: zodValidator(
    z.object({
      academic_year_id: z.coerce.number().int().positive().optional(),
      grade_id: z.coerce.number().int().positive().optional(),
    })
  ),
});

function RouteComponent() {
  const { academic_year_id, grade_id } = Route.useSearch();

  // Suspense Queries
  const { data: academicYears } = useSuspenseQuery(getAcademicYears());
  const { data: grades } = useSuspenseQuery(getGrades());
  const { data } = useSuspenseQuery(
    getStudents({ academic_year_id, grade_id })
  );

  return (
    <section>
      <div className="mb-4">
        <Title>Students</Title>
      </div>
      <Tabs
        value={
          academic_year_id?.toString() ||
          academicYears.find((ay) => ay.is_current_year)?.id.toString()
        }
        variant="pills"
        color="var(--color-p-primary)"
        mb="xs"
      >
        <Tabs.List>
          {academicYears.map((academicYear) => (
            <Link
              key={academicYear.id}
              from="/students"
              to="/students"
              search={{ academic_year_id: academicYear.id, grade_id }}
            >
              <Tabs.Tab
                key={academicYear.id}
                value={academicYear.id.toString()}
              >
                {academicYear.name}
              </Tabs.Tab>
            </Link>
          ))}
        </Tabs.List>
      </Tabs>
      <Tabs
        value={grade_id?.toString() || "all"}
        color="var(--color-p-primary)"
      >
        <Tabs.List>
          <Link
            from="/students"
            to="/students"
            search={{ grade_id: undefined, academic_year_id }}
          >
            <Tabs.Tab value="all">All</Tabs.Tab>
          </Link>
          {grades.map((grade) => (
            <Link
              key={grade.id}
              from="/students"
              to="/students"
              search={{ grade_id: grade.id, academic_year_id }}
            >
              <Tabs.Tab key={grade.id} value={grade.id.toString()}>
                {grade.name}
              </Tabs.Tab>
            </Link>
          ))}
        </Tabs.List>
        {[{ id: "all" }, ...grades].map((grade) => (
          <Tabs.Panel key={grade.id} value={grade.id.toString()}>
            <DataGrid
              name="students"
              data={data}
              columns={[
                {
                  accessorKey: "id",
                  header: "ID",
                  cell: ({ row }) => (
                    <LinkButton
                      from="/students"
                      to="$id"
                      params={{ id: row.original.id }}
                      variant="underline"
                    >
                      {row.original.id}
                    </LinkButton>
                  ),
                },
                { accessorKey: "name", header: "Name" },
                {
                  accessorKey: "parent",
                  header: "Parent",
                  cell: ({ row }) => (
                    <LinkButton
                      from="/students"
                      to="/parents/$id"
                      params={{ id: row.original.parent.id }}
                      variant="underline"
                    >
                      {row.original.parent.name}
                    </LinkButton>
                  ),
                },
                { accessorKey: "email", header: "Email" },
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
              ]}
              initialState={{
                columnVisibility: {
                  created_at: false,
                  updated_at: false,
                },
              }}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </section>
  );
}
