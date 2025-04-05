import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { Form } from "react-router";
import { toast } from "react-toastify";
import * as v from "valibot";
import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import Textarea from "~/components/Textarea";
import { HalfButtomDialog } from "~/features/modal";
import type { ModalProps } from "~/features/modal/types";

type Props = Omit<ModalProps, "children"> & {
  reasons: { reason: string; reason_id: number }[];
};

const schema = v.object({
  reason: v.optional(v.union([v.array(v.number()), v.number()])),
  content: v.string(),
});

export const ReportModal = ({ isOpen, onOpenChange, reasons }: Props) => {
  const [form, fields] = useForm({
    onValidate: ({ formData }) => {
      const parse = parseWithValibot(formData, { schema });
      return parse;
    },
    onSubmit: () => {
      toast("通報しました");
      onOpenChange(false);
    },
  });

  return (
    <HalfButtomDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <h2 className="text-center font-bold text-lg">通報</h2>
      <Form {...getFormProps(form)} className="mx-auto mt-4 max-w-2xl">
        <p>通報理由</p>
        <div className="mt-2 space-y-1">
          {reasons?.map(({ reason, reason_id }, i) => {
            return (
              <Checkbox
                {...getInputProps(fields.reason, { type: "checkbox" })}
                key={i}
                name="reason"
                id={`${reason_id}`}
                value={reason_id}
                label={reason}
              />
            );
          })}
        </div>
        <Textarea
          {...getInputProps(fields.content, { type: "text" })}
          className="mt-4"
          rows={5}
        />
        <Button className="mx-auto mt-4 block w-40 bg-[#007AFF]" type="submit">
          通報する
        </Button>
      </Form>
    </HalfButtomDialog>
  );
};
