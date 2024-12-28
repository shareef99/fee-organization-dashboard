import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: () => {
    // TODO: check for user login
    throw redirect({ from: "/", to: "/staff" });
  },
});

function RouteComponent() {
  return <></>;
}
