import type { ReactNode } from "react";
import { Home, Pushpin, Smile, User } from "~/components/icons";

export const RESTRICTIONS_ICON_MAP: Record<string, ReactNode> = {
  "demographics.gender": <Smile />,
  "demographics.birth": <User />,
  "demographics.city": <Home />,
  "demographics.prefecture": <Pushpin />,
};
