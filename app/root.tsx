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
import type { JSX } from "react";
import Analytics from "./components/features/analytics";

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
        <Analytics />
        <Outlet />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
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
