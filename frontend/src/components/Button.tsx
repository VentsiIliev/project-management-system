import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  children,
  className,
  fullWidth = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    "button",
    variant === "secondary" ? "button--secondary" : "",
    fullWidth ? "button--full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
