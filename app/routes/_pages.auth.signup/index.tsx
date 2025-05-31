import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useInputControl,
} from "@conform-to/react";
import { type ChangeEvent, useRef, useState } from "react";
import { Form } from "react-router";
import { toast } from "react-toastify";
import gender from "~/assets/data/gender.json";
import { InputDateByScrollPicker } from "~/components/features/date-scroll-picker/InputDateByScrollPicker";
import { AddressInputs } from "~/components/features/input-address";
import { Check, Photo } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { isFieldsError } from "~/libs/form";
import type { Route } from "~/react-router/_pages.auth.signup/+types";
import Uploadarea from "./components/Uploadarea";
import { useCreateUserForm } from "./hooks/useCreateUserForm";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { isEmailVerified },
}: Route.ComponentProps) {
  const [preview, setPreview] = useState<string>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { form, fields, isDisabled } = useCreateUserForm(!isEmailVerified);

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
        method="post"
        onSubmit={form.onSubmit}
        className="mx-auto mb-12 w-full max-w-xl space-y-4 p-4"
      >
        <div className="flex flex-col items-center space-y-2">
          <Uploadarea onClick={handleOpenFiler} preview={preview} />
          <Button
            type="button"
            color="disabled"
            className="flex h-6 w-[74px] items-center justify-center space-x-1 px-1 font-normal text-sm"
            onClick={handleOpenFiler}
          >
            <Photo className="w-5 text-gray-400" />
            <span className="text-gray-400">変更</span>
          </Button>
        </div>

        <Label
          title="ユーザー名"
          required={true}
          errors={fields.displayName.errors}
          notes={[
            "ユーザー名は誰でもみられる状態で公開されます。",
            "ニックネームを入力してください。",
            "注意：個人情報は入力しないでください。",
          ]}
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
          notes={[
            "ユーザーIDは誰でもみられる状態で公開されます。",
            "注意：個人情報は入力しないでください。",
          ]}
        >
          <Input
            {...getInputProps(fields.displayID, { type: "text" })}
            error={isFieldsError(fields.displayID.errors)}
            className="h-12 w-full px-4"
            placeholder="例）koto-taro1234"
          />
        </Label>

        <Label title="性別" optional={true} errors={fields.gender.errors}>
          <Select
            {...getSelectProps(fields.gender)}
            error={isFieldsError(fields.gender.errors)}
            options={gender.map((v) => ({ value: v, title: v }))}
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
          disabled={isDisabled}
        >
          <Check />
          <span>アカウントを作成する</span>
        </Button>
      </Form>
    </>
  );
}
