import { PencilIcon } from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<"button"> & { iconProps?: ComponentProps<"svg"> };

export default function EditButton({ iconProps, ...props }: Props) {
  return (
    <button
      {...props}
      className={twMerge("flex m-auto cursor-pointer", props.className)}
    >
      <PencilIcon
        {...iconProps}
        className={twMerge("size-4", iconProps?.className)}
      />
    </button>
  );
}
