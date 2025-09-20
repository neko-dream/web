import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { type ChangeEvent, useRef, useState, useTransition } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { InferOutput } from "valibot";
import gender from "~/assets/data/gender.json";
import { InputDateByScrollPicker } from "~/components/features/date-scroll-picker/InputDateByScrollPicker";
import { AddressInputs } from "~/components/features/input-address";
import { Camera, Check } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Tip } from "~/components/ui/tip";
import { fileCompress } from "~/libs/compressor";
import { api } from "~/libs/openapi-fetch";
import type { Route } from "~/react-router/_pages.auth.signup/+types";
import { isFieldsError } from "~/utils/form";
import { removeHyphens } from "~/utils/format-date";
import { signupFormSchema, signupFormWithEmailSchema } from "./schemas";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { isEmailVerified },
}: Route.ComponentProps) {
  const [preview, setPreview] = useState<string>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const schema = isEmailVerified ? signupFormSchema : signupFormWithEmailSchema;

  const [form, fields] = useForm<InferOutput<typeof schema>>({
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();

        if (submission?.status !== "success") {
          return;
        }

        const { error } = await api.POST("/user", {
          credentials: "include",
          body: {
            ...submission.value,
            dateOfBirth: submission.value.dateOfBirth
              ? removeHyphens(submission.value.dateOfBirth as string)  || undefined
              : undefined,
            icon: await fileCompress(submission.value.icon),
          },
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("登録が完了しました");
          navigate("/home");
        }
      });
    },
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, { schema });
    },
  });

  const handleOnChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return toast.error("画像を選択してください");
    }
    const [file] = e.target.files;
    setPreview(URL.createObjectURL(file));
  };

  const handleOpenFiler = () => {
    inputFileRef.current?.click();
  };

  const handleDateOfBarthControl = useInputControl(fields.dateOfBirth);

  return (
    <>
      <Heading title="アカウントを作成する" />

      <Form
        {...getFormProps(form)}
        className="mx-auto mb-12 flex w-full max-w-xl flex-col items-center space-y-4 px-4"
      >
        <div className="relative">
          <Avatar
            src={preview}
            className="mt-12 h-24 w-24"
            onClick={handleOpenFiler}
          />
          <button
            type="button"
            className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400"
            onClick={handleOpenFiler}
          >
            <Camera />
          </button>
        </div>

        <Label
          title="ユーザー名"
          required={true}
          errors={fields.displayName.errors}
          notes={[
            "ユーザー名は誰でもみられる状態で公開されます",
            "ニックネームを入力してください",
            "注意：個人情報は入力しないでください",
          ]}
          tip={<Tip label="必須" required={true} />}
        >
          <Input
            {...getInputProps(fields.displayName, { type: "text" })}
            error={isFieldsError(fields.displayName.errors)}
            className="h-12 w-full px-4"
            placeholder="例）こと太郎"
          />
        </Label>

        {!isEmailVerified && (
          <Label
            title="メールアドレス"
            required={true}
            errors={fields.email.errors}
            tip={<Tip label="必須" required={true} />}
          >
            <Input
              {...getInputProps(fields.email, { type: "text" })}
              error={isFieldsError(fields.email.errors)}
              className="h-12 w-full px-4"
              placeholder="mail-address@example.com"
            />
          </Label>
        )}

        <Label
          title="ユーザーID"
          required={true}
          errors={fields.displayID.errors}
          tip={<Tip label="必須" required={true} />}
          notes={[
            "ユーザーIDは誰でもみられる状態で公開されます",
            "個人情報は入力しないでください",
          ]}
        >
          <Input
            {...getInputProps(fields.displayID, { type: "text" })}
            error={isFieldsError(fields.displayID.errors)}
            className="h-12 w-full px-4"
            placeholder="例）kototaro1234"
          />
        </Label>

        <Label title="性別" optional={true} errors={fields.gender.errors}>
          <Select
            {...getSelectProps(fields.gender)}
            error={isFieldsError(fields.gender.errors)}
            options={gender.map((v) => ({ value: v, title: v }))}
            value={fields.gender.value}
          />
        </Label>

        <Label
          title="誕生年"
          optional={true}
          errors={fields.dateOfBirth.errors}
        >
          <InputDateByScrollPicker
            pickerUi="dialog"
            value={handleDateOfBarthControl.value || null}
            onChangeValue={(newDate) => {
              handleDateOfBarthControl.change(newDate?.toString());
            }}
          />
        </Label>

        <AddressInputs form={form} fields={fields} />

        {/* UIには表示しない */}
        <input
          {...getInputProps(fields.icon, { type: "file" })}
          ref={inputFileRef}
          accept="image/png,image/jpeg"
          hidden={true}
          onChange={handleOnChangeInputFile}
        />

        <Button
          color="primary"
          type="submit"
          className="!mt-12 mx-auto flex items-center justify-center space-x-2"
          disabled={!form.dirty || isPending}
        >
          <Check />
          <span>アカウントを作成する</span>
        </Button>
      </Form>
    </>
  );
}
