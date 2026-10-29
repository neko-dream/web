type EnvironmentOptions = {
  command: "build" | "serve";
  cloudflareEnv?: string;
  localApiUrl?: string;
};
const LOCAL_API_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const DEPLOYMENT_ENVIRONMENTS = new Set(["develop", "staging", "production"]);

export function selectEnvironment({
  command,
  cloudflareEnv,
  localApiUrl,
}: EnvironmentOptions): string | undefined {
  if (localApiUrl) {
    if (command === "build") {
      throw new Error(
        "LOCAL_API_URL is only allowed for the local dev server, never a build",
      );
    }
    if (cloudflareEnv) {
      throw new Error("LOCAL_API_URL cannot be combined with CLOUDFLARE_ENV");
    }
    if (!LOCAL_API_PATTERN.test(localApiUrl)) {
      throw new Error("LOCAL_API_URL must point to a local HTTP API");
    }
    return undefined;
  }
  if (command === "build" && !cloudflareEnv) {
    throw new Error(
      "Builds require explicit CLOUDFLARE_ENV (develop, staging or production)",
    );
  }
  const environment = cloudflareEnv ?? "develop";
  if (!DEPLOYMENT_ENVIRONMENTS.has(environment)) {
    throw new Error(`Unknown CLOUDFLARE_ENV: ${environment}`);
  }
  return environment;
}

function deploymentOrigin(value: unknown, name: string): string {
  if (typeof value !== "string") {
    throw new Error(`${name} must be defined in the selected environment`);
  }
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.origin !== value ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]" ||
    url.hostname.endsWith(".localhost") ||
    url.hostname.endsWith(".test") ||
    url.hostname === "local.kotohiro.com"
  ) {
    throw new Error(`${name} must be a deployed HTTPS origin, not a local URL`);
  }
  return value;
}

export function resolveUrls(
  environment: string | undefined,
  env?: Record<string, unknown>,
) {
  if (!environment) {
    return {
      APP_URL: "https://localhost:3000",
      API_URL: "https://localhost:3000/api",
    };
  }
  if (!DEPLOYMENT_ENVIRONMENTS.has(environment)) {
    throw new Error("Unknown deployment environment");
  }
  return {
    APP_URL: deploymentOrigin(env?.APP_URL, "APP_URL"),
    API_URL: deploymentOrigin(env?.API_URL, "API_URL"),
  };
}
