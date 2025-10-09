import React from "react";
import { isLoggedInVar } from "../apollo";
import { gql } from "@apollo/client";

import { Route, BrowserRouter as Router } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { Redirect } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { EditProfile } from "../pages/user/edit-profile";
import { ConfirmEmail } from "../pages/user/confirm-email";

const ClientRoutes = [
  <Route key={1} path="/" exact>
    <Restaurants />
  </Route>,
  <Route key={2} path="/confirm" exact>
    <ConfirmEmail />
  </Route>,
  <Route key={3} path="/edit-profile" exact>
    <EditProfile />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const onClick = () => {
    isLoggedInVar(false);
  };

  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl ">로딩중...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header email={data.me.email} />
      <Switch>{data.me.role === "Client" && ClientRoutes}</Switch>
    </Router>
  );
};
