import { toast } from "react-toastify";
import * as v from "valibot";
import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { fileCompress } from "~/libs/image-compressor";

type Props = {
  talkSessionID?: string;
  parentOpinionID?: string;
  onFinishedProcess: () => void;
};

const createOpinionFormSchema = v.object({
  parentOpinionID: v.optional(v.string()),
  opinionContent: v.pipe(
    v.string("意見の入力は必須です"),
    v.maxLength(140, "140文字以内で入力してください"),
  ),
  referenceURL: v.optional(v.string()),
  picture: v.optional(v.instance(File)),
});

export const useCreateOpinionsForm = ({
  onFinishedProcess,
  talkSessionID,
  parentOpinionID,
}: Props) => {
  return useCustomForm({
    schema: createOpinionFormSchema,
    onSubmit: async ({ value }) => {
      const { data, error } = await api.POST("/opinions", {
        credentials: "include",
        body: {
          talkSessionID,
          parentOpinionID,
          ...value,
          picture: await fileCompress(value.picture, 150),
        },
      });

      if (data) {
        toast.success("意見を送信しました");
        onFinishedProcess();
      }
      if (error) {
        toast.error(error.message);
      }
    },
  });
};
