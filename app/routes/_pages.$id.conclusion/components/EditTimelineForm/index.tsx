import { Form } from "react-router";
import { getFormProps, getInputProps } from "@conform-to/react";
import Label from "~/components/Label";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";
import { useEditTimelineForm } from "../../hooks/useEditTimelineForm";
import Select from "~/components/Select";
import { components } from "~/libs/api/openapi";
import { useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";

type Props = {
  talkSessionID: string;
} & components["schemas"]["actionItem"];

const statusOptions = [
  { value: "未着手", title: "未着手" },
  { value: "進行中", title: "進行中" },
  { value: "完了", title: "完了" },
  { value: "保留", title: "保留" },
  { value: "中止", title: "中止" },
];

export default function EditTimelineForm({ talkSessionID, ...props }: Props) {
  const [isEdit, setEdit] = useState(false);

  const { form, fields, isDisabled } = useEditTimelineForm({
    talkSessionID,
    actionItemID: props.ActionItemID,
  });

  if (!isEdit) {
    return (
      <div className="mt-2 flex items-center">
        <p className="w-14">{props.Status}</p>
        <p>{props.Content}</p>
        <button
          onClick={() => setEdit((prev) => !prev)}
          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500 hover:opacity-80"
        >
          <RiEdit2Fill color="white" size={16} />
        </button>
      </div>
    );
  }

  return (
    <Form {...getFormProps(form)} method="post" onSubmit={form.onSubmit}>
      <div className="flex items-center space-x-4">
        <Label title="実施内容">
          <Textarea
            {...getInputProps(fields.content, {
              type: "text",
            })}
            defaultValue={props.Content}
            className="h-[46px]"
          />
        </Label>
        <Label title="ステータス" className="w-36">
          <Select
            {...getInputProps(fields.status, {
              type: "text",
            })}
            defaultValue={props.Status}
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
