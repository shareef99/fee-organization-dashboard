import { Paper as MPaper, PaperProps } from "@mantine/core";
import { ReactNode } from "@tanstack/react-router";

type Props = PaperProps & {
  children: ReactNode;
};
export default function Paper(props: Props) {
  return (
    <MPaper
      withBorder
      shadow="md"
      radius="md"
      bg="var(--color-p-gray-light)"
      {...props}
    />
  );
}
