import type { JSX, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const ErrorView = ({ children }: Props): JSX.Element => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {children ? (
        children
      ) : (
        <>
          <p>あちゃ〜〜</p>
          <p>なんかエラーがでちゃ〜〜</p>
        </>
      )}
    </div>
  );
};
