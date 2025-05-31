import dayjs from "dayjs";

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
