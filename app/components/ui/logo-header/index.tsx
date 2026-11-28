import type { ReactNode } from "react";
import { Link } from "react-router";
import LogoIcon from "~/assets/kotohiro.png";

type Props = {
  right?: ReactNode;
};

/**
 * タブ画面共通のブランドヘッダー
 */
export const LogoHeader = ({ right }: Props) => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-5 pb-2">
      <div className="relative flex h-8 items-center">
        <Link
          to="/home"
          aria-label="ホームに戻る"
          className="flex h-full flex-1 items-center rounded focus-visible:outline-2 focus-visible:outline-brand-blue focus-visible:outline-offset-4"
        >
          <img src={LogoIcon} alt="ことひろ" className="h-8 w-[109px]" />
        </Link>
        {right && (
          <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center">
            {right}
          </div>
        )}
      </div>
    </div>
  );
};
