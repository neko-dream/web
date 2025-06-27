import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { useTransition } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { InferOutput } from "valibot";
import * as v from "valibot";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/libs/openapi-fetch";

// フォームスキーマ
const loginSchema = v.object({
  email: v.string("メールアドレスの入力は必須です"),
  password: v.string("パスワードの入力は必須です"),
});

export function EmailLoginForm() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm<InferOutput<typeof loginSchema>>({
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();

        if (submission?.status !== "success") {
          toast.error("入力内容に誤りがあります");
          return;
        }

        try {
          const { data } = await api.POST("/auth/password/login", {
            body: {
              idOrEmail: submission.value.email,
              password: submission.value.password,
            },
          });
          // biome-ignore lint/suspicious/noConsole: <explanation>
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(data);

          // 仮のログイン処理（実際のAPIに置き換える）
          await new Promise((resolve) => setTimeout(resolve, 1000));

          toast.success("ログインしました");
          navigate("/"); // ログイン後のリダイレクト先
        } catch {
          // エラーハンドリング
          toast.error("ログインに失敗しました");
        }
      });
    },
    onValidate: ({ formData }) =>
      parseWithValibot(formData, { schema: loginSchema }),
  });

  return (
    <>
      {/* または区切り線 */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-gray-300 border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">または</span>
        </div>
      </div>

      {/* ログインフォーム */}
      <Form {...getFormProps(form)} className="space-y-2">
        {/* メールアドレス */}
        <Label
          title="メールアドレス"
          required={true}
          errors={fields.email.errors}
          htmlFor="email"
        >
          <Input
            {...getInputProps(fields.email, { type: "email" })}
            placeholder="me@example.com"
            error={fields.email.errors && fields.email.errors.length > 0}
            disabled={isPending}
            id="email"
          />
        </Label>

        {/* パスワード */}
        <Label
          title="パスワード"
          required={true}
          errors={fields.password.errors}
          htmlFor="password"
        >
          <Input
            {...getInputProps(fields.password, { type: "password" })}
            placeholder="xxxxxxxx"
            error={fields.password.errors && fields.password.errors.length > 0}
            disabled={isPending}
            id="password"
          />
        </Label>

        {/* ログインボタン */}
        <div className="pt-4">
          <Button
            type="submit"
            color="agree"
            disabled={isPending}
            className="h-12 w-full"
          >
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </div>
      </Form>
    </>
  );
}
