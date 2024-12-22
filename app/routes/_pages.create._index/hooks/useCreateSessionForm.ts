import { useCustomForm } from "~/hooks/useCustomForm";
import { createSessionFormSchema } from "../schemas";
import { api } from "~/libs/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { reverse } from "../libs";

export const useCreateSessionForm = () => {
  const navigate = useNavigate();

  return useCustomForm({
    schema: createSessionFormSchema,
    onSubmit: async ({ value }) => {
      const prefecture = await reverse({
        lat: value?.latitude || 0,
        lng: value.longitude || 0,
      });

      const { error } = await api.POST("/talksessions", {
        credentials: "include",
        body: {
          ...value,
          ...prefecture,
          scheduledEndTime: dayjs(value?.scheduledEndTime).toISOString(),
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
