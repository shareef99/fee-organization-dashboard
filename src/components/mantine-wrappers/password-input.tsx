import {
  __InputStylesNames,
  PasswordInput as MPasswordInput,
  PasswordInputProps,
} from "@mantine/core";
import { twMerge } from "tailwind-merge";

type Props = PasswordInputProps & {
  classNames?: Partial<Record<__InputStylesNames, string>>;
};
export default function PasswordInput({
  className,
  classNames,
  ...props
}: Props) {
  return (
    <MPasswordInput
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
