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
import { GuestUpgradePanel } from "~/components/features/auth/GuestUpgradePanel";
import { InputDateByScrollPicker } from "~/components/features/date-scroll-picker/InputDateByScrollPicker";
import { AddressInputs } from "~/components/features/input-address";
import { Camera, Check } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LogoHeader } from "~/components/ui/logo-header";
import { Select } from "~/components/ui/select";
import { fileCompress } from "~/libs/compressor";
import { api } from "~/libs/openapi-fetch";
import type { Route } from "~/react-router/_pages.settings/+types";
import { isFieldsError } from "~/utils/form";
import { removeHyphens } from "~/utils/format-date";
import { userEditSchema } from "./schemas";

export { clientLoader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { user, demographics, isGuest },
}: Route.ComponentProps) {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const [form, fields] = useForm<InferOutput<typeof userEditSchema>>({
    defaultValue: {
      displayName: user.displayName,
      dateOfBirth: demographics.dateOfBirth?.toString(),
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

        const { error } = await api.PUT("/user", {
          credentials: "include",
          body: {
            ...submission?.payload,
            dateOfBirth: submission?.payload.dateOfBirth
              ? removeHyphens(submission?.payload.dateOfBirth as string)
              : null,
            icon: await fileCompress(submission?.payload.icon as File),
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

  const handleBarthControl = useInputControl(fields.dateOfBirth);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    const { error } = await api.POST("/auth/revoke", {
      credentials: "include",
    });
    if (error) {
      setIsLoggingOut(false);
      toast.error("ログアウトに失敗しました");
      return;
    }
    window.location.href = "/";
  };

  return (
    <>
      <LogoHeader />
      <div
        className={`mx-auto flex w-full max-w-4xl flex-1 flex-col items-center pb-[calc(env(safe-area-inset-bottom,0px)+112px)] ${
          isGuest ? "justify-center" : ""
        }`}
      >
        {isGuest ? (
          <div className="mx-auto w-full max-w-[400px]">
            <GuestUpgradePanel />
          </div>
        ) : (
          <>
            <div className="mx-auto w-full max-w-lg px-4 pt-4">
              <h2 className="font-bold text-[15px] text-ink">プロフィール</h2>
              <p className="mt-1 text-[12px] text-ink-muted">
                公開される基本情報です。
              </p>
            </div>
            <div className="relative">
              <Avatar
                src={preview}
                className="mt-4 h-24 w-24"
                onClick={handleUploadButtonClick}
              />
              <button
                type="button"
                className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-2 border-white bg-ink text-white shadow-sm"
                onClick={handleUploadButtonClick}
              >
                <Camera className="size-4" />
              </button>
            </div>
            <Form
              {...getFormProps(form)}
              method="post"
              onSubmit={form.onSubmit}
              className="mx-auto mt-6 w-full max-w-lg space-y-4 px-4 last-child:m-0"
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

              <Label
                title="誕生年"
                optional={true}
                errors={fields.dateOfBirth.errors}
              >
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

              <div className="sticky bottom-[calc(env(safe-area-inset-bottom,0px)+96px)] z-10 -mx-4 mt-4 bg-white/95 px-4 py-2.5 backdrop-blur">
                <Button
                  color="primary"
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 disabled:bg-none disabled:bg-surface disabled:text-ink-muted disabled:opacity-100"
                  disabled={!form.dirty || isPending}
                >
                  {form.dirty && <Check />}
                  <span>{form.dirty ? "保存する" : "変更はありません"}</span>
                </Button>
              </div>
            </Form>
          </>
        )}
        <div
          className={`mt-8 w-full border-line border-t px-4 pt-6 ${
            isGuest ? "mx-auto max-w-[400px]" : "mx-auto max-w-lg"
          }`}
        >
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex min-h-11 items-center font-medium text-[13px] text-[#C4320A] underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "ログアウトしています…" : "ログアウト"}
          </button>
        </div>
      </div>
    </>
  );
}
