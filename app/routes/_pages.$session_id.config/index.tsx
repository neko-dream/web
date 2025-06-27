import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { Suspense, useState, useTransition } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import type { InferOutput } from "valibot";
import { Pencil } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/libs/openapi-fetch";
import { createOpinionFormSchema } from "~/schemas/create-opinion";
import type { SessionRouteContext } from "~/types/ctx";
import type { Route } from "./+types";
import { SeedOpinions } from "./components/SeedOpinions";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { $opinions },
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useOutletContext<SessionRouteContext>();
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm<InferOutput<typeof createOpinionFormSchema>>({
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, {
        schema: createOpinionFormSchema,
      });
    },
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();
        if (isSubmitting || submission?.status !== "success") {
          return;
        }
        setIsSubmitting(true);
        try {
          const { data, error } = await api.POST("/opinions", {
            credentials: "include",
            body: {
              ...submission.value,
              isSeed: true,
              talkSessionID: session.id,
            },
          });
          if (data) {
            toast.success("意見を投稿しました");
            navigate(`/${session.id}/config`);
          } else {
            toast.error(error.message);
            setIsSubmitting(false);
          }
        } catch {
          toast.error("エラーが発生しました");
          setIsSubmitting(false);
        }
      });
    },
    shouldRevalidate: "onSubmit",
  });

  return (
    <div className="flex-1 bg-cs-gray-200">
      <div className="mx-auto max-w-xl p-4 pt-2">
        <p className="mb-4 font-bold">シード意見</p>
        <Suspense>
          <SeedOpinions $opinions={$opinions} sessionID={session.id} />
        </Suspense>

        <form {...getFormProps(form)} className="mx-auto mt-2 w-full max-w-xl">
          <Textarea
            {...getInputProps(fields.opinionContent, { type: "text" })}
            className="mt-8"
            rows={5}
          />
          <Button
            disabled={!form.dirty || isPending}
            color="green"
            className="mx-auto mt-8 flex w-55 items-center"
          >
            <Pencil className="fill-white" />
            <span className="ml-1">シード意見をかく</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
