import * as v from "valibot";

export const schema = v.object({
  content: v.pipe(
    v.string(),
    v.minLength(2, "メッセージは2文字以上で入力してください"),
  ),
});
