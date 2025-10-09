import React from "react";
import { useMe } from "../../hooks/useMe";

export const EditProfile = () => {
  const { data: UserData } = useMe();
  return (
    <div>
      <h1>프로필 수정</h1>;
      <form>
        <input></input>
        <input></input>
      </form>
    </div>
  );
};
