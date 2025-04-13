import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { Form } from "react-router";
import bathday from "~/assets/data/birthday.json";
import gender from "~/assets/data/gender.json";
import AdressInputs from "~/components/features/input-adress";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Label } from "~/components/ui/label";
import Select from "~/components/ui/select";
import { isFieldsError } from "~/libs/form";
import type { Route } from "~/react-router/_pages.request.demographics.$session_id/+types";
import { useEditUserForm } from "./hooks/useEditUserForm";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { returnPage, user, demographics, sessionID },
}: Route.ComponentProps) {
  const { form, fields, isDisabled } = useEditUserForm({
    user: {
      ...user,
      ...demographics,
    },
    sessionID,
    returnPage,
  });

  return (
    <div>
      <Heading
        to={`/${sessionID}/${returnPage}`}
        title="情報入力"
        isLink={true}
      />

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
  );
}
