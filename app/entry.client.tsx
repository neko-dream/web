import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// sw.jsをサービスワーカーとして登録
declare const LOCAL_API_URL: string;
// Self-signed local TLS cannot register a Service Worker. Keep the local
// runtime free of cached responses while testing authentication.
if (!LOCAL_API_URL && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
