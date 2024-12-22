import { Form } from "react-router";
import { useCreateConcluesionForm } from "../../hooks/useCreateConcluesionForm";
import { getFormProps, getInputProps } from "@conform-to/react";
import Label from "~/components/Label";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";

type Props = {
  talkSessionID: string;
  defaultValue?: string;
};

export default function CreateConcluesion({
  talkSessionID,
  defaultValue,
}: Props) {
  const { form, fields, isDisabled } = useCreateConcluesionForm({
    talkSessionID,
  });

  return (
    <Form {...getFormProps(form)} method="post" onSubmit={form.onSubmit}>
      <Label title="結論" required>
        <Textarea
          disabled={!!defaultValue}
          defaultValue={defaultValue}
          {...getInputProps(fields.content, {
            type: "text",
          })}
        />
      </Label>
      <Button
        type="submit"
        className="mx-auto mt-4 block"
        variation="primary"
        disabled={isDisabled}
      >
        送信
      </Button>
    </Form>
  );
}
