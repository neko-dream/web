import { Outlet } from "react-router";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loader } from "./modules/loader";
import type { Route } from "~/app/routes/_pages/+types/route";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader };

export default function Route({ loaderData: { $user } }: Route.ComponentProps) {
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
