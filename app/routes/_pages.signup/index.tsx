import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { Form } from "react-router";
import { ChangeEvent, useRef, useState } from "react";
import bathday from "~/assets/data/birthday.json";
import gender from "~/assets/data/gender.json";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Label } from "~/components/Label";
import Select from "~/components/Select";
import AdressInputs from "~/feature/form/components/AdressInputs";
import { useCreateUserForm } from "./hooks/useCreateUserForm";
import { toast } from "react-toastify";
import { isFieldsError } from "~/libs/form";
import { Heading } from "~/components/Heading";
import Uploadarea from "./components/Uploadarea";
import { RiImage2Line } from "react-icons/ri";
import { Check } from "~/components/Icons";
import type { Route } from "~/app/routes/_pages.signup/+types";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

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

  return (
    <>
      <Heading
        title="アカウントを作成する"
        className="cursor-default"
        isLeftIcon={false}
      />

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
            className="flex h-6 w-[74px] items-center justify-center space-x-1 px-1 text-sm font-normal"
            onClick={handleOpenFiler}
          >
            <RiImage2Line className="text-gray-400" size={20} />
            <span className="text-gray-400">変更</span>
          </Button>
        </div>

        <Label title="ユーザー名" required errors={fields.displayName.errors}>
          <Input
            {...getInputProps(fields.displayName, { type: "text" })}
            error={isFieldsError(fields.displayName.errors)}
            className="h-12 w-full px-4"
            placeholder="例）こと太郎"
          />
        </Label>

        {!isEmailVerified && (
          <Label title="メールアドレス" required errors={fields.email.errors}>
            <Input
              {...getInputProps(fields.email, { type: "text" })}
              error={isFieldsError(fields.email.errors)}
              className="h-12 w-full px-4"
              placeholder="mail-address@example.com"
            />
          </Label>
        )}

        <Label title="ユーザーID" required errors={fields.displayID.errors}>
          <Input
            {...getInputProps(fields.displayID, { type: "text" })}
            error={isFieldsError(fields.displayID.errors)}
            className="h-12 w-full px-4"
            placeholder="例）koto-taro1234"
          />
        </Label>

        <Label title="性別" optional errors={fields.gender.errors}>
          <Select
            {...getSelectProps(fields.gender)}
            error={isFieldsError(fields.gender.errors)}
            options={gender.map((v) => ({ value: v, title: v }))}
          />
        </Label>

        <Label title="誕生年" optional errors={fields.yearOfBirth.errors}>
          <Select
            {...getSelectProps(fields.yearOfBirth)}
            error={isFieldsError(fields.yearOfBirth.errors)}
            options={bathday.map((v) => ({
              value: `${v}`,
              title: `${v}年`,
            }))}
          />
        </Label>

        {/* FIXME: 型が合わない */}
        <AdressInputs fields={fields} form={form as never} />

        {/* UIには表示しない */}
        <input
          {...getInputProps(fields.icon, { type: "file" })}
          ref={inputFileRef}
          accept="image/png,image/jpeg"
          hidden
          onChange={handleOnChangeInputFile}
        />

        <Button
          color="primary"
          type="submit"
          className="mx-auto !mt-12 flex items-center justify-center space-x-2"
          disabled={isDisabled}
        >
          <Check />
          <span>アカウントを作成する</span>
        </Button>
      </Form>
    </>
  );
}
