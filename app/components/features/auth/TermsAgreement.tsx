import { useId } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { ExternalLink } from "~/components/ui/external-link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * 利用規約・プライバシーポリシーへの同意チェック
 */
export const TermsAgreement = ({ checked, onChange }: Props) => {
  const id = useId();

  return (
    <div className="mt-5 flex min-h-11 items-center">
      {/* FIXME: サーバーにデータを送るようにする */}
      <Checkbox
        id={id}
        label=""
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label="利用規約とプライバシーポリシーに同意する"
      />
      <label
        htmlFor={id}
        className="ms-2.5 text-[12px] text-ink-muted leading-[18px]"
      >
        <ExternalLink
          href="https://static.kotohiro.com/tos"
          className="inline-flex min-h-11 items-center font-medium text-[#0066cc] underline-offset-2 hover:underline"
        >
          利用規約
        </ExternalLink>
        と
        <ExternalLink
          href="https://static.kotohiro.com/privacy-policy"
          className="inline-flex min-h-11 items-center font-medium text-[#0066cc] underline-offset-2 hover:underline"
        >
          プライバシーポリシー
        </ExternalLink>
        に同意する
      </label>
    </div>
  );
};
