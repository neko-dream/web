import { toast } from "react-toastify";
import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { editTimelineSchema } from "../schemas/editTimelineSchema";
import { useRevalidator } from "react-router";

type Props = {
  talkSessionID: string;
  actionItemID: string;
};

export const useEditTimelineForm = ({ talkSessionID, actionItemID }: Props) => {
  const { revalidate } = useRevalidator();

  return useCustomForm({
    schema: editTimelineSchema,
    onSubmit: async ({ value }) => {
      const { error } = await api.PUT(
        "/talksessions/{talkSessionID}/timelines/{actionItemID}",
        {
          credentials: "include",
          params: {
            path: {
              talkSessionID: talkSessionID,
              actionItemID: actionItemID,
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
