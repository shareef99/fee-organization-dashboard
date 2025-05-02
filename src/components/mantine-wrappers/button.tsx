import {
  Button as MButton,
  ButtonProps,
  ButtonStylesNames,
  ElementProps,
} from "@mantine/core";
import { ReactNode } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

type Props = ElementProps<"button", keyof ButtonProps> &
  ButtonProps & {
    children: ReactNode;
    classNames?: Partial<Record<ButtonStylesNames, string>>;
    variant?:
      | "primary"
      | "primary-outline"
      | "secondary"
      | "secondary-outline"
      | "accent"
      | "accent-outline"
      | "success"
      | "success-outline"
      | "warning"
      | "warning-outline"
      | "error"
      | "error-outline"
      | "transparent";
  };
export default function Button({
  classNames,
  variant = "primary",
  ...props
}: Props) {
  return (
    <MButton
      type="button"
      {...props}
      className={twMerge(
        "transition-colors duration-300 ease-in",
        variant === "primary" &&
          "bg-p-primary! text-p-gray-light! hover:bg-p-primary-dark! focus:outline-p-primary-dark!",
        variant === "primary-outline" &&
          "border-p-primary! text-p-primary! bg-transparent! hover:bg-p-primary! focus:outline-p-primary! hover:text-p-gray-light!",
        variant === "accent" &&
          "bg-p-accent! text-p-gray-light! hover:bg-p-accent-dark! focus:outline-p-accent-dark!",
        variant === "accent-outline" &&
          "border-p-accent! text-p-accent! bg-transparent! hover:bg-p-accent! focus:outline-p-accent! hover:text-p-gray-light!",
        variant === "success" &&
          "bg-p-success! text-p-gray-light! hover:bg-p-success/80! focus:outline-p-success/80!",
        variant === "success-outline" &&
          "border-p-success! text-p-success! bg-transparent! hover:bg-p-success! focus:outline-p-success! hover:text-p-gray-light!",
        variant === "warning" &&
          "bg-p-warning! text-p-gray-light! hover:bg-p-warning/80! focus:outline-p-warning/80!",
        variant === "warning-outline" &&
          "border-p-warning! text-p-warning! bg-transparent! hover:bg-p-warning! focus:outline-p-warning! hover:text-p-gray-light!",
        variant === "error" &&
          "bg-p-error! text-p-gray-light! hover:bg-p-error/80! focus:outline-p-error/80!",
        variant === "error-outline" &&
          "border-p-error! text-p-error! bg-transparent! hover:bg-p-error! focus:outline-p-error! hover:text-p-gray-light!",
        variant === "transparent" &&
          "bg-transparent! text-p-text! hover:bg-p-gray-medium! focus:outline-p-gray-medium!",
        props.className
      )}
      classNames={classNames}
    />
  );
}
