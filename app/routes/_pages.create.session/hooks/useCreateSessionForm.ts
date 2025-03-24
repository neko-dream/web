import { useCustomForm } from "~/hooks/useCustomForm";
import { createSessionFormSchema } from "../schemas";
import { api } from "~/libs/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

type Props = {
  thumbnail?: File;
};

export const useCreateSessionForm = ({ thumbnail }: Props) => {
  const navigate = useNavigate();

  return useCustomForm({
    schema: createSessionFormSchema,
    onSubmit: async ({ value }) => {
      const restrictions = Array.isArray(value.restrictions)
        ? value.restrictions
        : value.restrictions
          ? [value.restrictions]
          : [];

      const { error } = await api.POST("/talksessions", {
        credentials: "include",
        body: {
          ...value,
          scheduledEndTime: dayjs(value?.scheduledEndTime).toISOString(),
          restrictions,
          thumbnailURL: thumbnail as unknown as string,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("登録が完了しました");
        navigate("/home");
      }
    },
    shouldValidate: "onBlur",
  });
};
