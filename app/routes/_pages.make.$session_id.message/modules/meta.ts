import { generateMetaTag } from "~/utils/metatag";

export const meta = () => {
  return generateMetaTag({
    title: "メッセージを書く",
  });
};
