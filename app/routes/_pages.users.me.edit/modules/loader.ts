import { requireLoginLoader } from "~/modules/requireLoginLoader";

export const loader = requireLoginLoader(async (_, user) => {
  return { user };
});
