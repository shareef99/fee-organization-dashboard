import { twMerge } from "tailwind-merge";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { forwardRef } from "react";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "underline" | "gray";
}

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  ({ variant = "primary", ...props }, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        {...props}
        className={twMerge(
          "text-p rounded-md px-4 py-1.5 font-medium",
          variant === "primary" && "bg-p-primary text-p-secondary",
          variant === "secondary" && "bg-p-accent text-p-secondary",
          variant === "gray" && "bg-p-gray-300 text-p-primary",
          variant === "underline" &&
            "p-0 text-p-primary underline decoration-p-primary underline-offset-4 hover:no-underline",
          props.className
        )}
      >
        {props.children}
      </a>
    );
  }
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

const LinkButton: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};

export default LinkButton;
