import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getTopLevelPath } from "./path";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const returnTo = getTopLevelPath(window.location.href);

  return (
    <button onClick={() => logout({ logoutParams: { returnTo } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;