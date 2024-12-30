import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/organization/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/organization/"!</div>
}
