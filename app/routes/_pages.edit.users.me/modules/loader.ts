import { requireLoginLoader } from "~/utils/requireLoginLoader";

export const loader = requireLoginLoader(async (_, user) => {
  return { user };
});
