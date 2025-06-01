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
    return Number.parseInt(formattedDate);
  } catch {
    return null;
  }
};

/**
 * YYYYMMDD形式の文字列をYYYY-MM-DD形式に変換する関数
 * - サーバーから数値で来るのでそれをinput=dateに渡すために変換する関数
 */
export const formatDate = (str?: string) => {
  return str?.replace(
    // biome-ignore lint/performance/useTopLevelRegex: <explanation>
    /^(\d{4})(\d{2})(\d{2})$/,
    "$1-$2-$3",
  );
};

/**
 * 日付が現在時刻より前かどうかを判定する関数
 * @param date YYYY-MM-DD形式の文字列
 * @returns
 */
export const isEnd = (date?: string) => {
  return JST(date).isBefore(JST(dayjs()));
};
