import {
  getFormProps,
  getSelectProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { useMemo, useTransition } from "react";
import { Form, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { InferOutput } from "valibot";
import gender from "~/assets/data/gender.json";
import { InputDateByScrollPicker } from "~/components/features/date-scroll-picker/InputDateByScrollPicker";
import { AddressInputs } from "~/components/features/input-address";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Tip } from "~/components/ui/tip";
import { api } from "~/libs/api";
import { deleteDashValues, isFieldsError } from "~/libs/form";
import type { Route } from "~/react-router/_pages.make.$session_id.demographics/+types";
import { formatDate, removeHyphens } from "./libs";
import { type baseSchema, createDynamicSchema } from "./schema";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { next, demographics, user, sessionID, requestRestrictions },
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const submitSuccess = () => {
    toast.success("登録情報の編集が完了しました");
    if (next) {
      navigate(next);
    }
  };

  const submitError = (error?: { message: string }) => {
    if (error) {
      toast.error(error.message);
    } else {
      toast.error("エラーが発生しました");
    }
  };

  const dynamicSchema = useMemo(
    () => createDynamicSchema(requestRestrictions),
    [requestRestrictions],
  );

  const [form, fields] = useForm({
    defaultValue: {
      city: demographics.city,
      prefecture: demographics.prefecture,
      gender: demographics.gender,
      birth: formatDate(demographics.dateOfBirth?.toString()),
    },
    onSubmit: (e, { submission }) => {
      startTransition(async () => {
        e.preventDefault();

        if (submission?.status !== "success") {
          return;
        }

        const values = deleteDashValues(submission.value);

        const { error } = await api.PUT("/user", {
          credentials: "include",
          body: {
            ...values,
            displayName: user.displayName,
            dateOfBirth: values.birth
              ? removeHyphens(values.birth as string)
              : undefined,
          } as unknown as InferOutput<typeof baseSchema>,
        });

        if (error) {
          submitError(error);
        } else {
          submitSuccess();
        }
      });
    },
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, {
        schema: dynamicSchema,
      });
    },
    shouldValidate: "onInput",
  });

  const handleDateOfBarthControl = useInputControl(fields.birth);

  const required = (key: string) => {
    return requestRestrictions.some(
      (restriction) =>
        restriction.key === `demographics.${key}` && restriction.required,
    );
  };

  return (
    <>
      <Heading to={`/${sessionID}`} title="情報入力" isLink={true} />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center bg-cs-gray-200 pb-12">
        <p className="mt-4 text-center">
          より良い意思決定のため
          <br />
          以下の情報をセッション作成者に提供します。
        </p>
        <Form
          {...getFormProps(form)}
          className="mt-8 w-full space-y-4 px-6 last-child:m-0"
        >
          <Label
            title="性別"
            tip={required("gender") && <Tip label="必須" required={true} />}
            errors={fields.gender.errors}
          >
            <Select
              {...getSelectProps(fields.gender)}
              value={fields.gender.value}
              error={isFieldsError(fields.gender.errors)}
              options={gender.map((v) => ({ value: v, title: v }))}
            />
          </Label>

          <Label
            title="誕生年"
            tip={required("birth") && <Tip label="必須" required={true} />}
            errors={fields.birth.errors}
          >
            <InputDateByScrollPicker
              pickerUi="dialog"
              value={handleDateOfBarthControl.value || null}
              onChangeValue={(v) => {
                handleDateOfBarthControl.change(v || undefined);
              }}
            />
          </Label>

          <AddressInputs
            form={form}
            fields={fields}
            required={{
              prefecture: required("prefecture"),
              city: required("city"),
            }}
          />

          <Button
            color="primary"
            type="submit"
            className="!mt-12 mx-auto block"
            disabled={!form.dirty || isPending}
          >
            セッションに参加する
          </Button>
        </Form>
      </div>
    </>
  );
}
