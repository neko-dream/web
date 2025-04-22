import type { MetaFunction } from "react-router";
import { generateMetaTag } from "~/utils/metatag";

export const meta: MetaFunction = () => {
  return generateMetaTag({
    title: "ことひろ",
    description: "多種多様な意見や言葉を重ねてよりよい意思決定を目指すサービス",
    ogp: "/ogp.webp",
  });
};
