import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router-dom";
import Auth0ProviderWithRedirect from "./components/auth/AuthProviderWithRedirect.tsx";
import Layout from "./components/Layout.tsx";
import Loader from "./components/Loader.tsx";
import NotFound from "./components/NotFound.tsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.tsx";
import ArticlesListingPage from "./pages/ArticlesListingPage.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import OurTeamPage from "./pages/OurTeamPage.tsx";
import PersonDetailPage from "./pages/PersonDetailPage.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import ServicesListingPage from "./pages/ServicesListingPage.tsx";

const queryClient = new QueryClient();

const BaseRouting: RouteObject[] = [
  {
    path: "",
    Component: LandingPage,
  },
  {
    path: "blog",
    Component: BlogPage,
  },
  {
    path: "blog/:slug",
    Component: BlogDetail,
  },
  {
    path: "services",
    Component: ServicesListingPage,
  },
  {
    path: "services/:slug",
    Component: ServiceDetail,
  },
  {
    path: "research",
    Component: ArticlesListingPage,
  },
  {
    path: "research/:slug",
    Component: ArticleDetailPage,
  },
  {
    path: "our-team",
    Component: OurTeamPage,
  },
  {
    path: "our-team/:slug",
    Component: PersonDetailPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: BaseRouting,
  },
  {
    path: "/envid/:envId",
    element: (
      <Auth0ProviderWithRedirect>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div>
              There was an error!{" "}
              <pre>{error instanceof Error ? error.message : String(error)}</pre>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div className="flex w-screen h-screen justify-center">
                <Loader />
              </div>
            }
          >
            <Layout />
          </Suspense>
        </ErrorBoundary>
      </Auth0ProviderWithRedirect>
    ),
    children: BaseRouting.map((p) => ({
      path: `envid/:envId/${p.path}`,
      ...p,
    })),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
