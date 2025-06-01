import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { Form } from "react-router";
import { toast } from "react-toastify";
import * as v from "valibot";
import { Button } from "~/components/ui/button";
import { HalfBottomDialog, type ModalProps } from "~/components/ui/modal";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/libs/openapi-fetch";

type Props = Omit<ModalProps, "children"> & {
  reasons: { reason: string; reasonID: number }[];
  opinionID: string;
};

const schema = v.object({
  reason: v.number(),
  content: v.optional(v.string()),
});

export const ReportModal = ({
  isOpen,
  opinionID,
  onOpenChange,
  reasons,
}: Props) => {
  const [form, fields] = useForm({
    onValidate: ({ formData }) => {
      const parse = parseWithValibot(formData, { schema });
      return parse;
    },
    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (submission?.status !== "success") {
        return;
      }
      const res = await api.POST("/opinions/{opinionID}/report", {
        credentials: "include",
        params: {
          path: {
            opinionID: opinionID,
          },
        },
        body: {
          reason: submission.value.reason,
          content: submission.value.content,
        },
      });
      if (res.response.status === 200) {
        toast.success("通報しました");
        onOpenChange(false);
      } else {
        toast.error("通報に失敗しました");
      }
    },
  });

  return (
    <HalfBottomDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <h2 className="text-center font-bold text-lg">通報</h2>
      <Form {...getFormProps(form)} className="mx-auto mt-4 max-w-2xl">
        <p>通報理由</p>
        <div className="mt-2 space-y-1">
          {reasons?.map(({ reason, reasonID }, i) => {
            return (
              <div key={i} className="flex items-center space-x-2">
                <input
                  {...getInputProps(fields.reason, { type: "radio" })}
                  id={`reason-${reasonID}`}
                  value={reasonID}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={`reason-${reasonID}`}
                  className="cursor-pointer text-sm"
                >
                  {reason}
                </label>
              </div>
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
    </HalfBottomDialog>
  );
};
