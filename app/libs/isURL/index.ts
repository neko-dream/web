import * as v from "valibot";

const schema = v.pipe(v.string(), v.url());

export const isURL = (text?: unknown): text is string => {
  return v.safeParse(schema, text).success;
};
