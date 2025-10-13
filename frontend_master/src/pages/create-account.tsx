import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const { register, getValues, errors, handleSubmit, formState } =
    useForm<ICreateAccountForm>({
      mode: "onChange",
      defaultValues: {
        role: UserRole.Client,
      },
    });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      history.push("/");
    }
  };
  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(/uberJoin.png)` }}
      className="flex items-center flex-col pt-28 bg-cover h-screen"
    >
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="Uber Eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5 ml-24">
          Join Us
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5 rounded-md"
        >
          <input
            ref={register({
              required: "Email is required",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            required
            type="email"
            placeholder="이메일"
            className="input w-4/5 ml-16 rounded-md"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            required
            name="password"
            type="password"
            placeholder="비밀번호"
            className="input w-4/5 ml-16 rounded-md"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            required
            name="password"
            type="password"
            placeholder="비밀번호 확인"
            className="input w-4/5 ml-16 rounded-md"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <select
            name="role"
            ref={register({ required: true })}
            className="input w-4/5 ml-16 rounded-md"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"회원가입"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          이미 계정이 있으신가요?{" "}
          <Link to="/" className="text-lime-600 hover:underline font-bold">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};
