import { FC, useMemo, useCallback, CSSProperties } from "react";
import dayjs from "dayjs";
import { ScrollPicker } from "./components";

const DATE_FORMAT = "YYYY-MM-DD";

const CURRENT_DAYJS = dayjs();
const DEFAULT_MIN_DATE_STRING = CURRENT_DAYJS.subtract(100, "year").format(
  DATE_FORMAT
);
const DEFAULT_MAX_DATE_STRING = CURRENT_DAYJS.add(100, "year").format(
  DATE_FORMAT
);

export type DateScrollPickerProps = {
  /** 日付 (YYYY-MM-DD string) */
  value: string;
  /** 最小日付 (YYYY-MM-DD string) */
  minDate?: string;
  /** 最大日付 (YYYY-MM-DD string) */
  maxDate?: string;
  /**
   * 日付が変更された時
   * @param newValue - 新しい日付 (YYYY-MM-DD string)
   */
  onChangeValue: (newValue: string) => void;
};

export const DateScrollPicker: FC<DateScrollPickerProps> = ({
  value,
  minDate = DEFAULT_MIN_DATE_STRING,
  maxDate = DEFAULT_MAX_DATE_STRING,
  onChangeValue,
}) => {
  const valueAsDayjs = useMemo(() => dayjs(value), [value]);
  const minDateAsDayjs = useMemo(() => dayjs(minDate), [minDate]);
  const maxDateAsDayjs = useMemo(() => dayjs(maxDate), [maxDate]);

  const { year, month, day } = useMemo(() => {
    return {
      year: valueAsDayjs.year(),
      month: valueAsDayjs.month() + 1, // dayjs month is 0-indexed
      day: valueAsDayjs.date(),
    };
  }, [valueAsDayjs]);

  const maxDayOfCurrentMonth = useMemo(() => {
    return valueAsDayjs.daysInMonth();
  }, [valueAsDayjs]);

  const yearItems = useMemo(() => {
    const startYear = minDateAsDayjs.year();
    const endYear = maxDateAsDayjs.year();
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const y = startYear + i;
      return {
        value: y,
        label: `${y}`,
      };
    });
  }, [minDateAsDayjs, maxDateAsDayjs]);

  const monthItems = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      // Construct dayjs objects for the first and last moment of the month
      const yearMonthFirst = dayjs()
        .year(year)
        .month(m - 1)
        .startOf("month");
      const yearMonthLast = dayjs()
        .year(year)
        .month(m - 1)
        .endOf("month");
      return {
        value: m,
        label: `${m}`,
        disabled:
          yearMonthLast.isBefore(minDateAsDayjs) ||
          yearMonthFirst.isAfter(maxDateAsDayjs),
      };
    });
  }, [maxDateAsDayjs, minDateAsDayjs, year]);

  const dayItems = useMemo(() => {
    return Array.from({ length: maxDayOfCurrentMonth }, (_, i) => {
      const d = i + 1;
      // Construct dayjs objects for the first and last moment of the day
      const dateAsDayjs = dayjs()
        .year(year)
        .month(month - 1)
        .date(d);
      const dateFirst = dateAsDayjs.startOf("day");
      const dateLast = dateAsDayjs.endOf("day");
      return {
        value: d,
        label: `${d}`,
        disabled:
          dateLast.isBefore(minDateAsDayjs) ||
          dateFirst.isAfter(maxDateAsDayjs),
      };
    });
  }, [maxDateAsDayjs, maxDayOfCurrentMonth, minDateAsDayjs, month, year]);

  const handleChangeValue = useCallback(
    (newDateCandidate: dayjs.Dayjs) => {
      let clampedDate = newDateCandidate;
      if (newDateCandidate.isBefore(minDateAsDayjs)) {
        clampedDate = minDateAsDayjs;
      }
      if (newDateCandidate.isAfter(maxDateAsDayjs)) {
        clampedDate = maxDateAsDayjs;
      }
      onChangeValue(clampedDate.format(DATE_FORMAT));
    },
    [maxDateAsDayjs, minDateAsDayjs, onChangeValue]
  );

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px", // Corresponds to spacing={1} (8px)
  };

  const labelStyle: CSSProperties = {
    // Add any specific styles for "年", "月", "日" if needed
    // For example, to match Typography's default variant:
    fontSize: "1rem",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
  };

  return (
    <div style={containerStyle}>
      <ScrollPicker
        value={year}
        items={yearItems}
        onChangeValue={(newYear) => {
          const currentMonthDayjs = dayjs()
            .year(newYear)
            .month(month - 1);
          const maxDayOfNewYearMonth = currentMonthDayjs.daysInMonth();
          handleChangeValue(
            currentMonthDayjs.date(Math.min(day, maxDayOfNewYearMonth))
          );
        }}
      />
      <span style={labelStyle}>年</span>
      <ScrollPicker
        value={month}
        items={monthItems}
        onChangeValue={(newMonth) => {
          const currentYearMonthDayjs = dayjs()
            .year(year)
            .month(newMonth - 1);
          const maxDayOfNewMonth = currentYearMonthDayjs.daysInMonth();
          handleChangeValue(
            currentYearMonthDayjs.date(Math.min(day, maxDayOfNewMonth))
          );
        }}
      />
      <span style={labelStyle}>月</span>
      <ScrollPicker
        value={day}
        items={dayItems}
        onChangeValue={(newDay) => {
          handleChangeValue(
            dayjs()
              .year(year)
              .month(month - 1)
              .date(newDay)
          );
        }}
      />
      <span style={labelStyle}>日</span>
    </div>
  );
};
