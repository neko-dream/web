import { components } from "~/libs/api/openapi";

export type User = components["schemas"]["user"] &
  Partial<components["schemas"]["userDemographics"]>;
