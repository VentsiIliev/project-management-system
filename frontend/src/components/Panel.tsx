import { type PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<{
  className?: string;
}>;

export function Panel({ children, className }: PanelProps) {
  const classes = ["panel", className ?? ""].filter(Boolean).join(" ");
  return <section className={classes}>{children}</section>;
}
