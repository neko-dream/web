import Logo from "~/assets/kotihiro.png";
import LINE_PNG from "~/assets/auth/LINE.png";
import GOOGLE_PNG from "~/assets/auth/Google.png";
import { LoginButton } from "./components/LoginButton";

const CIRCLES_COUNT = Array(10).fill(null);

export default function Index() {
  return (
    <>
      <div className="area">
        <ul className="circles">
          {CIRCLES_COUNT.map((_, i) => (
            <li key={i} />
          ))}
        </ul>
      </div>

      <div className="flex h-screen content-center">
        <div className="m-auto flex w-[350px] flex-col content-center rounded-lg bg-white p-4 shadow-lg">
          <img src={Logo} alt="" className="mx-auto w-52 -translate-x-4" />

          <div className="mt-6 text-center">
            <p>多種多様な意見や言葉を重ねてよりよい</p>
            <p>意思決定を目指すサービス</p>
          </div>

          <div className="mx-4 mt-8 flex flex-col items-center space-y-4">
            <LoginButton src={GOOGLE_PNG} title="Googleでログインする" />
            <LoginButton
              src={LINE_PNG}
              title="LINEでログインする"
              className="border-none bg-[#06C755] text-white"
            />
          </div>

          <div className="mt-6 flex flex-col space-y-0.5 text-center text-xs">
            <a href="./#" className="hover:underline">
              利用規約
            </a>
            <a href="./#" className="hover:underline">
              個人情報保護方針
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
