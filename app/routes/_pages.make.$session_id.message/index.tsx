import { getFormProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { useRef, useTransition } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { RichTextEditor } from "~/components/features/rich-text-editor";
import { Check } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Label } from "~/components/ui/label";
import { api } from "~/libs/openapi-fetch";
import type { Route } from "~/react-router/_pages.make.$session_id.message/+types";
import { schema } from "./schemas";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { session, message },
}: Route.ComponentProps) {
  const thumbnailRef = useRef<string>(null);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const [form, fields] = useForm({
    defaultValue: {
      content: message?.content || "",
    },
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();

        if (submission?.status !== "success") {
          toast.error("入力内容に誤りがあります。");
          return;
        }

        const { data } = await api.POST(
          "/talksessions/{talkSessionID}/conclusion",
          {
            credentials: "include",
            params: {
              path: {
                talkSessionID: session.id,
              },
            },
            body: {
              content: submission.value.content,
            },
          },
        );
        if (data) {
          toast.success("送信しました。");
          navigate(`/${session.id}`);
        } else {
          toast.success("送信できませんでした。");
        }
      });
    },
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, { schema });
    },
  });

  const contentControl = useInputControl(fields.content);

  const handleImageUploader = async (file: File) => {
    const { data } = await api.POST("/images", {
      credentials: "include",
      body: {
        image: file,
      },
    });
    if (!thumbnailRef.current) {
      thumbnailRef.current = data?.url || null;
    }
    return data?.url || "";
  };

  return (
    <div className="flex-1 bg-cs-gray-200">
      <Heading title="活動報告" to={`/${session.id}`} isLink={true} />
      <Form
        {...getFormProps(form)}
        onSubmit={form.onSubmit}
        method="post"
        className="m-4 mx-auto mb-16 w-full max-w-xl space-y-4 px-4"
      >
        <Label
          title="メッセージ"
          notes={[
            "セッションに参加してくれた人たちに向けて、お礼のメッセージや今後の意気込みを伝えよう！",
          ]}
          errors={fields.content.errors}
        >
          <RichTextEditor
            defaultValue={message?.content}
            onImageLoad={handleImageUploader}
            onUpdate={contentControl.change}
          />
        </Label>

        <Button
          color="primary"
          type="submit"
          className="!mt-12 mx-auto flex items-center space-x-4"
          disabled={!form.dirty || isPending}
        >
          <Check />
          <span>完了</span>
        </Button>
      </Form>
    </div>
  );
}
