import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import Container from "./Container.tsx";

type ErrorPageProps = {
  error?: unknown;
};

const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  const detail = import.meta.env.DEV && error instanceof Error ? error.message : null;

  return (
    <Container>
      <Helmet>
        <title>Error</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-heading-1 text-heading-1-color mb-4">Oops</h1>
        <h2 className="text-heading-3 text-heading-3-color mb-6">Something went wrong</h2>
        <p className="text-body-lg text-body-color mb-8 text-center max-w-xl">
          We hit an unexpected error while loading this page. Please try again, or head back to the
          homepage.
        </p>
        {detail ? (
          <pre className="text-body-sm text-body-color mb-8 text-center max-w-xl whitespace-pre-wrap">
            {detail}
          </pre>
        ) : null}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-button-border-color bg-button-background-color text-button-text-color hover:bg-button-background-hover-color hover:border-button-border-hover-color hover:text-button-text-hover-color transition-colors duration-200 rounded-md"
        >
          Return to Home
        </Link>
      </div>
    </Container>
  );
};

export default ErrorPage;
