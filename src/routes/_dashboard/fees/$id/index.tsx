import { parseIdParams } from "@/helpers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/fees/$id/")({
  component: RouteComponent,
  params: {
    parse: parseIdParams,
  },
});

function RouteComponent() {
  return <div>Hello "/_dashboard/fees/$id/"!</div>;
}
