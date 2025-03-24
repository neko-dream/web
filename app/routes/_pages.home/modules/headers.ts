import type { Route } from "~/app/routes/home/+types/index";

export function headers(headers: Route.HeadersArgs) {
  console.log(headers);

  return {
    "KOTO-HIRO": "true",
  };
}
