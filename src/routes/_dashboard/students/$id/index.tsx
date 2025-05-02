import { parseIdParams } from "@/helpers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/students/$id/")({
  component: RouteComponent,
  params: {
    parse: parseIdParams,
  },
});

function RouteComponent() {
  return <div>Hello "/_dashboard/students/$id/"!</div>;
}
