import { Link } from "react-router";
import { Arrow } from "~/components/icons";
export function OrganizationLoginLink({
  className = "",
}: { className?: string }) {
  return (
    <Link
      to="/organization/login"
      className={`flex items-center space-x-2 text-gray-600 text-sm ${className}`}
    >
      <span>組織向けログイン</span>
      <Arrow className="-rotate-90" />
    </Link>
  );
}
