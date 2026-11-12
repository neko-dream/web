type EnvironmentOptions = {
  command: "build" | "serve";
  cloudflareEnv?: string;
  localApiUrl?: string;
  branch?: string;
};
const LOCAL_API_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const DEPLOYMENT_ENVIRONMENTS = ["develop", "staging", "production"] as const;
type DeploymentEnvironment = (typeof DEPLOYMENT_ENVIRONMENTS)[number];

const DEPLOYMENT_URLS: Record<
  DeploymentEnvironment,
  { APP_URL: string; API_URL: string }
> = {
  develop: {
    APP_URL: "https://develop.kotohiro.com",
    API_URL: "https://api.dev.kotohiro.com",
  },
  staging: {
    APP_URL: "https://staging.kotohiro.com",
    API_URL: "https://api.kotohiro.com",
  },
  production: {
    APP_URL: "https://www.kotohiro.com",
    API_URL: "https://api.kotohiro.com",
  },
};

const isDeploymentEnvironment = (
  value: string | undefined,
): value is DeploymentEnvironment =>
  DEPLOYMENT_ENVIRONMENTS.includes(value as DeploymentEnvironment);

// Cloudflare Workers Builds は名前付き環境を持たないブランチに
// CLOUDFLARE_ENV=development を自動で設定する
const CLOUDFLARE_PREVIEW_ENV = "development";

function environmentFromBranch(
  branch: string | undefined,
): DeploymentEnvironment {
  if (branch === "main" || branch === "production") {
    return "production";
  }
  if (branch === "staging") {
    return "staging";
  }
  return "develop";
}

export function selectEnvironment({
  command,
  cloudflareEnv,
  localApiUrl,
  branch,
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
  if (command === "build") {
    const isCloudflarePreview = cloudflareEnv === CLOUDFLARE_PREVIEW_ENV;
    const requestedEnv = isCloudflarePreview ? undefined : cloudflareEnv;
    if (!requestedEnv && !branch && !isCloudflarePreview) {
      throw new Error(
        "Builds require explicit CLOUDFLARE_ENV (develop, staging or production)",
      );
    }
    if (!requestedEnv) {
      return environmentFromBranch(branch);
    }
    if (!isDeploymentEnvironment(requestedEnv)) {
      throw new Error(`Unknown CLOUDFLARE_ENV: ${requestedEnv}`);
    }
    return requestedEnv;
  }
  const requestedEnv =
    cloudflareEnv === CLOUDFLARE_PREVIEW_ENV ? undefined : cloudflareEnv;
  if (requestedEnv && !isDeploymentEnvironment(requestedEnv)) {
    throw new Error(`Unknown CLOUDFLARE_ENV: ${requestedEnv}`);
  }
  return requestedEnv ?? environmentFromBranch(branch);
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
  if (!isDeploymentEnvironment(environment)) {
    throw new Error("Unknown deployment environment");
  }
  const defaults = DEPLOYMENT_URLS[environment];
  return {
    APP_URL: deploymentOrigin(env?.APP_URL ?? defaults.APP_URL, "APP_URL"),
    API_URL: deploymentOrigin(env?.API_URL ?? defaults.API_URL, "API_URL"),
  };
}
