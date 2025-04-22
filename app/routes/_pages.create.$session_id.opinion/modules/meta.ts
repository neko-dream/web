import type { MetaFunction } from "react-router";
import { generateMetaTag } from "~/utils/metatag";

export const meta: MetaFunction = () => {
  return generateMetaTag({
    title: "意見を投稿する",
  });
};
