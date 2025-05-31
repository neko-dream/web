import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { fileCompress } from "~/libs/image-compressor";
import { userEditFormSchema } from "~/schemas/users";
import type { UserType } from "~/types";
import { removeHyphens } from "~/utils/format-date";

type Props = {
  user: UserType;
};

export const useEditUserForm = ({ user }: Props) => {
  const navigate = useNavigate();

  return useCustomForm({
    schema: userEditFormSchema,
    defaultValue: {
      ...user,
      icon: undefined,
    },
    onSubmit: async ({ value }) => {
      const { error } = await api.PUT("/user", {
        credentials: "include",
        body: {
          ...value,
          dateOfBirth: value.dateOfBirth
            ? removeHyphens(value.dateOfBirth)
            : undefined,
          icon: await fileCompress(value.icon),
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("登録情報の編集が完了しました");
        navigate("/users/me");
      }
    },
  });
};
