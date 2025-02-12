import { tv } from "tailwind-variants";

type Props = {
  src: string;
  title: string;
  className?: string;
};

const button = tv({
  base: "flex h-10 w-full items-center justify-center rounded-full border py-2 hover:opacity-90",
});

export const LoginButton = ({ src, title, className }: Props) => {
  return (
    <a href="./#" className={button({ className })}>
      <img src={src} alt="social icon" className="h-full" />
      <span className="ml-[10px] font-semibold">{title}</span>
    </a>
  );
};
