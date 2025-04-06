import { Arrow, AuthGoogle, AuthLine } from "~/components/icons";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";

export default function Index() {
  return (
    <div className="mx-auto mt-10 flex w-[350px] flex-col content-center rounded-3xl bg-white px-6 pt-4 pb-8">
      <p className="primary-gradient text-center font-bold">
        ことひろにログイン
      </p>
      <p className="text-center text-xs">2つの方法からログインできます</p>

      <div className="mx-4 mt-6 flex flex-col items-center">
        <a
          href={GOOGLE_LOGIN_URL}
          className="flex h-10 w-full items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2"
        >
          <AuthGoogle />
          <span className="mx-auto font-bold text-gray-700">
            Googleでログイン
          </span>
        </a>
        <a
          href={LINE_LOGIN_URL}
          className="mt-4 flex h-10 w-full items-center justify-between rounded-full border border-none bg-[#06C755] px-6 py-2 pl-5"
        >
          <AuthLine />
          <span className="mx-auto font-bold text-white">LINEでログイン</span>
        </a>
        <a
          href="/"
          className="mt-6 flex items-center space-x-2 font-bold text-gray-600 text-sm"
        >
          <span>新規登録はこちら</span>
          <Arrow className="-rotate-90" />
        </a>
      </div>
    </div>
  );
}
