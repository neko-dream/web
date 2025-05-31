import { Arrow, AuthGoogle, AuthLine, Logo } from "~/components/icons";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";
import "./index.css";
import { useState } from "react";
import { Link } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";

export { meta } from "./modules/meta";

export default function Page() {
  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <div className="area">
        <ul className="circles">
          {Array.from({ length: 20 }).map((_, i) => (
            <li key={i} />
          ))}
        </ul>
      </div>

      <div className="mt-18 flex flex-col justify-center">
        <div className="mx-auto inline-block items-center justify-center rounded-md backdrop-blur-[20px]">
          <span className="flex items-center">
            <Logo className="-translate-x-2 size-[500px] h-30 w-[380px]" />
          </span>
        </div>
        <div className="mx-auto mt-2 inline-block rounded-md p-2 text-center backdrop-blur-[20px]">
          <p>ことひろは、言葉を重ねて</p>
          <p>より良い意思決定を目指すサービスです</p>
        </div>

        <div className="mx-auto mt-6 flex w-[350px] flex-col content-center rounded-3xl bg-white px-6 pt-4 pb-8 shadow-lg">
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
      </div>

      {/* <div className="mt-16 mb-4 text-center">
        <p className="primary-gradient inline-block text-clip rounded-md p-2 font-bold text-2xl backdrop-blur-[20px]">
          注目のトピック
        </p>
      </div> */}

      {/* <CarouselScroll>
        {Array.from({ length: 5 }).map((_, i) => (
          <TopicCard key={i} />
        ))}
      </CarouselScroll> */}
    </>
  );
}
