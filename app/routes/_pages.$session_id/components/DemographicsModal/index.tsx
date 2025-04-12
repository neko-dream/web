import { Suspense } from "react";
import { Await, Link } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import { CenterDialog, type ModalProps } from "~/components/ui/modal";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";

type Props = Omit<ModalProps, "children"> &
  Pick<Route.ComponentProps["loaderData"], "$restrictions"> & {
    sessionID: string;
  };

export const DemographicsModal = ({
  $restrictions,
  sessionID,
  ...props
}: Props) => {
  const handleClose = () => {
    props.onOpenChange(false);
  };

  return (
    <CenterDialog {...props}>
      <Suspense>
        <Await resolve={$restrictions}>
          {(restrictions) => {
            return (
              <div className="w-[327px] p-2">
                <p className="text-center font-bold text-[18px]">
                  参加される方へ
                </p>
                <p className="mt-4 text-center text-sm">
                  このセッションは、より良い意思決定のため
                  以下の情報を入力した方が参加可能です🍀
                </p>
                <div className="mt-4 space-y-2">
                  {restrictions.map(({ description, required }, i) => {
                    return (
                      <div key={i} className="flex items-center space-x-2">
                        <Checkbox
                          id=""
                          label=""
                          defaultChecked={!required}
                          disabled={!required}
                        />
                        <p
                          className={`font-semibold ${required ? "" : "text-[#C1C2C5]"}`}
                        >
                          {description}
                        </p>
                        {required && (
                          <p className="font-semibold text-[#FF2D55]">
                            （未入力）
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-col space-y-4">
                  <Link
                    className="text-center font-bold text-mt-blue-600"
                    to={`/request/demographics/${sessionID}?page=opinion`}
                  >
                    情報を入力して参加する
                  </Link>
                  <button
                    onClick={handleClose}
                    type="button"
                    className="font-bold text-mt-disabled"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </CenterDialog>
  );
};
