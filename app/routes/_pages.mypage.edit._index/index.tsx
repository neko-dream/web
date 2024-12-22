import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { Form, useLoaderData } from "react-router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import CameraIcon from "~/assets/camera.svg";
import bathday from "~/assets/data/birthday.json";
import gender from "~/assets/data/gender.json";
import houseHoldSize from "~/assets/data/house-hold-size.json";
import occupation from "~/assets/data/occupation.json";
import Avator from "~/components/Avator";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Select from "~/components/Select";
import AdressInputs from "~/feature/form/components/AdressInputs";
import { loader } from "./modules/loader";
import { useEditUserForm } from "./hooks/useEditUserForm";
import { isFieldsError } from "~/libs/form";

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
    <div className="flex flex-1 flex-col items-center pb-12">
      <div className="relative">
        <Avator src={preview} className="mt-12 h-16 w-16" />
        <button
          onClick={handleUploadButtonClick}
          className="absolute -bottom-2 -right-2 rounded-full bg-gray-400 p-1"
        >
          <img src={CameraIcon} alt="" className="h-5 w-5" />
        </button>
      </div>
      <Form
        {...getFormProps(form)}
        method="post"
        onSubmit={form.onSubmit}
        className="last-child:m-0 mt-8 w-full space-y-4 px-6"
      >
        <Label title="ユーザー名" required errors={fields.displayName.errors}>
          <Input
            {...getInputProps(fields.displayName, { type: "text" })}
            error={isFieldsError(fields.displayName.errors)}
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

        {/* UIには表示しない */}
        <input
          {...getInputProps(fields.icon, { type: "file" })}
          ref={inputFileRef}
          accept="image/png, image/jpeg"
          hidden
          onChange={handleOnChangeInputFile}
        />

        <Button
          variation="primary"
          type="submit"
          className="mx-auto !mt-12 block"
          disabled={isDisabled}
        >
          保存する
        </Button>
      </Form>
    </div>
  );
}
