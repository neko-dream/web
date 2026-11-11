import type { LinksFunction } from "react-router";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./tailwind.css";
import { type JSX, useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "manifest", href: "/manifest.json", crossOrigin: "use-credentials" },
];

export function Layout() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <Meta />
        <Links />
      </head>
      <body className="relative">
        <Scripts />
        <ScrollRestoration />
        <Outlet />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    if (LOCAL_API_URL || !("serviceWorker" in navigator)) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return <Outlet />;
}

/**
 * SPA の初回読み込みで各ルートの clientLoader が完了するまで表示する
 */
export function HydrateFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
        role="status"
        aria-label="読み込み中"
      />
    </div>
  );
}

export function ErrorBoundary(): JSX.Element {
  return (
    <div className="flex h-screen flex-1 flex-col items-center justify-center">
      <div className="rounded-md bg-gray-50 px-16 py-8">
        <p className="font-bold text-3xl">NotFound</p>
        <p className="mt-2">お探しのページは見つかりませんでした</p>
        <Link to="/" className="mt-6 block text-end text-blue-500 underline">
          TOPへ戻る
        </Link>
      </div>
    </div>
  );
}
