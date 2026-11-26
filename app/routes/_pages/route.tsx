import { Outlet, useLocation, useNavigate } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, useEffect } from "react";
import { useAuthStore } from "~/hooks/useAuthStore";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";
export { meta } from "./modules/meta";

const Analytics = lazy(() => import("~/components/features/analytics"));

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const isTopPage = pathname === "/";
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/email/verify" ||
    pathname === "/auth/password/setup" ||
    pathname === "/organization/login";
  // 組織向けログインは左側にロゴを置くので、トップページと同じくヘッダーを出さない
  const hideHeader =
    isTopPage ||
    pathname === "/organization/login" ||
    pathname === "/auth/password/setup";

  // ログイン状態が確定してからトップページをホームへ逃がす
  useEffect(() => {
    if (user && pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [user, pathname, navigate]);

  return (
    <>
      {!isAuthPage && <Analytics />}
      {/* 実際に見えるコンテンツ */}
      {!hideHeader && <Header />}
      <main
        className={
          hideHeader
            ? "flex min-h-screen flex-col"
            : "flex min-h-[calc(100vh-48px)] flex-col"
        }
      >
        <Outlet />
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
