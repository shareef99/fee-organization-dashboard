import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/students/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/students/"!</div>
}
