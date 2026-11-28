import { Outlet, useLocation, useNavigate } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, useEffect } from "react";
import { BottomNav } from "~/components/features/bottom-nav";
import { useAuthStore } from "~/hooks/useAuthStore";
import { canCreateTalkSession } from "~/libs/session-creation";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";
export { meta } from "./modules/meta";

const Analytics = lazy(() => import("~/components/features/analytics"));

const SESSION_PATH_PATTERN =
  /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const permissions = useAuthStore((state) => state.permissions);
  const isLoggedIn = !!user;
  const canCreate = canCreateTalkSession(permissions);

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/email/verify" ||
    pathname === "/auth/password/setup" ||
    pathname === "/organization/login";

  const isTopPage = pathname === "/";
  const isTabPage =
    pathname === "/home" ||
    pathname === "/search" ||
    pathname.startsWith("/users/me");
  const isSessionPage = SESSION_PATH_PATTERN.test(pathname);
  const isSwipePage = pathname.startsWith("/swipe/");
  const isMakePage = pathname.startsWith("/make/");

  // アプリ内の主要画面はボトムナビと各画面のヘッダーに任せる
  const hideHeader =
    isTopPage ||
    isAuthPage ||
    isTabPage ||
    isSessionPage ||
    isSwipePage ||
    isMakePage;
  // フッターは公開ページだけに出す
  const showFooter = isTopPage || isAuthPage || pathname.startsWith("/guide");

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
            ? `flex min-h-screen flex-col ${
                isTabPage
                  ? "pb-[calc(env(safe-area-inset-bottom,0px)+88px)]"
                  : ""
              }`
            : "flex min-h-[calc(100vh-56px)] flex-col"
        }
      >
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <BottomNav isLoggedIn={isLoggedIn} canCreate={canCreate} />

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
