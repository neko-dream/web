import { JSX } from "react";

type Props = {
  children?: React.ReactNode;
};

export default function Error({ children }: Props): JSX.Element {
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
}
