import { type MouseEvent, useState } from "react";
import { Link } from "react-router";
import { AuthFrame } from "~/components/features/auth/AuthFrame";
import { AuthProviderLinks } from "~/components/features/auth/AuthProviderLinks";
import { OrganizationLoginLink } from "~/components/features/auth/OrganizationLoginLink";
import { Arrow } from "~/components/icons";
import { Checkbox } from "~/components/ui/checkbox";
import { ExternalLink } from "~/components/ui/external-link";
export { meta } from "./modules/meta";
export const headers = () => ({
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
});
export default function Page() {
  const [agreed, setAgreed] = useState(false);
  const busy = false;
  const guardOAuth = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!agreed || busy) {
      event.preventDefault();
    }
  };
  return (
    <>
      <AuthFrame>
        <>
          <h1 className="primary-gradient text-clip text-center font-bold">
            ことひろにログイン
          </h1>
          <p className="text-center text-xs">Google・LINEでログインできます</p>
          <div className="mt-4 flex items-center">
            <Checkbox
              id="login-agreement"
              label=""
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              aria-label="利用規約とプライバシーポリシーに同意する"
            />
            <label
              htmlFor="login-agreement"
              className="ms-2 font-medium text-gray-900 text-sm"
            >
              <ExternalLink
                href="https://static.kotohiro.com/tos"
                className="text-cs-blue-600"
              >
                利用規約
              </ExternalLink>
              ・
              <ExternalLink
                href="https://static.kotohiro.com/privacy-policy"
                className="text-cs-blue-600"
              >
                プライバシーポリシー
              </ExternalLink>
              に同意して始める
            </label>
          </div>
          <div className="mx-4 mt-6 flex flex-col items-center">
            <AuthProviderLinks
              disabled={!agreed || busy}
              onClick={guardOAuth}
            />
            <Link
              to="/"
              className="mt-6 flex items-center space-x-2 font-bold text-gray-600 text-sm"
            >
              <span>新規登録はこちら</span>
              <Arrow className="-rotate-90" />
            </Link>
          </div>
        </>
      </AuthFrame>
      <OrganizationLoginLink className="mx-auto mt-4 mb-6 w-fit justify-center" />
    </>
  );
}
