import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCustomForm } from "~/hooks/useCustomForm";
import { userEditFormSchema } from "~/features/user/schemas/form";
import { api } from "~/libs/api";
import { fileCompress } from "~/libs/compressor";
import { User } from "~/features/user/types";

type Props = {
  user: User;
};

export const useEditUserForm = ({ user }: Props) => {
  const navigate = useNavigate();

  return useCustomForm({
    schema: userEditFormSchema,
    // FIXME: null と undefined の違いで起こる
    defaultValue: {
      ...user,
      icon: undefined,
    } as never,
    onSubmit: async ({ value }) => {
      const compressIcon =
        value.icon && value.icon?.size !== 0 && fileCompress(value.icon);

      const { error } = await api.PUT("/user", {
        credentials: "include",
        body: {
          ...value,
          icon: (await compressIcon) as unknown as string,
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
