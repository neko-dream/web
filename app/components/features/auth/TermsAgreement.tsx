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
    <div className="mt-4 flex items-center">
      {/* FIXME: サーバーにデータを送るようにする */}
      <Checkbox
        id={id}
        label=""
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label="利用規約とプライバシーポリシーに同意する"
      />
      <label htmlFor={id} className="ms-2 font-medium text-gray-900 text-sm">
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
  );
};
