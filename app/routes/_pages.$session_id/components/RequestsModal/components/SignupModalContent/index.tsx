import { useState } from "react";
import { Link } from "react-router";
import { Arrow, AuthGoogle, AuthLine } from "~/components/icons";
import { Checkbox } from "~/components/ui/checkbox";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";

export const SignupModalContent = () => {
  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="flex w-[350px] flex-col content-center rounded-3xl px-6 pt-4 pb-8">
      <p className="primary-gradient mx-auto inline-block text-clip text-center font-bold">
        ことひろに参加しよう
      </p>
      <p className="text-center text-xs">2つの方法から参加できます</p>

      <div className="mt-4 flex items-center">
        {/* FIXME: サーバーにデータを送るようにする */}
        <Checkbox id="" label="" onChange={handleCheckboxChange} />
        <label
          htmlFor="terms"
          className="ms-2 font-medium text-gray-900 text-sm"
        >
          <a
            href="https://static.kotohiro.com/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mt-blue-600"
          >
            利用規約
          </a>
          ・
          <a
            href="https://static.kotohiro.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mt-blue-600"
          >
            プライバシーポリシー
          </a>
          に同意して始める
        </label>
      </div>

      <div className="mx-4 mt-6 flex flex-col items-center">
        <a
          href={GOOGLE_LOGIN_URL}
          onClick={(e) => !isChecked && e.preventDefault()}
          className={`flex h-10 w-full items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2 ${
            isChecked ? "" : "cursor-not-allowed opacity-60"
          }`}
        >
          <AuthGoogle />
          <span className="mx-auto font-bold text-gray-700">
            Googleでアカウント作成
          </span>
        </a>
        <a
          href={LINE_LOGIN_URL}
          onClick={(e) => !isChecked && e.preventDefault()}
          className={`mt-4 flex h-10 w-full items-center justify-between rounded-full border border-none bg-[#06C755] px-6 py-2 pl-5 ${
            isChecked ? "" : "cursor-not-allowed opacity-60"
          }`}
        >
          <AuthLine />
          <span className="mx-auto font-bold text-white">
            LINEでアカウント作成
          </span>
        </a>

        <Link
          to="/auth/login"
          className="mt-6 flex items-center space-x-2 font-bold text-gray-600 text-sm"
        >
          <span>アカウントをお持ちの方はこちら</span>
          <Arrow className="-rotate-90" />
        </Link>
      </div>
    </div>
  );
};
