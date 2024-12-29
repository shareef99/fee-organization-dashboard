import {
  __InputStylesNames,
  TextInput as MTextInput,
  TextInputProps,
} from "@mantine/core";
import { twMerge } from "tailwind-merge";

type Props = TextInputProps & {
  classNames?: Partial<Record<__InputStylesNames, string>>;
};
export default function TextInput({ className, classNames, ...props }: Props) {
  return (
    <MTextInput
      withAsterisk={true}
      {...props}
      className={twMerge("bg-p-gray-light", className)}
      classNames={{
        ...classNames,
        input: twMerge(
          "bg-p-gray-light! focus:border-p-accent! hover:border-p-accent!",
          classNames?.input
        ),
        error: twMerge("text-p-error!", classNames?.error),
      }}
    />
  );
}
