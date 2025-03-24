import { Form, useNavigate } from "react-router";
import { Heading } from "~/components/Heading";
import type { Route } from "~/app/routes/_pages.create.$session_id.opinion/+types";
import { Label } from "~/components/Label";
import Textarea from "~/components/Textarea";
import { useCreateOpinionsForm } from "~/features/opinion/hooks/useCreateOpinionForm";
import { getFormProps, getInputProps } from "@conform-to/react";
import { Button } from "~/components/Button";
import { InfoCircle, PaperPlane } from "~/components/Icons";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { session },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  const { form, fields, isDisabled } = useCreateOpinionsForm({
    talkSessionID: session.id!,
    onFinishedProcess: () => {
      navigate(`/${session.id}/opinion`);
    },
  });

  return (
    <div className="flex flex-1 flex-col bg-[#F2F2F7]">
      <Heading title="意見を書いてみる" onClick={() => navigate(-1)} />

      <Form
        {...getFormProps(form)}
        onSubmit={form.onSubmit}
        className="p-4 pb-16"
      >
        <p className="text-gray-500">{session.theme}</p>
        <Label title="あなたの意見" className="mt-4">
          <div className="flex items-center space-x-1 text-sm font-bold text-blue-500">
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
          className="mx-auto !mt-12 flex items-center space-x-4"
          disabled={isDisabled}
        >
          <PaperPlane />
          <span>意見を投稿する</span>
        </Button>
      </Form>
    </div>
  );
}
