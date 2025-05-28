import { Outlet, useNavigate } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Route } from "~/react-router/_pages/+types/route";
import type { RouteContext } from "~/types/ctx";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useEffect } from "react";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader } from "./modules/loader";

export default function Layout({
  loaderData: { $user },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  // ログイン済みだったらホームにリダイレクト
  useEffect(() => {
    $user.then((user) => {
      if (user && window.location.pathname === "/") {
        navigate("/home", { replace: true });
      }
    });
  }, []);

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
        autoClose={6000}
        pauseOnFocusLoss={false}
        hideProgressBar={true}
        transition={Slide}
        draggable={true}
        theme="dark"
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "0 10px",
        }}
        toastStyle={{
          maxWidth: "600px",
          width: "100%",
          marginBottom: "10px",
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      />
    </>
  );
}
