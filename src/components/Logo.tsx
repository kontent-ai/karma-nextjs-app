import type { FC } from "react";
import { NavLink, useParams, useSearchParams } from "react-router";
import { createPreviewLink } from "../utils/link.ts";

const Logo: FC = () => {
  const { envId } = useParams();
  const [searchParams] = useSearchParams();
  const isPreviewEnabled = searchParams.get("preview") === "true";
  const prefix = envId ? `/envid/${envId}` : "";
  const homeTo = createPreviewLink(prefix || "/", isPreviewEnabled);

  return (
    <NavLink to={homeTo} aria-label="Karma Health home" className="flex gap-4 items-center">
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <title>Karma Health logo</title>
        <rect width="40" height="14" y="13" fill="#993265" rx="2.4px" />
        <rect width="14" height="40" x="13" fill="#993265" rx="2.4px" />
      </svg>
      <p className="text-5xl pt-1 text-azure font-libre font-bold text-nowrap">Karma Health</p>
    </NavLink>
  );
};

export default Logo;
