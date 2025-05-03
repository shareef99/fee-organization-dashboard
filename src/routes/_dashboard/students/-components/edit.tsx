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
import { useEditStudent } from "@/routes/_dashboard/students/-queries";
import { useUser } from "@/store";
import { genders } from "@/types/enums";
import { Student } from "@/types/student";
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
  gender: z.enum(genders).nullable(),
});

type FormValues = z.infer<typeof schema>;

type Props = ModalProps & {
  student: Student;
};
export default function EditStudentModal({ student, ...props }: Props) {
  const user = useUser();

  // Form
  const { getInputProps, onSubmit, submitting } = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      grade_id: student.grade_id.toString(),
      academic_year_id: student.academic_year_id.toString(),
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      dob: student.dob,
      gender: student.gender,
    },
  });

  // Queries
  const { data: grades, error: gradesError } = useQuery(getGrades());
  const { data: academicYears, error: academicYearsError } = useQuery(
    getAcademicYears()
  );

  // Mutation
  const { mutateAsync } = useEditStudent();

  const submitHandler = async (data: FormValues) => {
    if (!user) return;

    loadingNotification({
      id: "edit",
      title: "Student",
      message: notificationMessages.loading,
    });

    await mutateAsync(
      {
        payload: {
          grade_id: +data.grade_id,
          academic_year_id: +data.academic_year_id,
          name: data.name,
          email: data.email,
          mobile: data.mobile?.trim() || null,
          dob: data.dob?.trim() || null,
          gender: data.gender,
          is_active: true,
        },
        id: student.id,
      },
      {
        onSuccess: () => {
          successNotification({
            id: "edit",
            title: "Student",
            message: notificationMessages.edited,
          });
          props.onClose();
        },
        onError: () => {
          successNotification({
            id: "edit",
            title: "Student",
            message: notificationMessages.error,
          });
        },
      }
    );
  };

  return (
    <Modal {...props} title="Edit Student">
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
