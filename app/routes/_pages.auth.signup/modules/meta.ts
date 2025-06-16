import type { MetaFunction } from "react-router";
import { generateMetaTag } from "~/utils/metatag";

export const meta: MetaFunction = () => {
  return generateMetaTag({
    title: "ことひろに登録する",
  });
};
