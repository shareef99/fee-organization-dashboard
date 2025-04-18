import { Select as MSelect } from "@mantine/core";
import type { SelectProps } from "@mantine/core";

type Props = SelectProps;
export default function Select({ ...props }: Props) {
  return (
    <MSelect
      withAsterisk
      searchable
      checkIconPosition="right"
      nothingFoundMessage="Nothing found..."
      {...props}
    />
  );
}
