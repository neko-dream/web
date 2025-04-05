import {
  createPagesFunctionHandler,
  type createPagesFunctionHandlerParams,
} from "@react-router/cloudflare";
import * as build from "../build/server";

export const onRequest = createPagesFunctionHandler({
  build: build as unknown as createPagesFunctionHandlerParams["build"],
});
