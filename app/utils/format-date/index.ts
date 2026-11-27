import dayjs from "dayjs";
import { JST } from "~/libs/dayjs";

/**
 * YYYY-MM-DD to YYYYMMDDに変換する関数
 * - 日付を受け取るときにAPIが現状なってるための対応
 */
export const removeHyphens = (date?: string) => {
  try {
    const formattedDate = dayjs(date).format("YYYYMMDD");
    if (formattedDate === "Invalid Date") {
      throw new Error("Invalid date format");
    }
    return Number.parseInt(formattedDate, 10);
  } catch {
    return null;
  }
};

/**
 * YYYYMMDD形式の文字列をYYYY-MM-DD形式に変換する関数
 * - サーバーから数値で来るのでそれをinput=dateに渡すために変換する関数
 */
export const formatDate = (str?: string) => {
  return str?.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
};

/**
 * 日付が現在時刻より前かどうかを判定する関数
 * @param date YYYY-MM-DD形式の文字列
 * @returns
 */
export const isEnd = (date?: string) => {
  return JST(date).isBefore(JST(dayjs()));
};

/**
 * 募集期間の日付を、その日の終わり（JST 23:59:59.999）のISO文字列に変換する。
 * 日付だけの入力をその日の0時にすると、表示上の「まで」より1日早く終了するため。
 */
export const toScheduledEndTime = (date?: string): string | null => {
  if (!date) {
    return null;
  }
  const endOfDay = JST(`${date}T00:00:00+09:00`).endOf("day");
  return endOfDay.isValid() ? endOfDay.toISOString() : null;
};
