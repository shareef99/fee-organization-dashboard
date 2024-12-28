import { Button, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

export default function App() {
  return (
    <MantineProvider>
      <Button>Hello World</Button>
      <h1 className="text-center text-2xl font-bold ">Hello World</h1>
    </MantineProvider>
  );
}
