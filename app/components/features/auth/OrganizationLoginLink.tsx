import { Link } from "react-router";
import { cn } from "tailwind-variants";
import { Arrow } from "~/components/icons";
export function OrganizationLoginLink({ className }: { className?: string }) {
  return (
    <Link
      to="/organization/login"
      className={cn([
        "flex min-h-11 items-center gap-1.5 rounded text-[13px] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-blue focus-visible:outline-offset-4",
        className,
      ])}
    >
      <span>組織向けログイン</span>
      <Arrow className="-rotate-90" />
    </Link>
  );
}
