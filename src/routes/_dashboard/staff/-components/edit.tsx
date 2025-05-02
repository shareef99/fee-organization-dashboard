import Button from "@/components/mantine-wrappers/button";
import Modal from "@/components/mantine-wrappers/model";
import Select from "@/components/mantine-wrappers/select";
import TextInput from "@/components/mantine-wrappers/text-input";
import { capitalize } from "@/helpers";
import {
  loadingNotification,
  notificationMessages,
  successNotification,
} from "@/helpers/notification";
import { useEditStaff } from "@/routes/_dashboard/staff/-queries";
import { useUser } from "@/store";
import { staffRoles } from "@/types/enums";
import { Staff } from "@/types/staff";
import { ModalProps } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  role: z.enum(staffRoles),
  mobile: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

type Props = ModalProps & {
  staff: Staff;
};
export default function EditStaffModal({ staff, ...props }: Props) {
  const user = useUser();

  // Form
  const { getInputProps, onSubmit, submitting } = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      name: staff.name,
      email: staff.email,
      role: staff.role,
      mobile: staff.mobile,
    },
  });

  // Mutation
  const { mutateAsync } = useEditStaff();

  const submitHandler = async (data: FormValues) => {
    if (!user) return;

    loadingNotification({
      id: "edit",
      title: "Staff",
      message: notificationMessages.loading,
    });

    await mutateAsync(
      {
        payload: { ...data, organization_id: user.organization_id },
        id: staff.id,
      },
      {
        onSuccess: () => {
          successNotification({
            id: "edit",
            title: "Staff",
            message: notificationMessages.added,
          });
          props.onClose();
        },
        onError: () => {
          successNotification({
            id: "edit",
            title: "Staff",
            message: notificationMessages.error,
          });
        },
      }
    );
  };

  return (
    <Modal {...props} title="Edit Staff">
      <form onSubmit={onSubmit(submitHandler)} className="space-y-2">
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
          {...getInputProps("mobile")}
        />
        <Select
          label="Role"
          placeholder="Select Role"
          {...getInputProps("role")}
          data={staffRoles.map((role) => ({
            value: role,
            label: capitalize(role),
          }))}
        />
        <Button type="submit" loading={submitting} fullWidth>
          Save
        </Button>
      </form>
    </Modal>
  );
}
