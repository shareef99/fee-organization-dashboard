import Button from "@/components/mantine-wrappers/button";
import Paper from "@/components/mantine-wrappers/paper";
import PasswordInput from "@/components/mantine-wrappers/password-input";
import TextInput from "@/components/mantine-wrappers/text-input";
import Title from "@/components/mantine-wrappers/title";
import { StaffRole } from "@/types/enums";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useUserActions } from "@/store";
import { jwtDecode } from "jwt-decode";
import { parseError } from "@/helpers";
import {
  errorNotification,
  loadingNotification,
  notificationMessages,
  successNotification,
} from "@/helpers/notification";
import { axiosClient } from "@/axios";

export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;
type Decode = {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  role: StaffRole;
  mobile: string;
  iat: number;
  exp: number;
};
function RouteComponent() {
  const { login } = useUserActions();
  const navigate = Route.useNavigate();

  // Form
  const { getInputProps, onSubmit } = useForm<FormValues>({
    validate: zodResolver(schema),
  });

  // Functions
  async function handleSubmit(data: FormValues) {
    try {
      loadingNotification({
        id: "login",
        title: "Login",
        message: notificationMessages.loading,
      });

      const { data: responseData } = await axiosClient.post<{
        message: string;
        accessToken: string;
        refreshToken: string;
      }>("/staff/signin", data);

      const decode = jwtDecode(responseData.accessToken) as Decode;

      login({
        id: decode.id,
        organization_id: decode.organization_id,
        name: decode.name,
        email: decode.email,
        role: decode.role,
        mobile: decode.mobile,
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
      });

      successNotification({
        id: "login",
        title: "Login",
        message: notificationMessages.loading,
      });
      navigate({ from: "/login", to: "/staff" });
    } catch (error) {
      console.error(error);
      errorNotification({
        id: "login",
        title: "Login",
        message: parseError(error, notificationMessages.error),
      });
    }
  }

  return (
    <section className="flex bg-p-background flex-col items-center justify-center min-h-screen">
      <Title className="text-p-primary-dark">Welcome back!</Title>
      <Paper className="p-8 mt-4 w-125">
        <form onSubmit={onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            {...getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            {...getInputProps("password")}
          />
          <Button type="submit" fullWidth mt="xl" variant="primary">
            Sign in
          </Button>
        </form>
      </Paper>
    </section>
  );
}
