import type { MetaFunction } from "react-router";
import { generateMetaTag } from "~/utils/metatag";

export const meta: MetaFunction = () => {
  return generateMetaTag({
    title: "追加のデモグラ情報を入力する",
  });
};
