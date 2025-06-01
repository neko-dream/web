import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { InferOutput } from "valibot";
import gender from "~/assets/data/gender.json";
import { InputDateByScrollPicker } from "~/components/features/date-scroll-picker/InputDateByScrollPicker";
import { AddressInputs } from "~/components/features/input-address";
import { Camera, Check } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { api } from "~/libs/api";
import { deleteDashValues, isFieldsError } from "~/libs/form";
import { fileCompress } from "~/libs/image-compressor";
import type { Route } from "~/react-router/_pages.users.me.edit/+types";
import { removeHyphens } from "~/utils/format-date";
import { userEditSchema } from "./schemas";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { user, demographics },
}: Route.ComponentProps) {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const [form, fields] = useForm<InferOutput<typeof userEditSchema>>({
    defaultValue: {
      displayName: user.displayName,
      birth: demographics.dateOfBirth?.toString(),
      city: demographics.city,
      prefecture: demographics.prefecture,
      gender: demographics.gender,
      icon: undefined,
    },
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();
        if (submission?.status !== "success") {
          return;
        }

        const value = deleteDashValues(submission?.payload);
        const { error } = await api.PUT("/user", {
          credentials: "include",
          body: {
            ...value,
            dateOfBirth: value.birth
              ? removeHyphens(value.birth as string)
              : undefined,
            icon: await fileCompress(value.icon as File),
          },
        });

        if (error) {
          toast.error("ユーザー情報の更新に失敗しました。");
        } else {
          navigate("/users/me");
        }
      });
    },
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, { schema: userEditSchema });
    },
  });

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

  const handleBarthControl = useInputControl(fields.birth);

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
            value={fields.gender.value}
          />
        </Label>

        <Label title="誕生年" optional={true} errors={fields.birth.errors}>
          <InputDateByScrollPicker
            pickerUi="dialog"
            value={handleBarthControl.value || null}
            onChangeValue={(newDate) => {
              handleBarthControl.change(newDate?.toString());
            }}
          />
        </Label>

        <AddressInputs form={form} fields={fields} />

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
          className="!mt-12 mx-auto flex items-center justify-center space-x-2"
          disabled={!form.dirty || isPending}
        >
          <Check />
          <span>保存する</span>
        </Button>
      </Form>
    </div>
  );
}
