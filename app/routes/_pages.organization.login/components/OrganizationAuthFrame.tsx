import type { ReactNode } from "react";
import { AnimatedHexagonBackground } from "~/components/features/auth/AnimatedHexagonBackground";
import { Logo } from "~/components/icons";

/**
 * 組織向けログインの2列レイアウト（PCは左にブランド、右にフォーム）
 */
export const OrganizationAuthFrame = ({
  children,
}: { children: ReactNode }) => {
  return (
    <section className="auth-card organization-auth">
      <div className="organization-auth-brand">
        <AnimatedHexagonBackground />
        <div className="text-center">
          <Logo className="organization-auth-logo" aria-label="ことひろ" />
          <p className="organization-auth-copy">
            ことひろは、言葉を重ねて
            <br />
            より良い意思決定を目指すサービスです。
          </p>
        </div>
      </div>
      <div className="organization-auth-form">{children}</div>
    </section>
  );
};
