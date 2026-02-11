import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { RichTextEditor } from "~/components/features/rich-text-editor";
import { Check } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { api } from "~/libs/openapi-fetch";
import type { Route } from "~/react-router/_pages.make.$session_id._index/+types";
import { isFieldsError } from "~/utils/form";
import { createSessionFormSchema } from "./schemas";

export { loader } from "./modules/loader";
export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { restrictions, session, isEditMode },
}: Route.ComponentProps) {
  const [isRestriction, setIsRestriction] = useState<boolean>(false);
  const thumbnailRef = useRef<string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ((session?.restrictions.length || 0) !== 0) {
      setIsRestriction(true);
    }
  }, [session]);

  const [form, fields] = useForm({
    defaultValue: {
      theme: session?.theme || "",
      description: session?.description || "",
      restrictions: session?.restrictions.map((r) => r.key) || [],
      scheduledEndTime: dayjs(session?.scheduledEndTime).format("YYYY-MM-DD"),
    },
    onValidate: ({ formData }) => {
      const parse = parseWithValibot(formData, {
        schema: createSessionFormSchema,
      });
      return parse;
    },
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    onSubmit: async (e, { submission }) => {
      e.preventDefault();

      if (submission?.status !== "success") {
        return;
      }

      const value = submission.value;
      const restrictions = Array.isArray(value.restrictions)
        ? value.restrictions
        : value.restrictions
          ? [value.restrictions]
          : ("[]" as unknown as never[]);

      if (isEditMode) {
        const { error } = await api.PUT("/talksessions/{talkSessionID}", {
          credentials: "include",
          params: {
            path: {
              talkSessionID: session.id,
            },
          },
          body: {
            ...value,
            scheduledEndTime: dayjs(value?.scheduledEndTime).toISOString(),
            restrictions,
            thumbnailURL: thumbnailRef.current || "",
          },
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("更新が完了しました");
          navigate(`/${session?.id}`);
        }
        return;
      }

      const { error } = await api.POST("/talksessions", {
        credentials: "include",
        body: {
          ...value,
          scheduledEndTime: dayjs(value?.scheduledEndTime).toISOString(),
          restrictions,
          thumbnailURL: thumbnailRef.current || "",
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("登録が完了しました");
        navigate("/home");
      }
    },
  });

  const descriptionControl = useInputControl(fields.description);

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
    <div className="flex flex-1 flex-col bg-cs-gray-200">
      <Heading
        title={isEditMode ? "セッションを編集する" : "セッションを作成する"}
        className="h-10"
        to={isEditMode ? `/${session.id}` : "/home"}
        isLink={true}
      />
      <Form
        {...getFormProps(form)}
        onSubmit={form.onSubmit}
        method="post"
        className="m-4 mx-auto mb-16 w-full max-w-xl space-y-4 px-4"
      >
        <Label
          title="タイトル"
          errors={fields.theme.errors}
          notes={["意見を聞きたいことを一行で書いてみよう"]}
        >
          <Input
            {...getInputProps(fields.theme, { type: "text" })}
            error={isFieldsError(fields.theme.errors)}
            className="h-12 w-full px-4"
            placeholder="記入する"
          />
        </Label>

        <Label
          title="ストーリー"
          notes={["どうして聞きたいと思ったのか、みんなに伝えよう"]}
        >
          <RichTextEditor
            defaultValue={session?.description}
            onImageLoad={handleImageUploader}
            onUpdate={descriptionControl.change}
          />
        </Label>

        <Label
          title="参加者の募集範囲"
          notes={["どんな人に参加してほしいか決めよう"]}
        >
          <Select
            disabled={isEditMode}
            options={[
              {
                title: "誰でもOK",
                value: "all",
              },
              {
                title: "範囲を指定",
                value: "restriction",
              },
            ]}
            value={isRestriction ? "restriction" : "all"}
            onChange={(e) => {
              setIsRestriction(e.currentTarget.value === "restriction");
            }}
          />
          {isRestriction && (
            <div className="mt-2 space-y-2">
              {restrictions?.map((restriction, i) => {
                const checked = session?.restrictions?.some(
                  (r) => r.key === restriction.key,
                );
                return (
                  <Checkbox
                    {...getInputProps(fields.restrictions, {
                      type: "checkbox",
                    })}
                    key={i}
                    id={restriction.key}
                    name="restrictions"
                    value={restriction.key}
                    label={restriction.description}
                    defaultChecked={checked}
                    disabled={isEditMode}
                  />
                );
              })}
            </div>
          )}
        </Label>

        <Label
          title="募集期間"
          notes={["具体的な場所が決まっていたら入力しよう"]}
          errors={fields.scheduledEndTime.errors}
        >
          <Input
            {...getInputProps(fields.scheduledEndTime, {
              type: "date",
            })}
            type="date"
            className="h-12 w-full px-4"
            placeholder="記入する"
            defaultValue={
              session?.scheduledEndTime
                ? dayjs(session?.scheduledEndTime).format("YYYY-MM-DD")
                : dayjs().add(7, "day").format("YYYY-MM-DD")
            }
            min={dayjs().add(1, "day").format("YYYY-MM-DD")} // 今日の日付を最小値として設定
            error={(fields.scheduledEndTime.errors || []).length > 0}
          />
        </Label>

        <Label
          title="ホームの一覧に非表示するかどうか"
          notes={["※ プロフィール画面では表示されます"]}
        >
          <Select
            {...getSelectProps(fields.hideTop)}
            options={[
              {
                title: "はい",
                value: "true",
              },
              {
                title: "いいえ",
                value: "false",
              },
            ]}
            value={session?.hideTop === true ? "true" : "false"}
          />
        </Label>

        <Button
          color="primary"
          type="submit"
          className="!mt-12 mx-auto flex items-center space-x-4"
        >
          <Check />
          <span>
            {isEditMode ? "セッションを編集する" : "セッションを作成する"}
          </span>
        </Button>
      </Form>
    </div>
  );
}
