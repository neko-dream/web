import type { components } from "./openapi";

export type VoteType = Exclude<
  components["schemas"]["opinion"]["voteType"],
  null | undefined
>;

export type User = Partial<components["schemas"]["user"]> &
  Partial<components["schemas"]["userDemographics"]>;
