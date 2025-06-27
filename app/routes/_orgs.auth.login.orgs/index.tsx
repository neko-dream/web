import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { useRef } from "react";
import { Form } from "react-router";
import type { InferOutput } from "valibot";
import * as v from "valibot";
import { AuthGoogle, AuthLine } from "~/components/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tip } from "~/components/ui/tip";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";
import { EmailLoginForm } from "./components/EmailLoginForm";

export { meta } from "./modules/meta";

// 組織コードフォームスキーマ
const organizationCodeSchema = v.object({
  organizationCode: v.pipe(
    v.string("組織コードの入力は必須です"),
    v.minLength(1, "組織コードの入力は必須です"),
  ),
});

export default function Page() {
  const orgsCodeRef = useRef<HTMLInputElement>(null);

  const [form, fields] = useForm<InferOutput<typeof organizationCodeSchema>>({
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, { schema: organizationCodeSchema });
    },
  });

  const handleSNSLogin = (provider: "google" | "line") => {
    const organizationCode = orgsCodeRef.current?.value || "";

    if (!organizationCode.trim()) {
      // 特定のフィールドのバリデーションを実行
      form.validate({ name: "organizationCode" });
      orgsCodeRef.current?.focus();
      return;
    }

    const baseUrl = provider === "google" ? GOOGLE_LOGIN_URL : LINE_LOGIN_URL;
    const url = `${baseUrl}?organization_code=${encodeURIComponent(organizationCode)}`;
    window.location.href = url;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white px-6 pt-8 pb-8 shadow-sm">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="primary-gradient inline-block text-clip font-bold text-xl">
            🚧 組織ログイン
          </h1>
        </div>

        {/* SNSログイン */}
        <Form
          {...getFormProps(form)}
          className="mx-4 mt-6 flex flex-col items-center space-y-4"
        >
          <Label
            title="組織コード"
            required={true}
            htmlFor="organizationCode"
            tip={<Tip label="必須" required={true} />}
            errors={fields.organizationCode.errors}
          >
            <Input
              {...getInputProps(fields.organizationCode, { type: "text" })}
              id="organizationCode"
              ref={orgsCodeRef}
              placeholder="args-1234"
              error={
                fields.organizationCode.errors &&
                fields.organizationCode.errors.length > 0
              }
            />
          </Label>

          <button
            type="button"
            className="flex h-10 w-full cursor-pointer items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2"
            onClick={() => handleSNSLogin("google")}
          >
            <AuthGoogle />
            <span className="mx-auto font-bold text-gray-700">
              Googleでログイン
            </span>
          </button>
          <button
            type="button"
            className="flex h-10 w-full cursor-pointer items-center justify-between rounded-full border border-none bg-[#06C755] px-6 py-2 pl-5"
            onClick={() => handleSNSLogin("line")}
          >
            <AuthLine />
            <span className="mx-auto font-bold text-white">LINEでログイン</span>
          </button>
        </Form>

        <EmailLoginForm />
      </div>
    </div>
  );
}
