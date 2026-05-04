import type { FC } from "react";
import { NavLink, useParams, useSearchParams } from "react-router";
import { createPreviewLink } from "../utils/link.ts";

const navLinks: ReadonlyArray<{ name: string; path: string }> = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Our Team", path: "/our-team" },
  { name: "Research", path: "/research" },
  { name: "Blog", path: "/blog" },
];

const Navigation: FC = () => {
  const { envId } = useParams();
  const [searchParams] = useSearchParams();
  const isPreviewEnabled = searchParams.get("preview") === "true";

  const prefix = envId ? `/envid/${envId}` : "";

  return (
    <nav>
      <menu className="flex flex-col lg:flex-row gap-5 lg:gap-[60px] items-center list-none">
        {navLinks.map(({ name, path }) => (
          <li key={name}>
            <NavLink
              to={createPreviewLink(
                `${prefix}${path === "/" && envId ? "" : path}`,
                isPreviewEnabled,
              )}
              className="text-xl leading-5 text-gray w-fit block hover:text-burgundy"
            >
              {name}
            </NavLink>
          </li>
        ))}
      </menu>
    </nav>
  );
};

export default Navigation;
