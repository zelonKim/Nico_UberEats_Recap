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

interface ICreateAccountForm {
  email: string;
  password: string;
  passwordConfirm: string;
  role: UserRole;
}

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

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
      alert("우버이츠 가입이 완료되었습니다.");
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
      const { email, password, passwordConfirm, role } = getValues();

      if (password !== passwordConfirm) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(/uberLogin.jpeg)`,
      }}
      className=" flex items-center flex-col pt-28 bg-cover h-screen"
    >
      <Helmet>
        <title>Create Account | Uber Eats</title>
      </Helmet>

      <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
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
              required: "이메일을 입력해주세요.",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            required
            name="email"
            type="email"
            placeholder="이메일"
            className="input focus:border-green-500 rounded-md w-4/5 ml-16"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"형식이 올바른 이메일을 입력해주세요."} />
          )}

          <input
            ref={register({ required: "비밀번호를 입력해주세요." })}
            required
            name="password"
            type="password"
            placeholder="비밀번호"
            className="input focus:border-green-500 rounded-md w-4/5 ml-16"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}

          <input
            ref={register({ required: "비밀번호 확인을 입력해주세요." })}
            required
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          />
          {errors.passwordConfirm?.message && (
            <FormError errorMessage={errors.passwordConfirm?.message} />
          )}

          <select
            name="role"
            ref={register({ required: true })}
            className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
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

        <div className="text-lg">
          이미 계정이 있으신가요?{" "}
          <Link to="/" className="text-lime-600 hover:underline font-bold">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};
