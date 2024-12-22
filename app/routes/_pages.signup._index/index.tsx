import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { Form } from "react-router";
import { ChangeEvent, useRef, useState } from "react";
import bathday from "~/assets/data/birthday.json";
import gender from "~/assets/data/gender.json";
import houseHoldSize from "~/assets/data/house-hold-size.json";
import occupation from "~/assets/data/occupation.json";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Select from "~/components/Select";
import Uploadarea from "~/components/Uploadarea";
import AdressInputs from "~/feature/form/components/AdressInputs";
import { useCreateUserForm } from "./hooks/useCreateUserForm";
import { toast } from "react-toastify";
import { isFieldsError } from "~/libs/form";
export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Page() {
  const [preview, setPreview] = useState<string>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { form, fields, isDisabled } = useCreateUserForm();

  const handleOnChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return toast.error("画像を選択してください");
    }
    const [file] = e.target.files;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Form
      {...getFormProps(form)}
      method="post"
      onSubmit={form.onSubmit}
      className="mt-8 w-full space-y-4 px-6 pb-12"
    >
      <p className="text-center font-bold">ユーザー登録フォーム</p>
      <Label title="ユーザー名" required errors={fields.displayName.errors}>
        <Input
          {...getInputProps(fields.displayName, { type: "text" })}
          error={isFieldsError(fields.displayName.errors)}
          className="h-12 w-full px-4"
          placeholder="記入する"
        />
      </Label>

      <Label title="ユーザーID" required errors={fields.displayID.errors}>
        <Input
          {...getInputProps(fields.displayID, { type: "text" })}
          error={isFieldsError(fields.displayID.errors)}
          className="h-12 w-full px-4"
          placeholder="記入する"
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

      <Label title="職業" optional errors={fields.occupation.errors}>
        <Select
          {...getSelectProps(fields.occupation)}
          error={isFieldsError(fields.occupation.errors)}
          options={occupation.map((v) => ({
            value: v,
            title: v,
          }))}
        />
      </Label>

      <Label title="世帯人数" optional errors={fields.householdSize.errors}>
        <Select
          {...getSelectProps(fields.householdSize)}
          error={isFieldsError(fields.householdSize.errors)}
          options={houseHoldSize.map((v) => {
            return {
              value: `${v}`,
              title: v === 5 ? `${v}人以上` : `${v}人`,
            };
          })}
        />
      </Label>

      <Label title="プロフィール画像" optional className="mb-8">
        <Uploadarea
          onClick={() => {
            inputFileRef.current?.click();
          }}
          preview={preview}
        />
      </Label>

      {/* UIには表示しない */}
      <input
        {...getInputProps(fields.icon, { type: "file" })}
        ref={inputFileRef}
        accept="image/png,image/jpeg"
        hidden
        onChange={handleOnChangeInputFile}
      />

      <Button
        variation="primary"
        type="submit"
        className="mx-auto !mt-12 block"
        disabled={isDisabled}
      >
        登録する
      </Button>
    </Form>
  );
}
