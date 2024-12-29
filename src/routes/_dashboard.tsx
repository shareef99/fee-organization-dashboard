import { AppShell, Burger, Group, ScrollArea, Skeleton } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import { localStoreKeys } from "@/constants";

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
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
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
          Organization Logo
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          60 links in a scrollable section
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>
          Navbar footer - always at the bottom
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
