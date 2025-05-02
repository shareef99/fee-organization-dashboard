import Button from "@/components/mantine-wrappers/button";
import { useUserActions } from "@/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useUserActions();

  return (
    <div>
      Hello "/_dashboard/profile/"!
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
