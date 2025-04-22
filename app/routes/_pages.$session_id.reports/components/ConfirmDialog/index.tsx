import { CenterDialog, type ModalProps } from "~/components/ui/modal";

type Props = Omit<ModalProps, "children"> & {
  isDeleted: boolean;
  onSubmitHold: () => void;
  onSubmitDelete: () => void;
  onCancel: () => void;
};

export const ConfiromDialog = ({
  onCancel,
  onSubmitDelete,
  onSubmitHold,
  ...props
}: Props) => {
  return (
    <CenterDialog {...props}>
      <div className="space-y-4 p-4 text-center">
        <p className="font-semibold text-lg">
          {props.isDeleted
            ? "この意見を削除しますか？"
            : "この意見を対応保留にしますか？"}
        </p>
        <p className="text-sm">
          {props.isDeleted
            ? "削除すると意見は閲覧できなくなり、かわりに通報理由（例：スパム）が公開されます。"
            : "対応保留にすると、ユーザーは意見を閲覧できるようになります。"}
        </p>
        <div className="flex justify-around">
          <button type="button" onClick={onCancel} className="cursor-pointer">
            キャンセル
          </button>
          {props.isDeleted && (
            <button
              type="button"
              onClick={onSubmitDelete}
              className="cursor-pointer text-mt-red"
            >
              削除する
            </button>
          )}
          {!props.isDeleted && (
            <button
              type="button"
              onClick={onSubmitHold}
              className="cursor-pointer text-mt-blue-600"
            >
              保留にする
            </button>
          )}
        </div>
      </div>
    </CenterDialog>
  );
};
