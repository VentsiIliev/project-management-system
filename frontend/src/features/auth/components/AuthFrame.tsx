import { type PropsWithChildren } from "react";

type AuthFrameProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  summary: string;
}>;

export function AuthFrame({
  children,
  eyebrow,
  summary,
  title,
}: AuthFrameProps) {
  return (
    <main className="screen">
      <div className="screen__backdrop" />
      <div className="screen__content">
        <section className="intro-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="intro-card__title">{title}</h1>
          <p className="intro-card__summary">{summary}</p>
        </section>
        {children}
      </div>
    </main>
  );
}
