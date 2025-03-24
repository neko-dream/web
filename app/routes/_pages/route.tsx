import { Outlet } from "react-router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchModal } from "./components/SearchModal";
import { loader } from "./modules/loader";
import type { Route } from "~/app/routes/_pages/+types/route";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MenuDialog } from "./components/MenuDialog";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader };

export default function Route({ loaderData: { $user } }: Route.ComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* 実際に見えるコンテンツ */}
      <Header
        $user={$user}
        setIsSearchOpen={setIsSearchOpen}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />
      <main className="flex min-h-[calc(100vh-48px)] flex-col">
        <Outlet />
      </main>
      <Footer />

      {/* -- 以下ダイアログなど -- */}
      <ToastContainer position="top-center" autoClose={1500} />
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <MenuDialog open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  );
}
