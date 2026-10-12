import type { ReactNode } from "react";
import { Logo } from "~/components/icons";
import "./auth.css";

export function AuthFrame({
  children,
}: { children: ReactNode; label?: string }) {
  return (
    <section className="auth-card mx-auto mt-10 flex w-[350px] max-w-[calc(100%_-_32px)] flex-col content-center rounded-3xl bg-white px-6 pt-4 pb-8">
      {children}
    </section>
  );
}

export function OrganizationAuthFrame({ children }: { children: ReactNode }) {
  return (
    <section className="auth-card organization-auth">
      <div className="organization-auth-brand">
        <div className="organization-auth-brand-content">
          <Logo className="organization-auth-logo" aria-label="ことひろ" />
          <p>
            ことひろは、言葉を重ねて
            <br />
            より良い意思決定を目指すサービスです。
          </p>
        </div>
      </div>
      <div className="organization-auth-form">{children}</div>
    </section>
  );
}
