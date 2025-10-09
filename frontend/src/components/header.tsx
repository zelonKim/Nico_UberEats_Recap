import React from "react";
import { useMe } from "../hooks/useMe";
import { Link } from "react-router-dom";

interface IHeaderProps {
  email: string;
}

export const Header: React.FC = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div>
          <span>먼저 이메일 인증을 해주세요.</span>
        </div>
      )}
      <header className="py-4">
        <div>헤더</div>
        <span>
          <Link to="/edit-profile">
            <FontAwesomeIcon icon={faUser} className="text-xl" />{" "}
          </Link>
        </span>
      </header>
    </>
  );
};
