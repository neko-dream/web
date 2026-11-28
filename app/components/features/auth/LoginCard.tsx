import { type MouseEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Arrow } from "~/components/icons";
import { useAuthStore } from "~/hooks/useAuthStore";
import { api } from "~/libs/openapi-fetch";
import { AuthFrame } from "./AuthFrame";
import { AuthProviderLinks } from "./AuthProviderLinks";
import { OrganizationLoginLink } from "./OrganizationLoginLink";
import { TermsAgreement } from "./TermsAgreement";

type Props = {
  className?: string;
  onSuccess?: () => void;
  useWithoutLoggingIn?: boolean;
};

export const AuthenticateCard = ({
  className,
  onSuccess,
  useWithoutLoggingIn = true,
}: Props) => {
  const navigate = useNavigate();
  const refresh = useAuthStore((state) => state.refresh);
  const [isChecked, setChecked] = useState(false);
  const [isSubmitting, startSubmitting] = useState(false);

  const handleGuestLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!isChecked || isSubmitting) {
      e.preventDefault();
      return;
    }

    startSubmitting(true);

    const { error: guestLoginError } = await api.POST("/auth/guest/login", {
      credentials: "include",
    });

    if (guestLoginError) {
      startSubmitting(false);
      toast.error("ゲストログインに失敗しました");
      return;
    }

    // ヘッダーなどがログイン前の状態のまま残らないよう、共有ストアを更新する
    await refresh();
    if (!useAuthStore.getState().user) {
      startSubmitting(false);
      toast.error("ゲストログインに失敗しました");
      return;
    }

    if (onSuccess) {
      startSubmitting(false);
      onSuccess();
    } else {
      navigate("/home", { replace: true });
    }
  };

  const handlePreventDefault = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isChecked || isSubmitting) {
      e.preventDefault();
      return;
    }

    startSubmitting(true);
  };

  return (
    <>
      <AuthFrame className={className}>
        <h2 className="text-center font-bold text-[19px] text-ink tracking-tight">
          ことひろに参加しよう
        </h2>
        <p className="mt-1.5 text-center text-[13px] text-ink-muted">
          ゲストでも、すぐに参加できます
        </p>

        <TermsAgreement checked={isChecked} onChange={setChecked} />

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleGuestLogin}
            aria-disabled={!isChecked || isSubmitting}
            className={`flex h-12 w-full items-center justify-center rounded-2xl bg-ink px-4 font-bold text-[15px] text-white transition-opacity active:opacity-90 ${
              !isChecked || isSubmitting ? "!cursor-not-allowed opacity-60" : ""
            }`}
          >
            ゲストとしてログイン
          </button>

          <div className="my-1 flex w-full items-center gap-3 text-[11px] text-ink-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
            または
          </div>

          <AuthProviderLinks
            disabled={!isChecked || isSubmitting}
            onClick={handlePreventDefault}
          />

          {useWithoutLoggingIn && (
            <Link
              to="/home"
              className="mt-2 flex min-h-11 items-center gap-1.5 font-medium text-[13px] text-ink-muted hover:text-ink"
            >
              <span>ログインせずに使う</span>
              <Arrow className="-rotate-90" />
            </Link>
          )}
        </div>
      </AuthFrame>
      <OrganizationLoginLink className="mx-auto mt-4 mb-2 w-fit justify-center rounded-full bg-white/90 px-4 backdrop-blur-sm" />
    </>
  );
};
