import { toast } from "react-toastify";
import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { addTimelineSchema } from "../schemas/addTimelineSchema";
import { useRevalidator } from "react-router";

type Props = {
  talkSessionID: string;
};

export const useAddTimelineForm = ({ talkSessionID }: Props) => {
  const { revalidate } = useRevalidator();

  return useCustomForm({
    schema: addTimelineSchema,
    onSubmit: async ({ value }) => {
      const { error } = await api.POST(
        "/talksessions/{talkSessionID}/timeline",
        {
          credentials: "include",
          params: {
            path: {
              talkSessionID: talkSessionID,
            },
          },
          body: value,
        },
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("タイムラインの投稿が完了しました");
        revalidate();
      }
    },
  });
};
