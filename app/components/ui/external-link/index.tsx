import { SquareArrowOutUpRight } from "lucide-react";
import type { ComponentProps } from "react";

console.info(
  "📦 Lucide Icons\nISC License\nCopyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT).\nAll other copyright (c) for Lucide are held by Lucide Contributors 2025.\n\nReleased under the ISC License.",
);

type Props = ComponentProps<"a"> & {
  href: string;
};

export const ExternalLink = ({ children, className, ...props }: Props) => {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <SquareArrowOutUpRight className="ml-0.5 inline-block h-3 w-3" />
    </a>
  );
};
