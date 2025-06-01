import type { Route } from "~/react-router/_pages.make.$session_id._index/+types";
import { generateMetaTag } from "~/utils/metatag";

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  return generateMetaTag({
    title: data.isEditMode ? "セッションを編集する" : "セッションを作成する",
  });
};
