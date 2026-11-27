type Props = {
  title?: string;
  description?: string;
  ogp?: string;
};

const absoluteUrl = (value: string) =>
  value.startsWith("http") ? value : `${APP_URL}${value}`;

export const generateMetaTag = ({ title, description, ogp }: Props) => {
  return [
    {
      title: title || "ことひろ",
    },
    {
      name: "description",
      content:
        description ||
        "ことひろは、言葉を重ねてより良い意思決定を目指すサービスです",
    },
    {
      property: "og:title",
      content: title || "ことひろ",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: APP_URL,
    },
    {
      property: "og:image",
      content: absoluteUrl(ogp || "/ogp.webp"),
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
