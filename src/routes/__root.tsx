import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

export const Route = createRootRoute({
  component: () => (
    <MantineProvider
      theme={{
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Outlet />
      <TanStackRouterDevtools />
    </MantineProvider>
  ),
});
