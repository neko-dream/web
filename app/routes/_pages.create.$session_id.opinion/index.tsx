import { getFormProps, getInputProps } from "@conform-to/react";
import { Form, useNavigate } from "react-router";
import { InfoCircle, PaperPlane } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Label } from "~/components/ui/label";
import Textarea from "~/components/ui/textarea";
import { useCreateOpinionsForm } from "~/hooks/useCreateOpinionForm";
import type { Route } from "~/react-router/_pages.create.$session_id.opinion/+types";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { session },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  const { form, fields, isDisabled } = useCreateOpinionsForm({
    talkSessionID: session.id,
    onFinishedProcess: () => {
      navigate(`/${session.id}/opinion`);
    },
  });

  return (
    <div className="flex flex-1 flex-col bg-[#F2F2F7]">
      <Heading title="意見を書いてみる" to={`/${session.id}`} isLink={true} />

      <Form
        {...getFormProps(form)}
        onSubmit={form.onSubmit}
        className="mx-auto w-full max-w-2xl p-4 pb-16"
      >
        <p className="text-gray-500">{session.theme}</p>
        <Label
          title="あなたの意見"
          className="mt-4"
          notes={["注意：個人情報は入力しないでください"]}
        >
          <div className="flex items-center space-x-1 font-bold text-blue-500 text-sm">
            <InfoCircle />
            <p>投稿のルール</p>
          </div>
          <Textarea
            {...getInputProps(fields.opinionContent, { type: "text" })}
            className="h-[400px]"
          />
        </Label>
        <Button
          color="primary"
          type="submit"
          className="!mt-12 mx-auto flex items-center space-x-4"
          disabled={isDisabled}
        >
          <PaperPlane />
          <span>意見を投稿する</span>
        </Button>
      </Form>
    </div>
  );
}
