import { type MouseEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { cn } from "tailwind-variants";
import { Arrow } from "~/components/icons";
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
  const [isChecked, setChecked] = useState(false);
  const [isSubmitting, startSubmitting] = useState(false);

  const handleGuestLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!isChecked || isSubmitting) {
      e.preventDefault();
      return;
    }

    startSubmitting(true);
    let errorFlag = false;

    const { error: guestLoginError } = await api.POST("/auth/guest/login", {
      credentials: "include",
    });
    errorFlag = !!guestLoginError;

    const { error: tokenInfoError } = await api.GET("/auth/token/info", {
      credentials: "include",
    });
    errorFlag = !!tokenInfoError;

    if (errorFlag) {
      startSubmitting(false);
      toast.error("ゲストログインに失敗しました");
    } else if (onSuccess) {
      startSubmitting(false);
      onSuccess();
    } else {
      navigate("/home");
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
        <p className="primary-gradient mx-auto inline-block text-clip text-center font-bold">
          ことひろに参加しよう
        </p>
        <p className="text-center text-xs">3つの方法から参加できます</p>

        <TermsAgreement checked={isChecked} onChange={setChecked} />

        <div className="mx-4 mt-6 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleGuestLogin}
            className={cn([
              "flex h-10 w-full items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2",
              (!isChecked || isSubmitting) && "cursor-not-allowed opacity-60",
            ])}
          >
            <span className="mx-auto font-bold text-gray-700">
              ゲストとしてログイン
            </span>
          </button>

          <div className="w-full border-gray-300 border-t border-dashed" />

          <AuthProviderLinks
            disabled={!isChecked || isSubmitting}
            onClick={handlePreventDefault}
          />

          {useWithoutLoggingIn && (
            <Link
              to="/home"
              className="mt-6 flex items-center space-x-2 font-bold text-gray-600 text-sm"
            >
              <span>ログインせずに使う</span>
              <Arrow className="-rotate-90" />
            </Link>
          )}
        </div>
      </AuthFrame>
      <OrganizationLoginLink className="mx-auto mt-4 mb-6 w-fit justify-center" />
    </>
  );
};
