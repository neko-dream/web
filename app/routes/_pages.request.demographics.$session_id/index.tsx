import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { Form } from "react-router";
import gender from "~/assets/data/gender.json";
import AdressInputs from "~/components/features/input-adress";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Select from "~/components/ui/select";
import { isFieldsError } from "~/libs/form";
import type { Route } from "~/react-router/_pages.request.demographics.$session_id/+types";
import { useEditUserForm } from "./hooks/useEditUserForm";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

const formatDate = (str: string) => {
  return str.replace(
    // biome-ignore lint/performance/useTopLevelRegex: <explanation>
    /^(\d{4})(\d{2})(\d{2})$/,
    "$1-$2-$3",
  ) as unknown as number;
};

export default function Page({
  loaderData: { returnPage, user, demographics, sessionID },
}: Route.ComponentProps) {
  const { form, fields, isDisabled } = useEditUserForm({
    user: {
      ...user,
      ...demographics,
      dateOfBirth: formatDate(demographics.dateOfBirth?.toString() || ""),
    },
    sessionID,
    returnPage,
  });

  return (
    <>
      <Heading
        to={`/${sessionID}/${returnPage}`}
        title="情報入力"
        isLink={true}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center pb-12">
        <Form
          {...getFormProps(form)}
          method="post"
          onSubmit={form.onSubmit}
          className="mt-8 w-full space-y-4 px-6 last-child:m-0"
        >
          <input
            {...getInputProps(fields.displayName, { type: "text" })}
            hidden={true}
          />

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
            <span className="relative">
              <Input
                {...getInputProps(fields.dateOfBirth, {
                  type: "text",
                })}
                type="date"
                className="h-12 w-full px-4"
                placeholder="記入する"
              />
            </span>
          </Label>

          {/* FIXME: 型が合わない */}
          <AdressInputs fields={fields} form={form as never} />

          <Button
            color="primary"
            type="submit"
            className="!mt-12 mx-auto block"
            disabled={isDisabled}
          >
            セッションに参加する
          </Button>
        </Form>
      </div>
    </>
  );
}
