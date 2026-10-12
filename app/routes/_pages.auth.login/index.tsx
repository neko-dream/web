import { type MouseEvent, useState } from "react";
import { Link } from "react-router";
import { AuthFrame } from "~/components/features/auth/AuthFrame";
import { AuthProviderLinks } from "~/components/features/auth/AuthProviderLinks";
import { OrganizationLoginLink } from "~/components/features/auth/OrganizationLoginLink";
import { TermsAgreement } from "~/components/features/auth/TermsAgreement";
import { Arrow } from "~/components/icons";

export { meta } from "./modules/meta";
export { authHeaders as headers } from "~/components/features/auth/authHeaders";

export default function Page() {
  const [agreed, setAgreed] = useState(false);

  const guardOAuth = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!agreed) {
      event.preventDefault();
    }
  };

  return (
    <>
      <AuthFrame>
        <h1 className="primary-gradient text-clip text-center font-bold">
          ことひろにログイン
        </h1>
        <p className="text-center text-xs">Google・LINEでログインできます</p>
        <TermsAgreement checked={agreed} onChange={setAgreed} />
        <div className="mx-4 mt-6 flex flex-col items-center">
          <AuthProviderLinks disabled={!agreed} onClick={guardOAuth} />
          <Link
            to="/"
            className="mt-6 flex items-center space-x-2 font-bold text-gray-600 text-sm"
          >
            <span>新規登録はこちら</span>
            <Arrow className="-rotate-90" />
          </Link>
        </div>
      </AuthFrame>
      <OrganizationLoginLink className="mx-auto mt-4 mb-6 w-fit justify-center" />
    </>
  );
}
