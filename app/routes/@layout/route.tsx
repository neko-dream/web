import { Outlet } from "react-router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchMenuDialog } from "./components/SearchMenuDialog";
import { loader } from "./modules/loader";
import type { Route } from "~/app/routes/@layout/+types/route";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader };

export default function Route({ loaderData: { $user } }: Route.ComponentProps) {
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);

  return (
    <>
      {/* トースター */}
      <ToastContainer position="top-center" autoClose={1500} />

      {/* 検索ダイアログ */}
      <SearchMenuDialog
        open={isSearchMenuOpen}
        onOpenChange={setIsSearchMenuOpen}
      />

      {/* 実際に見えるコンテンツ */}
      <Header $user={$user} setIsSearchMenuOpen={setIsSearchMenuOpen} />
      <main className="flex min-h-screen flex-col">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
