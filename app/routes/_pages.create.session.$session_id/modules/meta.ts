import type { Route } from "~/react-router/_pages.create.session.$session_id/+types";
import { generateMetaTag } from "~/utils/metatag";

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  return generateMetaTag({
    title: data.isEditMobe ? "セッションを編集する" : "セッションを作成する",
  });
};
