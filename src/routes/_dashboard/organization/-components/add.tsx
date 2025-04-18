import Button from "@/components/mantine-wrappers/button";
import Modal from "@/components/mantine-wrappers/model";
import TextInput from "@/components/mantine-wrappers/text-input";
import {
  loadingNotification,
  notificationMessages,
  successNotification,
} from "@/helpers/notification";
import { useAddOrganization } from "@/routes/_dashboard/organization/-queries";
import { ModalProps } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  mobile: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

type Props = ModalProps;
export default function AddOrganizationModal(props: Props) {
  // Form
  const { getInputProps, onSubmit, submitting } = useForm<FormValues>({
    validate: zodResolver(schema),
  });

  // Mutation
  const { mutateAsync } = useAddOrganization();

  const submitHandler = async (data: FormValues) => {
    loadingNotification({
      id: "add",
      title: "Organization",
      message: notificationMessages.added,
    });

    await mutateAsync(data, {
      onSuccess: () => {
        successNotification({
          id: "add",
          title: "Organization",
          message: notificationMessages.added,
        });
        props.onClose();
      },
      onError: () => {
        successNotification({
          id: "add",
          title: "Organization",
          message: notificationMessages.error,
        });
      },
    });
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
        <Button type="submit" loading={submitting} fullWidth>
          Save
        </Button>
      </form>
    </Modal>
  );
}
