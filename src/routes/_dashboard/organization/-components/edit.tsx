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
import { useEditOrganization } from "@/routes/_dashboard/organization/-queries";
import { activeStatuses } from "@/types/enums";
import { Organization } from "@/types/organization";
import { ModalProps } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  mobile: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  is_active: z.enum(activeStatuses),
});

type FormValues = z.infer<typeof schema>;

type Props = ModalProps & {
  organization: Organization;
};
export default function EditOrganizationModal({
  organization,
  ...props
}: Props) {
  // Form
  const { getInputProps, onSubmit, submitting } = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      name: organization.name,
      email: organization.email,
      mobile: organization.mobile,
      address: organization.address,
      is_active: organization.is_active ? "active" : "inactive",
    },
  });

  // Mutation
  const { mutateAsync } = useEditOrganization();

  const submitHandler = async (data: FormValues) => {
    loadingNotification({
      id: "edit",
      title: "Organization",
      message: notificationMessages.added,
    });

    await mutateAsync(
      {
        payload: { ...data, is_active: data.is_active === "active" },
        id: organization.id,
      },
      {
        onSuccess: () => {
          successNotification({
            id: "edit",
            title: "Organization",
            message: notificationMessages.added,
          });
          props.onClose();
        },
        onError: () => {
          successNotification({
            id: "edit",
            title: "Organization",
            message: notificationMessages.error,
          });
        },
      }
    );
  };

  return (
    <Modal {...props} title="Add Organization">
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
        <TextInput
          label="Address"
          placeholder="Enter Address"
          {...getInputProps("address")}
        />
        <Select
          label="Active"
          placeholder="Select Active"
          data={activeStatuses.map((status) => ({
            label: capitalize(status),
            value: status,
          }))}
          {...getInputProps("is_active")}
        />
        <Button type="submit" loading={submitting} fullWidth>
          Save
        </Button>
      </form>
    </Modal>
  );
}
