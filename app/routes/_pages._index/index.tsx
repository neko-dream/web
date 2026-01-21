import { Logo } from "~/components/icons";
import "./index.css";
import { AuthenticateCard } from "~/components/features/auth/LoginCard";

export { meta } from "./modules/meta";

export default function Page() {
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

        <AuthenticateCard className="mt-6 shadow-lg" />
      </div>
    </>
  );
}
