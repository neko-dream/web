import { tv } from "tailwind-variants";

type Props = {
  href: string;
  src?: string;
  title: string;
  className?: string;
};

const button = tv({
  base: "flex h-10 w-full items-center justify-center rounded-full border py-2 hover:opacity-90",
});

export const LoginButton = ({ src, title, className, href }: Props) => {
  return (
    <a href={href} className={button({ className })}>
      {src && <img src={src} alt="social icon" className="mr-[10px] h-full" />}
      <span className="font-medium">{title}</span>
    </a>
  );
};
