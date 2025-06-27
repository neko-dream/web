import type { components } from "./openapi";

export type VoteType = Exclude<
  components["schemas"]["Opinion"]["voteType"],
  null | undefined
>;

export type User = Partial<components["schemas"]["User"]> &
  Partial<components["schemas"]["UserDemographics"]>;
