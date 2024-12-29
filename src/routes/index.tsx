import { localStoreKeys } from "@/constants";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: () => {
    const localStorageString = localStorage.getItem(localStoreKeys.store);
    const data = localStorageString ? JSON.parse(localStorageString) : null;

    if (data?.state?.user) {
      throw redirect({ from: "/", to: "/staff" });
    } else {
      throw redirect({ from: "/", to: "/login" });
    }
  },
});

function RouteComponent() {
  return <></>;
}
