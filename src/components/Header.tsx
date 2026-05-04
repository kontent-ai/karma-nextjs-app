import { useLocation, useSearchParams } from "react-router-dom";
import { IconButton } from "../icons/IconButton.tsx";
import IconSpain from "../icons/IconSpain.tsx";
import IconUnitedStates from "../icons/IconUnitedStates.tsx";
import Container from "./Container.tsx";
import Logo from "./Logo.tsx";
import Navigation from "./Navigation.tsx";

const Header: React.FC = () => {
  const location = useLocation();
  const isResearchPage = location.pathname.match(/^\/research\/[\w-]+$/);
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang");

  return (
    <Container>
      <div className="py-8 flex flex-col gap-8 xl:gap-0 lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-12 xl:gap-32 items-center list-none">
          <Logo />
          <Navigation />
        </div>
        {isResearchPage && (
          <div className="flex gap-2 xl:pr-16 justify-self-end items-center">
            <IconButton
              icon={<IconUnitedStates className={`hover:cursor-pointer hover:scale-110`} />}
              isSelected={lang === "en-US" || lang === null}
              onClick={() =>
                setSearchParams((prev) => {
                  prev.delete("lang");
                  return prev;
                })
              }
            />
            <IconButton
              icon={<IconSpain className={`hover:cursor-pointer hover:scale-110`} />}
              isSelected={lang === "es-ES"}
              onClick={() => {
                setSearchParams((prev) => {
                  prev.set("lang", "es-ES");
                  return prev;
                });
              }}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Header;
