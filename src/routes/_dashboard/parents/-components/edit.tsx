import Button from "@/components/mantine-wrappers/button";
import Modal from "@/components/mantine-wrappers/model";
import TextInput from "@/components/mantine-wrappers/text-input";
import {
  loadingNotification,
  notificationMessages,
  successNotification,
} from "@/helpers/notification";
import { useEditParent } from "@/routes/_dashboard/parents/-queries";
import { useUser } from "@/store";
import { Parent } from "@/types/parent";
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

type Props = ModalProps & {
  parent: Parent;
};
export default function EditParentModal({ parent, ...props }: Props) {
  const user = useUser();

  // Form
  const { getInputProps, onSubmit, submitting } = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      name: parent.name,
      email: parent.email,
      mobile: parent.mobile,
      address: parent.address,
    },
  });

  // Mutation
  const { mutateAsync } = useEditParent();

  const submitHandler = async (data: FormValues) => {
    if (!user) return;

    loadingNotification({
      id: "edit",
      title: "Parent",
      message: notificationMessages.loading,
    });

    await mutateAsync(
      {
        payload: { ...data, organization_id: user.organization_id },
        id: parent.id,
      },
      {
        onSuccess: () => {
          successNotification({
            id: "edit",
            title: "Parent",
            message: notificationMessages.edited,
          });
          props.onClose();
        },
        onError: () => {
          successNotification({
            id: "edit",
            title: "Parent",
            message: notificationMessages.error,
          });
        },
      }
    );
  };

  return (
    <Modal {...props} title="Edit Parent">
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
