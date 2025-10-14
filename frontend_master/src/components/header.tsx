import {
  faUser,
  faSignOutAlt,
  faArrowRight,
  faArrowCircleRight,
  faUserAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { isLoggedInVar, authTokenVar } from "../apollo";
import nuberLogo from "../images/logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();

  const handleLogout = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    isLoggedInVar(false);
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>이메일 인증이 완료되지 않았습니다.</span>
        </div>
      )}

      <header className="p-4">
        <div className="w-full  max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} className="w-44 ml-4" alt="Uber Eats" />
          </Link>

          <span className="text-xs flex items-center gap-6">
            <Link to="/edit-profile">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-3xl text-gray-700 hover:text-green-800 transition-colors"
              />
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-3xl" />
            </button>
          </span>
        </div>
      </header>
    </>
  );
};
