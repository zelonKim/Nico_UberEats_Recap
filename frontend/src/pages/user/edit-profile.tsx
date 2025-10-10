import React from "react";
import { useMe } from "../../hooks/useMe";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "react-query";

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
  password?: string;
}

export const EditProfile = () => {
  const { data: userData, refetch } = useMe();

  const client = useApolloClient();

  const onCompleted = async (data: editProfile) => {
    // graphQL의 리턴 데이터를 받아옴.
    const {
      editProfile: { error, ok },
    } = data;

    if (ok && userData) {
      // const {
      //   me: { email: prevEmail, id },
      // } = userData;

      // const { email: newEmail } = getValues();

      // if (prevEmail !== newEmail) {
      //   client.writeFragment({
      //     // 해당 아이디에 속한 캐시의 일부분을 쓰기함.
      //     id: `User: ${id}`,
      //     fragment: gql`
      //       fragment EditedUser on User {
      //         email
      //         verified
      //       }
      //     `,
      //     data: {
      //       email: newEmail,
      //       verified: true,
      //     },
      //   });
      // }
      await refetch();
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    // 실행할 graphQL 쿼리문을 전달함.
    onCompleted, // 뮤테이션 성공시 호출될 함수를 지정함.
  });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = () => {
    // 버튼을 통해 폼을 제출했을때 호출됨.
    const { email, password } = getValues(); // 사용자가 폼에 입력한 값을 가져옴.

    editProfile({
      variables: {
        // 해당 뮤테이션 함수에 매개변수를 전달함.
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div>
      <h1>프로필 수정</h1>;
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          ref={register} // 해당 name으로 useForm훅에 등록함.
          name="email"
          className="input"
          type="email"
          placeholder="이메일"
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="패스워드"
        />
        <Button
          loading={false}
          canClick={formState.isValid} // 폼의 상태가 유효할 때 클릭할 수 있도록 함.
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
