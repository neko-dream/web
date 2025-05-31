import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { fileCompress } from "~/libs/image-compressor";
import { signupFormSchema, singupFormWithEmailSchema } from "~/schemas/users";
import { removeHyphens } from "~/utils/format-date";

export const useCreateUserForm = (widthEmail: boolean) => {
  const navigate = useNavigate();

  return useCustomForm({
    schema: widthEmail ? singupFormWithEmailSchema : signupFormSchema,
    onSubmit: async ({ value }) => {
      const { error } = await api.POST("/user", {
        credentials: "include",
        body: {
          ...value,
          dateOfBirth: removeHyphens(value.dateOfBirth),
          icon: await fileCompress(value.icon),
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("登録が完了しました");
        navigate("/home");
      }
    },
  });
};
