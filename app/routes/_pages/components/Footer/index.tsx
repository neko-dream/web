import LogoIcon from "~/assets/kotihiro.png";

export const Footer = () => {
  return (
    <footer className="bg-white px-4 py-8">
      <img src={LogoIcon} alt="" className="w-[100px]" />
      <p className="mt-2">
        意見や言葉を重ねて、よりよい意思決定を目指すサービス
      </p>

      <div>
        {links.map(({ items, title }, i) => {
          return (
            <div key={i}>
              <p className="mt-8 font-bold">{title}</p>
              {items.map(({ href, name }, j) => {
                return (
                  <a
                    key={j}
                    href={`https://static.kotohiro.com/${href}`}
                    className="mt-3 table"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {name}
                  </a>
                );
              })}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs">©︎ 2025 kotohiro Inc.</p>
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
        name: "ことひろについて",
        href: "about",
      },
      {
        name: "運営会社",
        href: "company",
      },
      {
        name: "ニュース",
        href: "news",
      },
      {
        name: "電子広告",
        href: "notice",
      },
    ],
  },
];
