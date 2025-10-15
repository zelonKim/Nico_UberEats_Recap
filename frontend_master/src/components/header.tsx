import {
  faUser,
  faSignOutAlt,
  faArrowRight,
  faArrowCircleRight,
  faUserAlt,
  faUserCircle,
  faBell,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { isLoggedInVar, authTokenVar } from "../apollo";
import nuberLogo from "../images/logo.svg";

export const Header: React.FC = () => {
  const { data: userData } = useMe();

  const handleLogout = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    isLoggedInVar(false);
  };

  return (
    <>
      {/* {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>이메일 인증이 완료되지 않았습니다.</span>
        </div>
      )} */}

      <header className="px-4 py-3 bg-gray-50">
        <div className="w-full  max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} className="w-44 ml-4" alt="Uber Eats" />
          </Link>

          <span className="text-md font-normal flex items-center gap-6 text-gray-900">
            <span className="">
              고마운 분, {userData?.me.name || userData?.me.email}님
            </span>
            <Link to="/edit-profile">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-3xl text-lime-600 hover:text-green-700 transition-colors"
              />
            </Link>

            {userData?.me.role !== "Delivery" && (
              <Link to="/orderList">
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-3xl text-yellow-500 hover:text-yellow-600 transition-colors"
                />
              </Link>
            )}

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
