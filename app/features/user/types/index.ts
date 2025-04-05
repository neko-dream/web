import type { components } from "~/types/openapi";

export type User = components["schemas"]["user"] &
  Partial<components["schemas"]["userDemographics"]>;
