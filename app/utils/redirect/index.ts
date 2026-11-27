/**
 * クエリなど外部から渡された値を、同一オリジンのパスだけに制限する。
 * `//example.com` や `/\example.com` のような protocol-relative URL も拒否する。
 */
export const toSafeInternalPath = (
  value: string | null | undefined,
): string | null => {
  if (!value?.startsWith("/")) {
    return null;
  }

  const base = "https://internal.invalid";
  try {
    const url = new URL(value, base);
    if (url.origin !== base) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};
