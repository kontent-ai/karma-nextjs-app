import type { FC, PropsWithChildren } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { AppContextComponent } from "../context/AppContext.tsx";
import { SmartLinkContextComponent } from "../context/SmartLinkContext.tsx";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";

const Layout: FC<PropsWithChildren> = () => (
  <AppContextComponent>
    <SmartLinkContextComponent>
      <div className="flex flex-col min-h-screen">
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Header />
        <Outlet />
        <Footer />
      </div>
    </SmartLinkContextComponent>
  </AppContextComponent>
);

export default Layout;
