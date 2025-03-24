import {
  getFormProps,
  getInputProps,
  useInputControl,
} from "@conform-to/react";
import { Form } from "react-router";
import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Label } from "~/components/Label";
import { isFieldsError } from "~/libs/form";
import { useCreateSessionForm } from "./hooks/useCreateSessionForm";
import type { Route } from "~/app/routes/_pages.create.session/+types";
import { Checkbox } from "~/components/Checkbox";
import { Check } from "~/components/Icons";
import { Editor } from "~/feature/editor";
import { api } from "~/libs/api";
import { useRef } from "react";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { restrictions },
}: Route.ComponentProps) {
  const thumbnailRef = useRef<File>();
  const { form, fields } = useCreateSessionForm({
    thumbnail: thumbnailRef.current,
  });
  const descriptionControl = useInputControl(fields.description);

  const handleImageUploader = async (file: File) => {
    if (!thumbnailRef.current) {
      thumbnailRef.current = file;
    }
    const { data } = await api.POST("/images", {
      credentials: "include",
      body: {
        image: file as unknown as string,
      },
    });

    return data?.url || "";
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F2F2F7]">
      <Heading title="セッションを作成する" className="h-10" />
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
          <Editor
            onImageLoad={handleImageUploader}
            onUpdate={descriptionControl.change}
          />
        </Label>

        <Label title="募集事項" notes={["どんな人に参加してほしいか決めよう"]}>
          {restrictions?.map((restriction, i) => {
            return (
              <Checkbox
                {...getInputProps(fields.restrictions, { type: "checkbox" })}
                key={i}
                id={restriction.key}
                name="restrictions"
                value={restriction.key}
                label={restriction.description}
              />
            );
          })}
        </Label>

        <Label
          title="募集期間"
          notes={["具体的な場所が決まっていたら入力しよう"]}
        >
          <Input
            {...getInputProps(fields.scheduledEndTime, {
              type: "text",
            })}
            type="date"
            className="h-12 w-full px-4"
            placeholder="記入する"
          />
        </Label>

        <Button
          color="primary"
          type="submit"
          className="mx-auto !mt-12 flex items-center space-x-4"
        >
          <Check />
          <span>セッションを作成する</span>
        </Button>
      </Form>
    </div>
  );
}
