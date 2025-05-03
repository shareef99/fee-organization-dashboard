import Button from "@/components/mantine-wrappers/button";
import Modal from "@/components/mantine-wrappers/model";
import Select from "@/components/mantine-wrappers/select";
import TextInput from "@/components/mantine-wrappers/text-input";
import { capitalize, parseError } from "@/helpers";
import {
  loadingNotification,
  notificationMessages,
  successNotification,
} from "@/helpers/notification";
import { getAcademicYears } from "@/routes/_dashboard/settings/academic-year/-queries";
import { getGrades } from "@/routes/_dashboard/settings/grades/-queries";
import { useAddStudent } from "@/routes/_dashboard/students/-queries";
import { useUser } from "@/store";
import { genders } from "@/types/enums";
import { ModalProps } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const schema = z.object({
  grade_id: z.string().min(1, "Required"),
  academic_year_id: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  mobile: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  gender: z.enum(genders),
});

type FormValues = z.infer<typeof schema>;

type Props = ModalProps & {
  parentId: number;
};
export default function AddStudentModal({ parentId, ...props }: Props) {
  const user = useUser();

  // Form
  const { getInputProps, onSubmit, submitting } = useForm<FormValues>({
    validate: zodResolver(schema),
  });

  // Queries
  const { data: grades, error: gradesError } = useQuery(getGrades());
  const { data: academicYears, error: academicYearsError } = useQuery(
    getAcademicYears()
  );

  // Mutation
  const { mutateAsync } = useAddStudent();

  const submitHandler = async (data: FormValues) => {
    if (!user) return;

    loadingNotification({
      id: "add",
      title: "Student",
      message: notificationMessages.loading,
    });

    await mutateAsync(
      {
        organization_id: user.organization_id,
        parent_id: parentId,
        grade_id: +data.grade_id,
        academic_year_id: +data.academic_year_id,
        name: data.name,
        email: data.email,
        mobile: data.mobile?.trim() || null,
        dob: data.dob?.trim() || null,
        gender: data.gender,
        is_active: true,
      },
      {
        onSuccess: () => {
          successNotification({
            id: "add",
            title: "Student",
            message: notificationMessages.added,
          });
          props.onClose();
        },
        onError: () => {
          successNotification({
            id: "add",
            title: "Student",
            message: notificationMessages.error,
          });
        },
      }
    );
  };

  return (
    <Modal {...props} title="Add Student">
      <form onSubmit={onSubmit(submitHandler)} className="space-y-2">
        <Select
          label="Grade"
          placeholder="Select Grade"
          {...getInputProps("grade_id")}
          data={
            gradesError
              ? [
                  {
                    value: "error",
                    label: parseError(gradesError),
                    disabled: true,
                  },
                ]
              : !grades
              ? [
                  {
                    value: "loading",
                    label: "Loading...",
                    disabled: true,
                  },
                ]
              : grades.map((g) => ({
                  value: g.id.toString(),
                  label: capitalize(g.name),
                }))
          }
        />
        <Select
          label="Academic Year"
          placeholder="Select Academic Year"
          {...getInputProps("academic_year_id")}
          data={
            academicYearsError
              ? [
                  {
                    value: "error",
                    label: parseError(academicYearsError),
                    disabled: true,
                  },
                ]
              : !academicYears
              ? [
                  {
                    value: "loading",
                    label: "Loading...",
                    disabled: true,
                  },
                ]
              : academicYears.map((ay) => ({
                  value: ay.id.toString(),
                  label: capitalize(ay.name),
                }))
          }
        />
        <TextInput
          label="Name"
          placeholder="Enter Name"
          {...getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="Enter Email"
          {...getInputProps("email")}
        />
        <TextInput
          label="Mobile"
          placeholder="Enter Mobile"
          withAsterisk={false}
          {...getInputProps("mobile")}
        />
        <TextInput
          label="Date of Birth"
          placeholder="Enter Date of Birth"
          withAsterisk={false}
          {...getInputProps("dob")}
        />
        <Select
          label="Gender"
          placeholder="Select Gender"
          {...getInputProps("gender")}
          data={genders.map((g) => ({ value: g, label: capitalize(g) }))}
        />
        <Button type="submit" loading={submitting} fullWidth>
          Save
        </Button>
      </form>
    </Modal>
  );
}
