import Button from "@/components/mantine-wrappers/button";
import Paper from "@/components/mantine-wrappers/paper";
import PasswordInput from "@/components/mantine-wrappers/password-input";
import TextInput from "@/components/mantine-wrappers/text-input";
import Title from "@/components/mantine-wrappers/title";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex bg-p-background flex-col items-center justify-center min-h-screen">
      <Title className="text-p-primary-dark">Welcome back!</Title>
      <Paper className="p-8 mt-4 w-125">
        <TextInput label="Email" placeholder="you@mantine.dev" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" />
        <Button fullWidth mt="xl" variant="primary">
          Sign in
        </Button>
      </Paper>
    </section>
  );
}
