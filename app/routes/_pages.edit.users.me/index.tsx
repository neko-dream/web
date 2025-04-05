import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Form, useLoaderData } from "react-router";
import bathday from "~/assets/data/birthday.json";
import gender from "~/assets/data/gender.json";
import AdressInputs from "~/components/features/input-adress";
import { Camera } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Select from "~/components/ui/select";
import { isFieldsError } from "~/libs/form";
import { useEditUserForm } from "./hooks/useEditUserForm";
import { loader } from "./modules/loader";

export { loader };

export default function Page() {
  const { user } = useLoaderData<typeof loader>();
  const { form, fields, isDisabled } = useEditUserForm({ user });

  const [preview, setPreview] = useState<string>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // 初期値
  useEffect(() => {
    setPreview(user.iconURL || undefined);
  }, [user]);

  const handleOnChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const [file] = e.target.files;
    setPreview(URL.createObjectURL(file));
  };

  const handleUploadButtonClick = () => {
    inputFileRef.current?.click();
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center pb-12">
      <div className="relative">
        <Avatar
          src={preview}
          className="mt-12 h-24 w-24"
          onClick={handleUploadButtonClick}
        />
        <button
          type="button"
          className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400"
          onClick={handleUploadButtonClick}
        >
          <Camera />
        </button>
      </div>
      <Form
        {...getFormProps(form)}
        method="post"
        onSubmit={form.onSubmit}
        className="mt-8 w-full space-y-4 px-6 last-child:m-0"
      >
        <Label
          title="ユーザー名"
          required={true}
          errors={fields.displayName.errors}
        >
          <Input
            {...getInputProps(fields.displayName, { type: "text" })}
            error={isFieldsError(fields.displayName.errors)}
            className="h-12 w-full px-4"
            placeholder="記入する"
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
          errors={fields.yearOfBirth.errors}
        >
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
          accept="image/png, image/jpeg"
          hidden={true}
          onChange={handleOnChangeInputFile}
        />

        <Button
          color="primary"
          type="submit"
          className="!mt-12 mx-auto block"
          disabled={isDisabled}
        >
          保存する
        </Button>
      </Form>
    </div>
  );
}
