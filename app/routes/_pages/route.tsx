import { Outlet } from "react-router";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Route } from "~/react-router/_pages/+types/route";
import type { RouteContext } from "~/types/ctx";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader } from "./modules/loader";

export default function Layout({
  loaderData: { $user },
}: Route.ComponentProps) {
  return (
    <>
      {/* 実際に見えるコンテンツ */}
      <Header $user={$user} />
      <main className="flex min-h-[calc(100vh-48px)] flex-col">
        <Outlet context={{ $user } satisfies RouteContext} />
      </main>
      <Footer />

      {/* -- 以下ダイアログなど -- */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        pauseOnFocusLoss={false}
        hideProgressBar={true}
        transition={Zoom}
        draggable={true}
        theme="dark"
        style={{
          maxWidth: "360px",
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          bottom: "20px",
        }}
        toastStyle={{
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      />
    </>
  );
}
