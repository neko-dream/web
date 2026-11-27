import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.locale(ja);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

export const JST = (date: dayjs.ConfigType) => {
  return dayjs(date).tz();
};
