import { type MouseEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { cn } from "tailwind-variants";
import { Arrow, AuthGoogle, AuthLine } from "~/components/icons";
import { Checkbox } from "~/components/ui/checkbox";
import { ExternalLink } from "~/components/ui/external-link";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";
import { api } from "~/libs/openapi-fetch";

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

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

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
    <div
      className={cn([
        "mx-auto flex w-[350px] flex-col content-center rounded-3xl bg-white px-6 pt-4 pb-8",
        className,
      ])}
    >
      <p className="primary-gradient mx-auto inline-block text-clip text-center font-bold">
        ことひろに参加しよう
      </p>
      <p className="text-center text-xs">3つの方法から参加できます</p>

      <div className="mt-4 flex items-center">
        {/* FIXME: サーバーにデータを送るようにする */}
        <Checkbox id="" label="" onChange={handleCheckboxChange} />
        <label
          htmlFor="terms"
          className="ms-2 font-medium text-gray-900 text-sm"
        >
          <ExternalLink
            href="https://static.kotohiro.com/tos"
            className="text-cs-blue-600"
          >
            利用規約
          </ExternalLink>
          ・
          <ExternalLink
            href="https://static.kotohiro.com/privacy-policy"
            className="text-cs-blue-600"
          >
            プライバシーポリシー
          </ExternalLink>
          に同意して始める
        </label>
      </div>

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

        <a
          href={GOOGLE_LOGIN_URL}
          onClick={handlePreventDefault}
          className={cn([
            "flex h-10 w-full items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2",
            (!isChecked || isSubmitting) && "cursor-not-allowed opacity-60",
          ])}
        >
          <AuthGoogle />
          <span className="mx-auto font-bold text-gray-700">
            Googleでログイン
          </span>
        </a>
        <a
          href={LINE_LOGIN_URL}
          onClick={handlePreventDefault}
          className={cn([
            "flex h-10 w-full items-center justify-between rounded-full border border-none bg-[#06C755] px-6 py-2 pl-5",
            (!isChecked || isSubmitting) && "cursor-not-allowed opacity-60",
          ])}
        >
          <AuthLine />
          <span className="mx-auto font-bold text-white">LINEでログイン</span>
        </a>

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
    </div>
  );
};
