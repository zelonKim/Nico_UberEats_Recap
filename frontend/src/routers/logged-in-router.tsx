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
import { NotFound } from "../pages/404";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { Order } from "../pages/order";
import { Dashboard } from "../pages/driver/dashboard";

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/restaurants/:id",
    component: <Restaurant />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
  {
    path: "/orders/:id",
    component: <Order />,
  },
];

const restaurantRoutes = [
  {
    path: "/",
    component: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    component: <AddRestaurant />,
  },
];

const driverRoutes = [{ path: "/", component: <Dashboard /> }];

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
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}

        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}

        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}

        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
