import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { LoggedOutRouter } from "./routers/logged-out-router";
import { gql } from "@apollo/client";
import { LoggedInRouter } from "./routers/logged-in-router";
import { isLoggedInVar } from "./apollo";
import { useReactiveVar } from "@apollo/client";

// 반응형 변수값 가져오기 대안
// const IS_LOGGED_IN = gql`
//   query isLoggedIn {
//     isLoggedIn @client
//   }
// `;

function App() {
  // const {
  //   data: { isLoggedIn },
  // } = useQuery(IS_LOGGED_IN); 

  const isLoggedIn = useReactiveVar(isLoggedInVar); // useReactiveVar(반응형 변수)를 통해 해당 반응형 변수값을 가져옴.

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
