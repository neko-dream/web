import { type DefaultValue, useForm } from "@conform-to/react";
import { parseWithValibot } from "conform-to-valibot";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import type { ObjectEntries, ObjectSchema } from "valibot";
import type * as v from "valibot";
import { deleteDashValues } from "~/libs/form";

/**
 * valibot の共通のスキーマの型
 */
type U = ObjectSchema<ObjectEntries, undefined>;

/**
 * フォーム送信時の引数
 */
type OnSubmitProps<T extends U> = {
  e: FormEvent<HTMLFormElement>;
  value: deleteDashValues<v.InferOutput<T>>;
};

type Props<T extends U> = {
  schema: T;
  onSubmit: ({ e, value }: OnSubmitProps<T>) => Promise<void>;
  defaultValue?: DefaultValue<v.InferOutput<T>>;
  shouldValidate?: "onInput" | "onBlur";
};

/**
 * なんかいい感じにやってくれるフォームフック
 * @param schema conform のスキーマ
 * @param onSubmit フォームの送信時の処理
 *
 * MEMO: 引数のスキーマで値のチェックを行ったものを onSubmit で返しています。
 * MEMO: "---"の値は送信時に必要がないので削除しています。
 */
export const useCustomForm = <T extends U>({
  schema,
  onSubmit,
  defaultValue,
  shouldValidate = "onInput",
}: Props<T>) => {
  const [loading, setLoading] = useState(false);

  const [form, fields] = useForm({
    defaultValue,
    onSubmit: async (e, { submission }) => {
      e.preventDefault();

      if (loading) {
        return;
      }
      setLoading(true);

      try {
        await onSubmit({ e, value: deleteDashValues(submission?.payload) });
      } catch (_e) {
        toast.error("エラーが発生しました");
      } finally {
        setLoading(false);
      }
    },
    onValidate: ({ formData }) => {
      const parse = parseWithValibot(formData, { schema });
      return parse;
    },
    shouldValidate,
  });

  const isDisabled = handleDisabled(form.value, form.allErrors) || loading;

  return { form, fields, isDisabled };
};

/**
 *
 * conform のフォームでボタンを押せるかどうかを判定する
 *
 * 1. "---"を削除した後Formに値があるかどうか
 * 2. フォームのエラー配列にエラーがあるかどうか
 * @param value Form の内容を object で受け取る
 * ```
 * {
 *   name: "name",
 *   age: "---",
 * }
 * ```
 */
const handleDisabled = (value?: object, errors?: object) => {
  return (
    Object.keys(deleteDashValues(value)).length === 0 ||
    Object.keys(errors || {}).length > 0
  );
};
