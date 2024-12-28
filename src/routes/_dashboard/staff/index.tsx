import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/staff/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/staff/"!</div>;
}