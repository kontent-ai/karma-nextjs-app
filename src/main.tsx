import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router-dom";
import Auth0ProviderWithRedirect from "./components/auth/AuthProviderWithRedirect.tsx";
import Layout from "./components/Layout.tsx";
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

const { VITE_AUTH_DOMAIN, VITE_AUTH_CLIENT_ID, VITE_AUTH_REDIRECT_URL } = import.meta.env;

if (!VITE_AUTH_DOMAIN || !VITE_AUTH_CLIENT_ID || !VITE_AUTH_REDIRECT_URL) {
  const missing = [
    !VITE_AUTH_DOMAIN && "VITE_AUTH_DOMAIN",
    !VITE_AUTH_CLIENT_ID && "VITE_AUTH_CLIENT_ID",
    !VITE_AUTH_REDIRECT_URL && "VITE_AUTH_REDIRECT_URL",
  ]
    .filter(Boolean)
    .join(", ");
  console.warn(
    `Missing ${missing}. Auth0 is disabled — preview routes (/envid/:envId) will not work. See .env.template.`,
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: BaseRouting,
  },
  ...(VITE_AUTH_DOMAIN && VITE_AUTH_CLIENT_ID && VITE_AUTH_REDIRECT_URL
    ? [
        {
          path: "/envid/:envId",
          element: (
            <Auth0ProviderWithRedirect
              domain={VITE_AUTH_DOMAIN}
              clientId={VITE_AUTH_CLIENT_ID}
              redirectUri={VITE_AUTH_REDIRECT_URL}
            >
              <Layout />
            </Auth0ProviderWithRedirect>
          ),
          children: BaseRouting.map((p) => ({
            path: `envid/:envId/${p.path}`,
            ...p,
          })),
        },
      ]
    : []),
]);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
