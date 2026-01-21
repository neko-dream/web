import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import type { InferOutput } from "valibot";
import { Link as LinkIcon, Pencil } from "~/components/icons";
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
  const { session } = useOutletContext<SessionRouteContext>();
  const [isPending, startTransition] = useTransition();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const loginUrl = `${origin}/${session.id}?signup=true`;

  const handleCopy = () => {
    if (!origin) {
      return;
    }
    navigator.clipboard.writeText(loginUrl).then(() => {
      toast.success("URLをコピーしました");
    });
  };

  const [form, fields] = useForm<InferOutput<typeof createOpinionFormSchema>>({
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, {
        schema: createOpinionFormSchema,
      });
    },
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();
        if (submission?.status !== "success") {
          return;
        }
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
          }
        } catch {
          toast.error("エラーが発生しました");
        }
      });
    },
    shouldRevalidate: "onSubmit",
  });

  return (
    <div className="flex-1 bg-cs-gray-200">
      <div className="mx-auto max-w-xl p-4">
        <div className="rounded-2xl bg-white p-6 ">
          <h2 className="mb-4 font-bold text-gray-800 text-lg">
            匿名ログイン用URL
          </h2>
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-600">
            <p className="flex-1 truncate text-sm">
              {origin ? loginUrl : "Loading..."}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!origin}
              className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-gray-200"
              aria-label="URLをコピー"
            >
              <LinkIcon className="h-5 w-5 fill-gray-500" />
            </button>
          </div>
          <p className="mt-3 text-gray-500 text-xs">
            このURLを共有すると、アカウント登録なしでこのセッションに参加できます。
          </p>
        </div>
      </div>

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
