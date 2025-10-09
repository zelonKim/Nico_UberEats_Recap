import React from "react";
import { Switch } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Login } from "../pages/login";
import { CreateAccount } from "../pages/create-account";
import { NotFound } from "../pages/404";

/*

export const LoggedOutRouter = () => {
  // const onClick = () => {
  //   isLoggedInVar(true);
  // };

  console.log(errors.email?.message);

  return (
    <div>
      <h1>로그아웃</h1>
    <button onClick={onClick}>로그인하기</button> 
    </div>
  );
};
*/

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};
