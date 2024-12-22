import { MetaFunction } from "react-router";

type Props = {
  title?: string;
  description?: string;
  ogp?: string;
};

export const generateMetaTag = ({ title, description, ogp }: Props) => {
  const meta: MetaFunction = () => {
    return [
      {
        property: "og:title",
        content: title || "ことひろ",
      },
      {
        property: "og:property",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://www.kotohiro.com",
      },
      {
        property: "og:image",
        // WIP
        content: ogp || "/ogp.png",
      },
      {
        property: "og:site_name",
        content: "ことひろ",
      },
      {
        property: "og:description",
        content:
          description ||
          "多種多様な意見や言葉を重ねてよりよい意思決定を目指すサービス",
      },
    ];
  };

  return meta;
};
