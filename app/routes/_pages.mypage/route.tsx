import { Outlet } from "react-router";

export { ErrorBoundary } from "./modules/ErrorBoundary";

export default function Route() {
  return <Outlet />;
}
