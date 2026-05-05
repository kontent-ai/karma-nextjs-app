import { type FC, type PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { AppContextComponent } from "../context/AppContext.tsx";
import { SmartLinkContextComponent } from "../context/SmartLinkContext.tsx";
import { NotFoundError } from "../utils/errors.ts";
import ErrorPage from "./ErrorPage.tsx";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";
import Loader from "./Loader.tsx";
import NotFound from "./NotFound.tsx";

const Layout: FC<PropsWithChildren> = () => {
  const location = useLocation();
  return (
    <AppContextComponent>
      <SmartLinkContextComponent>
        <div className="flex flex-col min-h-screen">
          <ScrollRestoration getKey={(loc) => loc.pathname} />
          <Header />
          <ErrorBoundary
            resetKeys={[location.key]}
            fallbackRender={({ error }) =>
              error instanceof NotFoundError ? <NotFound /> : <ErrorPage error={error} />
            }
          >
            <Suspense
              fallback={
                <div className="flex flex-grow items-center justify-center py-20">
                  <Loader />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
          <Footer />
        </div>
      </SmartLinkContextComponent>
    </AppContextComponent>
  );
};

export default Layout;
