import { LoaderFunction, redirect } from "react-router";

/**
 * 外部のページにリダイレクトするページ
 *
 * オープンリダイレクト対策: https://www.mbsd.jp/research/20220526/open-redirect/
 * loaderの中でクエリを作成することで外部から操作できないようにしています。
 *
 * @query signup でバックエンドの認証サーバーに飛びます。
 */
export const loader: LoaderFunction = ({ params }) => {
  try {
    switch (params?.id || "") {
      case "signup": {
        const loginURL = new URL("auth/google/login", API_BASE_URL);
        const signupURL = new URL("signup", BASE_URL);
        loginURL.searchParams.append("redirect_url", signupURL.toString());

        return redirect(loginURL.toString());
      }
      default:
        return redirect("/");
    }
  } catch (e) {
    console.error(e);
    return redirect("/");
  }
};
