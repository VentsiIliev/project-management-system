import { type PropsWithChildren } from "react";

type StatusTone = "error" | "info" | "warning";

type StatusMessageProps = PropsWithChildren<{
  tone?: StatusTone;
  title?: string;
}>;

export function StatusMessage({
  children,
  title,
  tone = "info",
}: StatusMessageProps) {
  return (
    <div className={`message message--${tone}`} role={tone === "error" ? "alert" : "status"}>
      {title ? <p className="message__title">{title}</p> : null}
      <p className="message__body">{children}</p>
    </div>
  );
}
