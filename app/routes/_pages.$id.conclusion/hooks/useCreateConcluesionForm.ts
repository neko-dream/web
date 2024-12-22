import { toast } from "react-toastify";
import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { createConcluesionSchema } from "../schemas/createConcluesionSchema";
import { useRevalidator } from "react-router";

type Props = {
  talkSessionID: string;
};

export const useCreateConcluesionForm = ({ talkSessionID }: Props) => {
  const { revalidate } = useRevalidator();

  return useCustomForm({
    schema: createConcluesionSchema,
    onSubmit: async ({ value }) => {
      const { error } = await api.POST(
        "/talksessions/{talkSessionID}/conclusion",
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
        toast.success("結論投稿が完了しました");
        revalidate();
      }
    },
  });
};
