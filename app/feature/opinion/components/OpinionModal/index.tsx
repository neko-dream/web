import { getFormProps, getInputProps } from "@conform-to/react";
import { animated } from "@react-spring/web";
import { Form } from "react-router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Textarea from "~/components/Textarea";
import { useOpinonModal } from "./hooks/useOpinionModal";
import { useCreateOpinionsForm } from "../../hooks/useCreateOpinionForm";
import { tv } from "tailwind-variants";
import Uploadarea from "~/components/Uploadarea";
import { toast } from "react-toastify";

type Props = {
  talkSessionID: string;
  parentOpinionID?: string;
  open: boolean;
  onClose: () => void;
};

const modal = tv({
  base: "absolute bottom-0 w-[375px] touch-none will-change-transform",
  variants: {
    parent: {
      true: "h-[calc(100svh-188px)]",
    },
    root: {
      true: "h-[calc(100svh-280px)]",
    },
  },
});

export const OpinionModal = ({
  open,
  onClose,
  talkSessionID,
  parentOpinionID,
}: Props) => {
  const { item, api, bind } = useOpinonModal({
    onClose: () => handleCloseModal(),
  });

  const { form, fields, isDisabled } = useCreateOpinionsForm({
    talkSessionID,
    parentOpinionID,
    onFinishedProcess: () => {
      handleCloseModal();
      form.reset();
      setPreview(undefined);
    },
  });

  useEffect(() => {
    if (open) {
      api.start({ opacity: 1, y: 0 });
    } else {
      api.start({ opacity: 1, y: 800 });
    }
  }, [api, open]);

  // MEMO: モーダルが開いている間はスクロール禁止する
  const noscroll = (e: Event) => e.preventDefault();

  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0);
      document.addEventListener("touchmove", noscroll, {
        passive: false,
      });
      document.addEventListener("wheel", noscroll, { passive: false });
    }
    return () => {
      document.removeEventListener("touchmove", noscroll);
      document.removeEventListener("wheel", noscroll);
    };
  }, [open]);

  const handleCloseModal = () => {
    api.start(() => {
      return {
        opacity: 0,
        y: 500,
      };
    });
    onClose();
  };

  const [preview, setPreview] = useState<string>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOnChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return toast.error("画像を選択してください");
    }
    const [file] = e.target.files;
    setPreview(URL.createObjectURL(file));
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <animated.div
        style={item}
        className={modal({
          parent: !parentOpinionID,
          root: !!parentOpinionID,
          className: "z-30 rounded-t-xl border-t border-gray-200 bg-white",
        })}
      >
        <Form
          {...getFormProps(form)}
          method="post"
          onSubmit={form.onSubmit}
          className="z-10 flex h-full w-full max-w-[375px] flex-col space-y-4 px-4"
        >
          <animated.div
            {...bind()}
            className="mx-auto w-full cursor-pointer py-2"
          >
            <div className="mx-auto h-1 w-[50%] rounded-full bg-slate-400" />
            <p className="mt-2 select-none text-center">あなたはどう思う？</p>
          </animated.div>
          <Label title="意見" optional>
            <Textarea
              {...getInputProps(fields.opinionContent, {
                type: "text",
              })}
            />
          </Label>
          <Label title="参考文献" optional>
            <Input
              className="h-12 w-full px-4"
              {...getInputProps(fields.referenceURL, {
                type: "text",
              })}
            />
          </Label>
          <Label title="参考画像" optional className="mb-8">
            <Uploadarea
              onClick={() => {
                inputFileRef.current?.click();
              }}
              preview={preview}
            />
          </Label>
          {/* UIには表示しない */}
          <input
            {...getInputProps(fields.picture, { type: "file" })}
            ref={inputFileRef}
            accept="image/png,image/jpeg"
            hidden
            onChange={handleOnChangeInputFile}
          />

          <Button
            type="submit"
            variation="primary"
            className="mx-auto !mb-8 !mt-auto"
            disabled={isDisabled}
          >
            送信する
          </Button>
        </Form>
      </animated.div>

      <animated.div
        style={{ opacity: item.opacity }}
        className={modal({
          parent: !parentOpinionID,
          root: !!parentOpinionID,
          className: "bottom-4 bg-gray-600/60 pt-4",
        })}
        onClick={handleCloseModal}
      />
    </>
  );
};
