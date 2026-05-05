import { Auth0Provider } from "@auth0/auth0-react";
import type { FC, PropsWithChildren } from "react";
import { useNavigate } from "react-router";

type Auth0ProviderWithRedirectProps = PropsWithChildren<{
  domain: string;
  clientId: string;
  redirectUri: string;
}>;

const Auth0ProviderWithRedirect: FC<Auth0ProviderWithRedirectProps> = ({
  children,
  domain,
  clientId,
  redirectUri,
}) => {
  const navigate = useNavigate();

  const onRedirectCallback = () => {
    void navigate("/");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        audience: "https://app.kenticocloud.com/",
        redirect_uri: redirectUri,
        scope: "openid",
        responseType: "token id_token",
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithRedirect;
