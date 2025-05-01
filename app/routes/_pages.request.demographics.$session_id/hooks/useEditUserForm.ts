import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCustomForm } from "~/hooks/useCustomForm";
import { api } from "~/libs/api";
import { userEditFormSchema } from "~/schemas/users";
import type { UserType } from "~/types";
import { removeHyphens } from "~/utils/format-date";

type Props = {
  user: UserType;
  sessionID: string;
  returnPage: string | null;
};

export const useEditUserForm = ({ user, sessionID, returnPage }: Props) => {
  const navigate = useNavigate();

  return useCustomForm({
    schema: userEditFormSchema,
    defaultValue: user,
    onSubmit: async ({ value }) => {
      const { error } = await api.PUT("/user", {
        credentials: "include",
        body: {
          ...value,
          icon: undefined,
          dateOfBirth: removeHyphens(value.dateOfBirth),
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("登録情報の編集が完了しました");
        if (returnPage === "opinion") {
          navigate(`/create/${sessionID}/opinion`);
        } else {
          navigate(`/${sessionID}`);
        }
      }
    },
  });
};
