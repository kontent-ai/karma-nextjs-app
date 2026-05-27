"use client";

import type { FC } from "react";
import { Container } from "@/components/Container.tsx";
import { EnvLink } from "@/components/EnvLink.tsx";

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

const TenantErrorPage: FC<ErrorPageProps> = ({ error, reset }) => {
  const isDev = process.env.NODE_ENV === "development";
  const detail = isDev ? error.message : null;

  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-heading-1 text-heading-1-color mb-4">Oops</h1>
        <h2 className="text-heading-3 text-heading-3-color mb-6">Something went wrong</h2>
        <p className="text-body-lg text-body-color mb-8 text-center max-w-xl">
          We hit an unexpected error while loading this environment. Please try again, or head back
          to its homepage.
        </p>
        {detail ? (
          <pre className="text-body-sm text-body-color mb-8 text-center max-w-xl whitespace-pre-wrap">
            {detail}
          </pre>
        ) : null}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 border border-button-border-color bg-button-background-color text-button-text-color hover:bg-button-background-hover-color hover:border-button-border-hover-color hover:text-button-text-hover-color transition-colors duration-200 rounded-md"
          >
            Try again
          </button>
          <EnvLink
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-button-border-color bg-button-background-color text-button-text-color hover:bg-button-background-hover-color hover:border-button-border-hover-color hover:text-button-text-hover-color transition-colors duration-200 rounded-md"
          >
            Return to Home
          </EnvLink>
        </div>
      </div>
    </Container>
  );
};

export default TenantErrorPage;
