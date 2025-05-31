import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { HintOpinionModal } from "~/components/features/hint-opinion-modal";
import { InfoCircle, PaperPlane } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/libs/api";
import type { Route } from "~/react-router/_pages.create.$session_id.opinion/+types";
import { createOpinionFormSchema } from "~/schemas/create-opinion";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { session },
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  const [form, fields] = useForm({
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, {
        schema: createOpinionFormSchema,
      });
    },
    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (isSubmitting || submission?.status !== "success") {
        return;
      }
      setIsSubmitting(true);
      try {
        const { data, error } = await api.POST("/opinions", {
          credentials: "include",
          body: {
            talkSessionID: session.id,
            ...submission.value,
          },
        });
        if (data) {
          toast.success("意見を投稿しました");
          navigate(`/${session.id}/opinion`);
        } else {
          toast.error(error.message);
          setIsSubmitting(false);
        }
      } catch {
        toast.error("エラーが発生しました");
        setIsSubmitting(false);
      }
    },
    shouldRevalidate: "onSubmit",
  });

  return (
    <>
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
            errors={fields.opinionContent.errors}
          >
            <button
              type="button"
              onClick={() => setIsHintModalOpen(true)}
              className="flex items-center space-x-1 font-bold text-blue-500 text-sm"
            >
              <InfoCircle />
              <p>投稿のルール</p>
            </button>
            <Textarea
              {...getInputProps(fields.opinionContent, { type: "text" })}
              className="h-[200px]"
              error={(fields.opinionContent.errors || []).length > 0}
            />
          </Label>
          <Button
            color="primary"
            type="submit"
            className="!mt-12 mx-auto flex items-center space-x-4"
            disabled={isSubmitting}
          >
            <PaperPlane />
            <span>意見を投稿する</span>
          </Button>
        </Form>
      </div>

      <HintOpinionModal
        isOpen={isHintModalOpen}
        onOpenChange={setIsHintModalOpen}
      />
    </>
  );
}
