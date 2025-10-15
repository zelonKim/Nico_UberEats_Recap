import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";
import { useHistory } from "react-router-dom";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  role?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  address?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();

  const client = useApolloClient();

  const history = useHistory();

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;

    if (ok) {
      alert("프로필이 성공적으로 변경되었습니다.");
      history.push("/");
    }

    if (ok && userData) {
      const {
        me: { name: prevName, address: prevAddress, id },
      } = userData;

      const { name: newName, address: newAddress } = getValues();

      if (prevName !== newName || prevAddress !== newAddress) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              name
              address
            }
          `,
          data: {
            name: newName,
            address: newAddress,
          },
        });
      }
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
      role: userData?.me.role,
      name: userData?.me.name || "",
      address: userData?.me.address || "",
    },
  });

  const onSubmit = () => {
    const { email, password, passwordConfirm, name, address } = getValues();

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
          name,
          address,
        },
      },
    });
  };

  return (
    <div className="my-24 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">나의 프로필</h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          ref={register({
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="email"
          placeholder="이메일"
          disabled
        />

        <input
          ref={register}
          name="role"
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="text"
          disabled
        />

        <input
          ref={register}
          name="name"
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="text"
          placeholder="이름"
        />

        <input
          ref={register}
          name="address"
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="text"
          placeholder="주소"
        />

        <input
          ref={register}
          name="password"
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="password"
          placeholder="비밀번호 변경"
        />

        <input
          ref={register}
          name="passwordConfirm"
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="password"
          placeholder="비밀번호 변경 확인"
        />

        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="저장하기"
        />
      </form>
    </div>
  );
};
