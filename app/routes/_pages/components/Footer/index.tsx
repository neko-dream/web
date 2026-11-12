import { Link } from "react-router";
import LogoIcon from "~/assets/kotohiro.png";
import { ExternalLink } from "~/components/ui/external-link";

export const Footer = () => {
  return (
    <footer className="border-line border-t bg-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <img src={LogoIcon} alt="" className="h-8 w-[109px]" />
            <p className="mt-3 text-ink-muted text-sm leading-6">
              意見や言葉を重ねて、よりよい意思決定を目指すサービス
            </p>
          </div>

          <div className="flex gap-12">
            {links.map(({ items, title }, i) => {
              return (
                <div key={i}>
                  <p className="font-bold text-ink text-sm">{title}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {items.map(({ href, name, external, internal }, j) => {
                      if (internal) {
                        return (
                          <Link
                            key={j}
                            to={href}
                            className="text-ink-muted text-sm hover:underline"
                          >
                            {name}
                          </Link>
                        );
                      }
                      const link = external
                        ? href
                        : `https://static.kotohiro.com/${href}`;
                      return (
                        <ExternalLink
                          key={j}
                          href={link}
                          className="text-ink-muted text-sm hover:underline"
                        >
                          {name}
                        </ExternalLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-8 border-line border-t pt-6 text-ink-subtle text-xs">
          ©︎ 2026 kotohiro Inc.
        </p>
      </div>
    </footer>
  );
};

/**
 * 最初の"/"は不要
 */
const links = [
  {
    title: "Legal",
    items: [
      {
        name: "利用規約",
        href: "tos",
      },
      {
        name: "プライバシーポリシー",
        href: "privacy-policy",
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        name: "運営会社",
        href: "https://corp.kotohiro.com",
        external: true,
      },
      {
        name: "お問い合わせ",
        href: "/guide/contact",
        internal: true,
      },
      // {
      //   name: "お知らせ",
      //   href: "news",
      // },
      {
        name: "電子公告",
        href: "notice",
      },
    ],
  },
];
