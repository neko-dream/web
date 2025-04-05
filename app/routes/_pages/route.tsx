import { Outlet } from "react-router";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Route } from "~/app/routes/_pages/+types/route";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { loader } from "./modules/loader";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader };

export default function Layout({
  loaderData: { $user },
}: Route.ComponentProps) {
  return (
    <>
      {/* 実際に見えるコンテンツ */}
      <Header $user={$user} />
      <main className="flex min-h-[calc(100vh-48px)] flex-col">
        <Outlet />
      </main>
      <Footer />

      {/* -- 以下ダイアログなど -- */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnFocusLoss={false}
        hideProgressBar={true}
        transition={Zoom}
        draggable={true}
      />
    </>
  );
}
