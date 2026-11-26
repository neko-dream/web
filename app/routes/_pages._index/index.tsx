import LogoIcon from "~/assets/kotohiro.png";
import { AnimatedHexagonBackground } from "~/components/features/auth/AnimatedHexagonBackground";
import { AuthenticateCard } from "~/components/features/auth/LoginCard";

export { meta } from "./modules/meta";

export default function Page() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-white">
      <AnimatedHexagonBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_110%_at_0%_0%,#fff_42%,rgba(255,255,255,0.8)_58%,rgba(255,255,255,0.08)_88%)]"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-8 pb-12 lg:px-8 lg:pt-10 lg:pb-16">
        <img
          src={LogoIcon}
          alt="ことひろ"
          className="h-9 w-auto self-start sm:h-10"
          loading="eager"
        />

        <div className="flex flex-1 flex-col lg:grid lg:content-center lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-16">
          <section className="mt-7 lg:mt-0 lg:max-w-[30em]">
            <h1 className="font-bold text-[clamp(26px,7.2vw,44px)] text-ink leading-[1.3] tracking-[-0.035em]">
              言葉を重ねて、
              <br />
              より良い意思決定へ。
            </h1>
            <p className="mt-4 max-w-[34em] text-[14px] text-ink-muted leading-7 text-pretty sm:text-[15px]">
              意見を読み、気持ちを重ねる。
              <br />
              みんなの考えが、少しずつ形になります。
            </p>
          </section>

          <section aria-label="ことひろをはじめる" className="mt-8 lg:mt-0">
            <AuthenticateCard />
          </section>
        </div>
      </div>
    </div>
  );
}
