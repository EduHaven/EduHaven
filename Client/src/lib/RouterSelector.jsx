import { BrowserRouter, HashRouter } from "react-router-dom";

export default function RouterSelector({ children }) {
  const isExtension =
    location.protocol === "chrome-extension:" ||
    import.meta.env.VITE_BUILD_TARGET === "extension";

  const Router = isExtension ? HashRouter : BrowserRouter;

  return <Router>{children}</Router>;
}
