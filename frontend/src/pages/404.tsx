import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <Helmet>
      <title>Create Account | Number Eats </title>
    </Helmet>
    <h2 className="font-semibold text-xl mb-3">Page Not Found.</h2>
    <Link to="/">Go Back Home &rarr;</Link>
  </div>
);
