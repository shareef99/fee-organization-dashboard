import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/not-access/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/not-access/"!</div>
}
