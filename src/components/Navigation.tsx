import type { FC } from "react";
import { EnvLink } from "./EnvLink.tsx";

const navLinks: ReadonlyArray<{ name: string; path: string }> = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Our Team", path: "/our-team" },
  { name: "Research", path: "/research" },
  { name: "Blog", path: "/blog" },
];

export const Navigation: FC = () => (
  <nav>
    <menu className="flex flex-col lg:flex-row gap-5 lg:gap-[60px] items-center list-none">
      {navLinks.map(({ name, path }) => (
        <li key={name}>
          <EnvLink
            href={path}
            className="text-xl leading-5 text-gray w-fit block hover:text-burgundy"
          >
            {name}
          </EnvLink>
        </li>
      ))}
    </menu>
  </nav>
);
