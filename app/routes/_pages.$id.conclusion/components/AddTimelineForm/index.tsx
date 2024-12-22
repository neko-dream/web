import { Form } from "react-router";
import { getFormProps, getInputProps } from "@conform-to/react";
import Label from "~/components/Label";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";
import { useAddTimelineForm } from "../../hooks/useAddTimelineForm";
import Select from "~/components/Select";

type Props = {
  talkSessionID: string;
};

const statusOptions = [
  { value: "未着手", title: "未着手" },
  { value: "進行中", title: "進行中" },
  { value: "完了", title: "完了" },
  { value: "保留", title: "保留" },
  { value: "中止", title: "中止" },
];

export default function AddTimelineForm({ talkSessionID }: Props) {
  const { form, fields, isDisabled } = useAddTimelineForm({
    talkSessionID,
  });

  return (
    <Form
      {...getFormProps(form)}
      method="post"
      onSubmit={form.onSubmit}
      className="mt-16"
    >
      <div className="flex items-center space-x-4">
        <Label title="実施内容">
          <Textarea
            {...getInputProps(fields.content, {
              type: "text",
            })}
            className="h-[46px]"
          />
        </Label>
        <Label title="ステータス" className="w-36">
          <Select
            {...getInputProps(fields.status, {
              type: "text",
            })}
            options={statusOptions}
          />
        </Label>
      </div>
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
