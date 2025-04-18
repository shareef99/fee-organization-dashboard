import { AppShell, Burger, NavLink, ScrollArea } from "@mantine/core";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import { localStoreKeys } from "@/constants";
import { useUser } from "@/store";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  beforeLoad: () => {
    const localStorageString = localStorage.getItem(localStoreKeys.store);
    const data = localStorageString ? JSON.parse(localStorageString) : null;

    if (!data?.state?.user) {
      throw redirect({ from: "/", to: "/login" });
    }
  },
});

function RouteComponent() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const user = useUser();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      bg="var(--color-p-gray-medium)"
    >
      <AppShell.Header className="flex items-center px-2 gap-2 border-p-gray-dark! bg-p-gray-medium!">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
        />
        <Burger
          opened={desktopOpened}
          onClick={toggleDesktop}
          visibleFrom="sm"
          size="sm"
        />
        Welcome {user?.name}
      </AppShell.Header>
      <AppShell.Navbar className="bg-p-gray-medium! border-p-gray-dark!">
        <AppShell.Section grow component={ScrollArea}>
          <Link to="/organization">
            {({ isActive }) => (
              <NavLink
                label="Organization"
                className={twMerge(
                  "text-p-text text- font-medium hover:bg-p-gray-light!",
                  isActive && "bg-p-gray-light! hover:bg-p-gray-light!"
                )}
              />
            )}
          </Link>
          <Link to="/staff">
            {({ isActive }) => (
              <NavLink
                label="Staff"
                className={twMerge(
                  "text-p-text text- font-medium hover:bg-p-gray-light!",
                  isActive && "bg-p-gray-light! hover:bg-p-gray-light!"
                )}
              />
            )}
          </Link>
        </AppShell.Section>
        <AppShell.Section>
          <Link to="/profile">
            {({ isActive }) => (
              <NavLink
                label="Profile"
                className={twMerge(
                  "text-p-text text- font-medium hover:bg-p-gray-light!",
                  isActive && "bg-p-gray-light! hover:bg-p-gray-light!"
                )}
              />
            )}
          </Link>{" "}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
