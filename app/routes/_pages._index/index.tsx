import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";
import {
  Arrow,
  AuthGoogle,
  AuthLine,
  FaviconKotohiro,
} from "~/components/Icons";
import { TopicCard } from "./components/TopicCard";
import { CarouselScroll } from "./components/CarouselScroll";
import { memo } from "react";
import "./index.css";

function Page() {
  return (
    <>
      <div className="area">
        <ul className="circles">
          {Array.from({ length: 20 }).map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div>

      <div className="mt-18 flex flex-col justify-center">
        <div className="flex items-center justify-center">
          <FaviconKotohiro className="w-20" />
          <p className="ml-2 text-6xl font-black">ことひろ</p>
        </div>
        <div className="mt-2 text-center">
          <p>ことひろは、言葉を重ねて</p>
          <p>より良い意思決定を目指すサービスです</p>
        </div>

        <div className="mx-auto mt-6 flex w-[350px] flex-col content-center rounded-3xl bg-white px-6 pt-4 pb-8 shadow-lg">
          <p className="primary-gradient text-center font-bold text-clip">
            ことひろに参加しよう
          </p>
          <p className="text-center text-xs">2つの方法から参加できます</p>

          <div className="mt-4 flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-lg border border-gray-400 text-blue-600 checked:border-blue-400 checked:bg-blue-500"
            />
            <label
              htmlFor="terms"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              <a href="./#" className="text-[#007AFF]">
                利用規約
              </a>
              、
              <a href="./#" className="text-[#007AFF]">
                プライバシーポリシー
              </a>
              に同意して始める
            </label>
          </div>

          <div className="mx-4 mt-6 flex flex-col items-center">
            <a
              href={GOOGLE_LOGIN_URL}
              className="flex h-10 w-full items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2"
            >
              <AuthGoogle />
              <span className="mx-auto font-bold text-gray-700">
                Googleでアカウント作成
              </span>
            </a>
            <a
              href={LINE_LOGIN_URL}
              className="mt-4 flex h-10 w-full items-center justify-between rounded-full border border-none bg-[#06C755] px-6 py-2 pl-5"
            >
              <AuthLine />
              <span className="mx-auto font-bold text-white">
                LINEでアカウント作成
              </span>
            </a>

            <a
              href="/login"
              className="mt-6 flex items-center space-x-2 text-sm font-bold text-gray-600"
            >
              <span>アカウントをお持ちの方はこちら</span>
              <Arrow className="-rotate-90" />
            </a>
          </div>
        </div>
      </div>

      <p className="primary-gradient mt-16 mb-4 text-center text-2xl font-bold text-clip">
        注目のトピック
      </p>

      <CarouselScroll>
        {Array.from({ length: 5 }).map((_, i) => (
          <TopicCard key={i} />
        ))}
      </CarouselScroll>
    </>
  );
}

export default memo(Page);
